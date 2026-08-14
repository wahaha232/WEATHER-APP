package com.example.weatherapp.widget

import android.content.Context
import android.content.SharedPreferences
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

data class WidgetWeatherData(
    val cityName: String,
    val temp: String,
    val weatherDesc: String,
    val highLow: String,
    val rainProb: String,
    val updatedAt: String
)

object WeatherWidgetPrefs {
    private const val PREFS_NAME = "weather_widget_prefs"
    private const val KEY_CITY_NAME = "city_name"
    private const val KEY_TEMP = "temp"
    private const val KEY_WEATHER_CODE = "weather_code"
    private const val KEY_MIN_TEMP = "min_temp"
    private const val KEY_MAX_TEMP = "max_temp"
    private const val KEY_RAIN_PROB = "rain_prob"
    private const val KEY_UPDATED_AT = "updated_at"

    private fun getPrefs(context: Context): SharedPreferences {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    /**
     * 儲存最新天氣數據至 SharedPreferences 快取
     */
    fun saveWeatherData(
        context: Context,
        cityName: String,
        currentTemp: Double,
        weatherCode: Int,
        minTemp: Double,
        maxTemp: Double,
        rainProb: Int
    ) {
        val timeFormat = SimpleDateFormat("HH:mm", Locale.getDefault())
        val updatedTime = timeFormat.format(Date())

        getPrefs(context).edit()
            .putString(KEY_CITY_NAME, cityName)
            .putFloat(KEY_TEMP, currentTemp.toFloat())
            .putInt(KEY_WEATHER_CODE, weatherCode)
            .putFloat(KEY_MIN_TEMP, minTemp.toFloat())
            .putFloat(KEY_MAX_TEMP, maxTemp.toFloat())
            .putInt(KEY_RAIN_PROB, rainProb)
            .putString(KEY_UPDATED_AT, updatedTime)
            .apply()
    }

    /**
     * 讀取桌面小工具快取資料
     */
    fun getWeatherData(context: Context): WidgetWeatherData {
        val prefs = getPrefs(context)
        val cityName = prefs.getString(KEY_CITY_NAME, "台北市") ?: "台北市"
        val temp = prefs.getFloat(KEY_TEMP, 26f).toInt().toString() + "°"
        val weatherCode = prefs.getInt(KEY_WEATHER_CODE, 1)
        val minTemp = prefs.getFloat(KEY_MIN_TEMP, 22f).toInt()
        val maxTemp = prefs.getFloat(KEY_MAX_TEMP, 29f).toInt()
        val rainProb = prefs.getInt(KEY_RAIN_PROB, 15).toString() + "%"
        val updatedAt = prefs.getString(KEY_UPDATED_AT, "剛剛") ?: "剛剛"

        val weatherDesc = WeatherAppWidget.weatherCodeToDescription(weatherCode)
        val highLow = "${maxTemp}° / ${minTemp}°"

        return WidgetWeatherData(
            cityName = cityName,
            temp = temp,
            weatherDesc = weatherDesc,
            highLow = highLow,
            rainProb = rainProb,
            updatedAt = updatedAt
        )
    }
}
