package com.example.weatherapp.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.weatherapp.data.RetrofitClient
import com.example.weatherapp.data.WeatherResponse
import com.example.weatherapp.widget.WeatherAppWidget
import com.example.weatherapp.widget.WeatherWidgetPrefs
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed interface WeatherUiState {
    object Loading : WeatherUiState
    data class Success(val data: WeatherResponse, val cityName: String) : WeatherUiState
    data class Error(val message: String) : WeatherUiState
}

class WeatherViewModel(application: Application) : AndroidViewModel(application) {
    private val _uiState = MutableStateFlow<WeatherUiState>(WeatherUiState.Loading)
    val uiState: StateFlow<WeatherUiState> = _uiState.asStateFlow()

    private var currentLat = 25.0478
    private var currentLon = 121.5319
    private var currentCityName = "台北市"

    init {
        loadWeather(currentLat, currentLon, currentCityName)
    }

    fun loadWeather(lat: Double, lon: Double, cityName: String) {
        currentLat = lat
        currentLon = lon
        currentCityName = cityName
        viewModelScope.launch {
            _uiState.value = WeatherUiState.Loading
            try {
                val response = RetrofitClient.apiService.getForecast(
                    latitude = lat,
                    longitude = lon
                )
                _uiState.value = WeatherUiState.Success(response, cityName)

                // 成功抓取天氣後，將最新資料寫入 SharedPreferences 快取，並即時廣播刷新所有桌面小工具 (Widgets)
                val current = response.current
                val minTemp = response.daily.temperature_2m_min.firstOrNull() ?: current.temperature_2m
                val maxTemp = response.daily.temperature_2m_max.firstOrNull() ?: current.temperature_2m
                val rainProb = response.daily.precipitation_probability_max.firstOrNull() ?: 0

                WeatherWidgetPrefs.saveWeatherData(
                    context = getApplication(),
                    cityName = cityName,
                    currentTemp = current.temperature_2m,
                    weatherCode = current.weather_code,
                    minTemp = minTemp,
                    maxTemp = maxTemp,
                    rainProb = rainProb
                )

                // 主動通知 Jetpack Glance 刷新所有桌面小工具實例
                WeatherAppWidget.requestUpdateAll(getApplication())

            } catch (e: Exception) {
                _uiState.value = WeatherUiState.Error(e.localizedMessage ?: "獲取天氣失敗，請檢查網路連線")
            }
        }
    }

    fun refresh() {
        loadWeather(currentLat, currentLon, currentCityName)
    }
}
