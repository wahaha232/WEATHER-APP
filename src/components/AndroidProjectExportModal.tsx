import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  Download,
  X,
  FileCode,
  Layers,
  Sparkles,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

interface AndroidProjectExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProjectFile {
  name: string;
  path: string;
  language: string;
  description: string;
  content: string;
}

export const AndroidProjectExportModal: React.FC<AndroidProjectExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const androidFiles: ProjectFile[] = [
    {
      name: 'MainActivity.kt',
      path: 'app/src/main/java/com/example/weatherapp/MainActivity.kt',
      language: 'kotlin',
      description: 'Android App 主入口，處理 GPS 實際座標抓取、AdMob 初始化與邊緣全螢幕沉浸式視窗',
      content: `package com.example.weatherapp

import android.Manifest
import android.content.pm.PackageManager
import android.location.Geocoder
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.core.content.ContextCompat
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.google.android.gms.tasks.CancellationTokenSource
import com.example.weatherapp.ui.WeatherScreen
import com.example.weatherapp.ui.theme.WeatherAppTheme
import com.example.weatherapp.viewmodel.WeatherViewModel
import java.util.Locale

class MainActivity : ComponentActivity() {

    // 1. 在 Activity 層級透過 by viewModels() 共享 ViewModel
    private val weatherViewModel: WeatherViewModel by viewModels()

    // 2. Google Play Services 位置提供者客戶端
    private lateinit var fusedLocationClient: FusedLocationProviderClient

    // 3. Android 運行時位置授權請求 Launcher
    private val locationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val fineLocationGranted = permissions[Manifest.permission.ACCESS_FINE_LOCATION] ?: false
        val coarseLocationGranted = permissions[Manifest.permission.ACCESS_COARSE_LOCATION] ?: false

        if (fineLocationGranted || coarseLocationGranted) {
            Toast.makeText(this, "已取得位置授權，正在抓取精確 GPS 座標...", Toast.LENGTH_SHORT).show()
            fetchDeviceLocationAndLoadWeather()
        } else {
            Toast.makeText(this, "已拒絕位置授權，使用預設城市 (台北市)", Toast.LENGTH_LONG).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // 初始化 FusedLocationProviderClient
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        // 檢查定位授權：若已授權則直接抓取 GPS，未授權則主動跳出授權請求
        if (hasLocationPermission()) {
            fetchDeviceLocationAndLoadWeather()
        } else {
            checkAndRequestLocationPermissions()
        }

        // 初始化 Google AdMob 廣告 SDK (App ID: ca-app-pub-1512317781873771~8436143739)
        MobileAds.initialize(this) {}

        setContent {
            WeatherAppTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    WeatherScreen(viewModel = weatherViewModel)
                }
            }
        }
    }

    private fun hasLocationPermission(): Boolean {
        val fineGranted = ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        val coarseGranted = ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.ACCESS_COARSE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        return fineGranted || coarseGranted
    }

    private fun checkAndRequestLocationPermissions() {
        locationPermissionLauncher.launch(
            arrayOf(
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION
            )
        )
    }

    /**
     * 實際取得裝置 GPS 座標，並透過 Geocoder 反查城市名稱後載入即時天氣
     */
    private fun fetchDeviceLocationAndLoadWeather() {
        if (!hasLocationPermission()) return

        try {
            val cancellationTokenSource = CancellationTokenSource()
            fusedLocationClient.getCurrentLocation(
                Priority.PRIORITY_HIGH_ACCURACY,
                cancellationTokenSource.token
            ).addOnSuccessListener { location ->
                if (location != null) {
                    val lat = location.latitude
                    val lon = location.longitude
                    val resolvedCityName = resolveCityName(lat, lon) ?: "目前位置"
                    weatherViewModel.loadWeather(lat, lon, resolvedCityName)
                } else {
                    // 若當前精確位置暫時為 null，嘗試使用最後已知位置
                    fusedLocationClient.lastLocation.addOnSuccessListener { lastLoc ->
                        if (lastLoc != null) {
                            val resolvedCityName = resolveCityName(lastLoc.latitude, lastLoc.longitude) ?: "目前位置"
                            weatherViewModel.loadWeather(lastLoc.latitude, lastLoc.longitude, resolvedCityName)
                        } else {
                            Toast.makeText(this, "無法獲取 GPS 座標，使用預設城市", Toast.LENGTH_SHORT).show()
                        }
                    }
                }
            }.addOnFailureListener { e ->
                Toast.makeText(this, "定位失敗: \${e.localizedMessage}", Toast.LENGTH_SHORT).show()
            }
        } catch (e: SecurityException) {
            e.printStackTrace()
        }
    }

    /**
     * 利用 Android Geocoder 將經緯度轉換為易讀的縣市區名稱
     */
    private fun resolveCityName(lat: Double, lon: Double): String? {
        return try {
            val geocoder = Geocoder(this, Locale.TAIWAN)
            val addresses = geocoder.getFromLocation(lat, lon, 1)
            if (!addresses.isNullOrEmpty()) {
                val addr = addresses[0]
                val adminArea = addr.adminArea ?: ""
                val locality = addr.locality ?: addr.subLocality ?: ""
                if (adminArea.isNotEmpty() && locality.isNotEmpty() && adminArea != locality) {
                    "$adminArea$locality"
                } else adminArea.ifEmpty { locality.ifEmpty { addr.featureName } }
            } else null
        } catch (e: Exception) {
            null
        }
    }
}`,
    },
    {
      name: 'WeatherScreen.kt',
      path: 'app/src/main/java/com/example/weatherapp/ui/WeatherScreen.kt',
      language: 'kotlin',
      description: 'Jetpack Compose Material 3 天氣主畫面與底部固定自適應橫幅廣告（AdBannerView、Scaffold 佈局、Lifecycle 資源釋放）',
      content: `package com.example.weatherapp.ui

import android.content.Context
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import com.google.android.gms.ads.AdListener
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.LoadAdError
import com.example.weatherapp.data.WeatherResponse
import com.example.weatherapp.viewmodel.WeatherUiState
import com.example.weatherapp.viewmodel.WeatherViewModel

/**
 * 天氣主畫面 (WeatherScreen)
 * 使用 Scaffold 佈局將 Google AdMob 橫幅廣告固定於螢幕底端 (bottomBar)，
 * 上方 WeatherContent 則能流暢滾動，並自動獲得合適的底部 padding 避免內容被廣告遮蔽。
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WeatherScreen(viewModel: WeatherViewModel) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        containerColor = Color.Transparent,
        bottomBar = {
            // 底部固定自適應橫幅廣告 (Anchored Adaptive Banner)
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .windowInsetsPadding(WindowInsets.navigationBars),
                color = Color(0xFF071F3F).copy(alpha = 0.95f),
                tonalElevation = 8.dp,
                shadowElevation = 8.dp
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp),
                    contentAlignment = Alignment.Center
                ) {
                    AdBannerView(
                        adUnitId = "ca-app-pub-1512317781873771/6879519480",
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        }
    ) { scaffoldPadding ->
        // 背景大氣漸層層
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Color(0xFF0A2649),
                            Color(0xFF0F3A6E),
                            Color(0xFF06182E)
                        )
                    )
                )
        ) {
            when (val state = uiState) {
                is WeatherUiState.Loading -> {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.Center),
                        color = Color.White
                    )
                }
                is WeatherUiState.Error -> {
                    Column(
                        modifier = Modifier
                            .align(Alignment.Center)
                            .padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(text = state.message, color = Color.White)
                        Spacer(modifier = Modifier.height(16.dp))
                        Button(
                            onClick = { viewModel.refresh() },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF38BDF8))
                        ) {
                            Text("重試連線", color = Color.Black, fontWeight = FontWeight.Bold)
                        }
                    }
                }
                is WeatherUiState.Success -> {
                    WeatherContent(
                        weather = state.data,
                        cityName = state.cityName,
                        contentPadding = scaffoldPadding,
                        onRefresh = { viewModel.refresh() }
                    )
                }
            }
        }
    }
}

/**
 * 可重用的 AdMob 自適應橫幅廣告元件 (AdBannerView)
 * 具備生命週期監聽 (DisposableEffect)，自動釋放記憶體資源並具備容錯能力
 */
@Composable
fun AdBannerView(
    adUnitId: String,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val configuration = LocalConfiguration.current
    val screenWidthDp = configuration.screenWidthDp

    // 計算當前方向的自適應橫幅尺寸 (Anchored Adaptive Banner AdSize)
    val adSize = remember(screenWidthDp) {
        AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(context, screenWidthDp)
    }

    // 建立 AdView 物件
    val adView = remember(context, adUnitId, adSize) {
        AdView(context).apply {
            setAdSize(adSize)
            this.adUnitId = adUnitId
            adListener = object : AdListener() {
                override fun onAdLoaded() {
                    // 廣告成功載入
                }
                override fun onAdFailedToLoad(error: LoadAdError) {
                    // 廣告載入失敗時靜默容錯，不干擾主畫面
                }
            }
            loadAd(AdRequest.Builder().build())
        }
    }

    // 當 Compose 元件銷毀或離開畫面時，主動釋放 AdView 資源以避免 Memory Leak
    DisposableEffect(adView) {
        onDispose {
            adView.destroy()
        }
    }

    AndroidView(
        modifier = modifier.wrapContentHeight(),
        factory = { adView }
    )
}

/**
 * 天氣列表內容區塊 (LazyColumn)
 * 自動結合 Scaffold 傳入的 contentPadding，保證滾動至底端時不受 Banner 遮擋
 */
@Composable
fun WeatherContent(
    weather: WeatherResponse,
    cityName: String,
    contentPadding: PaddingValues,
    onRefresh: () -> Unit
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(
            top = contentPadding.calculateTopPadding() + 16.dp,
            bottom = contentPadding.calculateBottomPadding() + 24.dp,
            start = 16.dp,
            end = 16.dp
        ),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // 1. 膠囊質感天氣焦點卡片
        item {
            Card(
                shape = RoundedCornerShape(32.dp),
                colors = CardDefaults.cardColors(
                    containerColor = Color(0xFF0C386D)
                ),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 24.dp, vertical = 20.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = cityName,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Row(verticalAlignment = Alignment.Top) {
                            Text(
                                text = "\${weather.current.temperature_2m.toInt()}",
                                fontSize = 54.sp,
                                fontWeight = FontWeight.Normal,
                                color = Color.White
                            )
                            Text(
                                text = "°",
                                fontSize = 32.sp,
                                color = Color.White
                            )
                        }
                        Text(
                            text = "體感溫度 \${weather.current.apparent_temperature.toInt()}°C",
                            fontSize = 13.sp,
                            color = Color.White.copy(alpha = 0.8f)
                        )
                    }

                    Icon(
                        imageVector = Icons.Default.WbSunny,
                        contentDescription = "Weather Icon",
                        tint = Color(0xFFFBBF24),
                        modifier = Modifier.size(72.dp)
                    )
                }
            }
        }

        // 2. 24 小時逐時預報
        item {
            Card(
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(
                    containerColor = Color(0xFF0B3465).copy(alpha = 0.85f)
                ),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "24 小時逐時預報",
                        color = Color.White,
                        fontWeight = FontWeight.Medium,
                        fontSize = 14.sp
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        val hours = weather.hourly.time.take(24)
                        items(hours.indices.toList()) { i ->
                            HourlyItem(
                                time = hours[i].substringAfter("T"),
                                temp = weather.hourly.temperature_2m.getOrNull(i) ?: 0.0,
                                rainProb = weather.hourly.precipitation_probability.getOrNull(i) ?: 0
                            )
                        }
                    }
                }
            }
        }

        // 3. 7 天天氣趨勢
        item {
            Card(
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(
                    containerColor = Color(0xFF0B3465).copy(alpha = 0.85f)
                ),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "7 天天氣趨勢",
                        color = Color.White,
                        fontWeight = FontWeight.Medium,
                        fontSize = 14.sp
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    weather.daily.time.take(7).forEachIndexed { index, date ->
                        DailyRow(
                            date = date,
                            min = weather.daily.temperature_2m_min.getOrNull(index) ?: 0.0,
                            max = weather.daily.temperature_2m_max.getOrNull(index) ?: 0.0,
                            rainProb = weather.daily.precipitation_probability_max.getOrNull(index) ?: 0
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun HourlyItem(time: String, temp: Double, rainProb: Int) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .clip(RoundedCornerShape(16.dp))
            .background(Color.White.copy(alpha = 0.08f))
            .padding(10.dp)
    ) {
        Text(text = time, color = Color.White.copy(alpha = 0.8f), fontSize = 12.sp)
        Spacer(modifier = Modifier.height(4.dp))
        Text(text = "\${temp.toInt()}°", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
        Text(text = "💧\${rainProb}%", color = Color(0xFF7DD3FC), fontSize = 10.sp)
    }
}

@Composable
fun DailyRow(date: String, min: Double, max: Double, rainProb: Int) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = date, color = Color.White, fontSize = 14.sp, modifier = Modifier.width(90.dp))
        Text(text = "💧 \${rainProb}%", color = Color(0xFF7DD3FC), fontSize = 12.sp)
        Text(text = "\${min.toInt()}° ~ \${max.toInt()}°", color = Color.White, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
    }
}`,
    },
    {
      name: 'WeatherViewModel.kt',
      path: 'app/src/main/java/com/example/weatherapp/viewmodel/WeatherViewModel.kt',
      language: 'kotlin',
      description: 'AndroidViewModel 業務邏輯與狀態管理，抓取最新氣象並自動快取寫入 SharedPreferences 同步刷新桌面 Widget',
      content: `package com.example.weatherapp.viewmodel

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
}`,
    },
    {
      name: 'WeatherWidgetPrefs.kt',
      path: 'app/src/main/java/com/example/weatherapp/widget/WeatherWidgetPrefs.kt',
      language: 'kotlin',
      description: '桌面小工具專用 SharedPreferences 本地快取讀寫管理',
      content: `package com.example.weatherapp.widget

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
        val highLow = "\${maxTemp}° / \${minTemp}°"

        return WidgetWeatherData(
            cityName = cityName,
            temp = temp,
            weatherDesc = weatherDesc,
            highLow = highLow,
            rainProb = rainProb,
            updatedAt = updatedAt
        )
    }
}`,
    },
    {
      name: 'WeatherAppWidget.kt',
      path: 'app/src/main/java/com/example/weatherapp/widget/WeatherAppWidget.kt',
      language: 'kotlin',
      description: 'Android 桌面小工具 Widget 實現 (讀取本地快取、支援動態 WMO 天氣轉換與主動更新)',
      content: `package com.example.weatherapp.widget

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.GlanceTheme
import androidx.glance.action.actionStartActivity
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetManager
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.cornerRadius
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.layout.width
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import androidx.compose.ui.graphics.Color
import com.example.weatherapp.MainActivity

class WeatherAppWidget : GlanceAppWidget() {

    companion object {
        /**
         * 主動廣播通知並刷新所有已放置在桌面上的 WeatherAppWidget 實例
         */
        suspend fun requestUpdateAll(context: Context) {
            try {
                val glanceManager = GlanceAppWidgetManager(context)
                val glanceIds = glanceManager.getGlanceIds(WeatherAppWidget::class.java)
                glanceIds.forEach { glanceId ->
                    WeatherAppWidget().update(context, glanceId)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        /**
         * 將 Open-Meteo WMO 天氣代碼轉換為繁體中文描述
         */
        fun weatherCodeToDescription(code: Int): String {
            return when (code) {
                0 -> "晴朗"
                1 -> "晴間多雲"
                2 -> "多雲"
                3 -> "陰天"
                45, 48 -> "起霧"
                51, 53, 55 -> "毛毛雨"
                56, 57 -> "凍雨"
                61 -> "小雨"
                63 -> "中雨"
                65 -> "大雨"
                66, 67 -> "冰雨"
                71, 73, 75, 77 -> "降雪"
                80, 81, 82 -> "陣雨"
                85, 86 -> "陣雪"
                95 -> "雷陣雨"
                96, 99 -> "雷雨伴冰雹"
                else -> "多雲時晴"
            }
        }
    }

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        // 從 SharedPreferences 快取中讀取最新天氣數據
        val data = WeatherWidgetPrefs.getWeatherData(context)

        provideContent {
            GlanceTheme {
                WeatherWidgetContent(
                    cityName = data.cityName,
                    temp = data.temp,
                    weatherDesc = data.weatherDesc,
                    highLow = data.highLow,
                    rainProb = data.rainProb,
                    updatedAt = data.updatedAt
                )
            }
        }
    }

    @Composable
    private fun WeatherWidgetContent(
        cityName: String,
        temp: String,
        weatherDesc: String,
        highLow: String,
        rainProb: String,
        updatedAt: String
    ) {
        Box(
            modifier = GlanceModifier
                .fillMaxSize()
                .background(Color(0xFF0F172A).copy(alpha = 0.92f))
                .cornerRadius(24.dp)
                .padding(16.dp)
                .clickable(actionStartActivity<MainActivity>())
        ) {
            Column(
                modifier = GlanceModifier.fillMaxSize()
            ) {
                // Header: 城市名稱與最後更新時間標籤
                Row(
                    modifier = GlanceModifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = cityName,
                        style = TextStyle(
                            color = ColorProvider(Color.White),
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold
                        )
                    )
                    Spacer(modifier = GlanceModifier.defaultWeight())
                    Text(
                        text = "更新 $updatedAt",
                        style = TextStyle(
                            color = ColorProvider(Color(0xFF38BDF8)),
                            fontSize = 10.sp
                        )
                    )
                }

                Spacer(modifier = GlanceModifier.height(8.dp))

                // Body: 即時氣溫與天氣現象
                Row(
                    modifier = GlanceModifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = temp,
                        style = TextStyle(
                            color = ColorProvider(Color.White),
                            fontSize = 38.sp,
                            fontWeight = FontWeight.Bold
                        )
                    )
                    Spacer(modifier = GlanceModifier.width(12.dp))
                    Column {
                        Text(
                            text = weatherDesc,
                            style = TextStyle(
                                color = ColorProvider(Color(0xFFBAE6FD)),
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Medium
                            )
                        )
                        Text(
                            text = highLow,
                            style = TextStyle(
                                color = ColorProvider(Color.White.copy(alpha = 0.7f)),
                                fontSize = 12.sp
                            )
                        )
                    }
                    Spacer(modifier = GlanceModifier.defaultWeight())
                    Column(horizontalAlignment = Alignment.End) {
                        Text(
                            text = "降雨機率",
                            style = TextStyle(
                                color = ColorProvider(Color.White.copy(alpha = 0.5f)),
                                fontSize = 10.sp
                            )
                        )
                        Text(
                            text = rainProb,
                            style = TextStyle(
                                color = ColorProvider(Color(0xFF60A5FA)),
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }
                }
            }
        }
    }
}

class WeatherWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = WeatherAppWidget()
}`,
    },
    {
      name: 'weather_widget_info.xml',
      path: 'app/src/main/res/xml/weather_widget_info.xml',
      language: 'xml',
      description: 'Android 桌面小工具尺寸與定期廣播更新設定 (30 分鐘系統標準)',
      content: `<?xml version="1.0" encoding="utf-8"?>
<!-- 
  Android 系統對 updatePeriodMillis 設有 30 分鐘 (1800000 ms) 的硬性下限。
  任何低於 30 分鐘的數值均會被系統限制強制視為 30 分鐘。
  若需要更頻繁或自訂頻率的定時更新，建議搭配 WorkManager 的 PeriodicWorkRequest 實現。
-->
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="180dp"
    android:minHeight="110dp"
    android:targetCellWidth="4"
    android:targetCellHeight="2"
    android:maxResizeWidth="360dp"
    android:maxResizeHeight="240dp"
    android:updatePeriodMillis="1800000"
    android:initialLayout="@layout/glance_default_loading_layout"
    android:resizeMode="horizontal|vertical"
    android:widgetCategory="home_screen|keyguard"
    android:description="@string/widget_description" />`,
    },
    {
      name: 'WeatherApiService.kt',
      path: 'app/src/main/java/com/example/weatherapp/data/WeatherApiService.kt',
      language: 'kotlin',
      description: 'Retrofit 免費 Open-Meteo API 客戶端定義 (無需 API Key)',
      content: `package com.example.weatherapp.data

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import retrofit2.http.Query

interface WeatherApiService {
    @GET("v1/forecast")
    suspend fun getForecast(
        @Query("latitude") latitude: Double,
        @Query("longitude") longitude: Double,
        @Query("current") current: String = "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
        @Query("hourly") hourly: String = "temperature_2m,precipitation_probability,weather_code",
        @Query("daily") daily: String = "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max",
        @Query("timezone") timezone: String = "auto"
    ): WeatherResponse
}

object RetrofitClient {
    private const val BASE_URL = "https://api.open-meteo.com/"

    val apiService: WeatherApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(WeatherApiService::class.java)
    }
}`,
    },
    {
      name: 'WeatherModels.kt',
      path: 'app/src/main/java/com/example/weatherapp/data/WeatherModels.kt',
      language: 'kotlin',
      description: 'Kotlin GSON / Serialization 數據模型類',
      content: `package com.example.weatherapp.data

data class WeatherResponse(
    val latitude: Double,
    val longitude: Double,
    val current: CurrentWeather,
    val hourly: HourlyWeather,
    val daily: DailyWeather
)

data class CurrentWeather(
    val time: String,
    val temperature_2m: Double,
    val relative_humidity_2m: Int,
    val apparent_temperature: Double,
    val is_day: Int,
    val precipitation: Double,
    val weather_code: Int,
    val wind_speed_10m: Double
)

data class HourlyWeather(
    val time: List<String>,
    val temperature_2m: List<Double>,
    val precipitation_probability: List<Int>,
    val weather_code: List<Int>
)

data class DailyWeather(
    val time: List<String>,
    val weather_code: List<Int>,
    val temperature_2m_max: List<Double>,
    val temperature_2m_min: List<Double>,
    val precipitation_probability_max: List<Int>,
    val uv_index_max: List<Double>
) `,
    },
    {
      name: 'AndroidManifest.xml',
      path: 'app/src/main/AndroidManifest.xml',
      language: 'xml',
      description: 'Android 應用程式清單、網路/GPS權限設定與桌面 Widget 接收器註冊',
      content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <!-- 網路權限 (存取免費 Open-Meteo 天氣 API) -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- GPS 定位權限 (自動獲取目前所在地天氣) -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="天氣即時通"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.WeatherApp"
        tools:targetApi="34">
        
        <!-- Google AdMob 應用程式 ID 設定 (App ID) -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-1512317781873771~8436143739"/>

        <!-- 主畫面 Activity -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.WeatherApp">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- 桌面小工具廣播接收器 (Glance AppWidget Receiver) -->
        <receiver
            android:name=".widget.WeatherWidgetReceiver"
            android:exported="true">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data
                android:name="android.appwidget.provider"
                android:resource="@xml/weather_widget_info" />
        </receiver>
    </application>

</manifest>`,
    },
    {
      name: 'build.gradle.kts',
      path: 'app/build.gradle.kts',
      language: 'kotlin',
      description: 'Gradle 建置腳本與依賴庫配置 (Compose, Location, Retrofit, Glance)',
      content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.example.weatherapp"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.weatherapp"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    // Jetpack Compose & Material 3
    implementation(platform("androidx.compose:compose-bom:2024.04.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.activity:activity-ktx:1.9.0")
    implementation("androidx.activity:activity-compose:1.9.0")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.0")
    
    // Google Play Services Location (實際獲取 GPS 座標)
    implementation("com.google.android.gms:play-services-location:21.2.0")
    
    // Retrofit & Gson (天氣 API 連線)
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-gson:2.11.0")
    
    // Kotlin Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.0")
    
    // Google AdMob 廣告 SDK (Google Mobile Ads SDK)
    implementation("com.google.android.gms:play-services-ads:23.3.0")
    
    // Jetpack Glance (Android 桌面小工具 Widget SDK)
    implementation("androidx.glance:glance:1.1.0")
    implementation("androidx.glance:glance-appwidget:1.1.0")
    implementation("androidx.glance:glance-material3:1.1.0")
}`,
    },
  ];

  const currentFile = androidFiles[activeFileIndex];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    // Generate text bundle
    const fullBundle = androidFiles
      .map(
        (f) =>
          `=======================================================\nFILE: ${f.path}\nDESCRIPTION: ${f.description}\n=======================================================\n\n${f.content}\n\n`
      )
      .join('\n');

    const blob = new Blob([fullBundle], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'WeatherApp_Android_SourceFiles.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div
      id="android-project-export-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="android-project-export-modal-container"
        className="w-full max-w-4xl bg-zinc-950 border border-white/20 rounded-3xl shadow-2xl text-white flex flex-col h-[90vh] overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-zinc-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">
                  Android 原生專案檔案總管 (Kotlin & Jetpack Compose)
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                  免費 API 支援
                </span>
              </div>
              <p className="text-xs text-white/60 mt-0.5">
                包含 Android Studio 專案所有必要檔案，可直接複製或打包編譯為 APK
              </p>
            </div>
          </div>

          <button
            id="btn-close-export-modal"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Middle Body: Sidebar with file list + Main Code Viewer */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-full md:w-64 bg-zinc-900/60 border-r border-white/10 p-3 overflow-y-auto space-y-1">
            <div className="text-[11px] font-bold text-white/40 uppercase tracking-wider px-2 py-1">
              專案檔案清單 ({androidFiles.length})
            </div>
            {androidFiles.map((file, idx) => (
              <button
                key={file.name}
                onClick={() => setActiveFileIndex(idx)}
                className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all ${
                  activeFileIndex === idx
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 font-medium'
                    : 'text-white/70 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <FileCode className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="truncate">
                  <div className="text-xs truncate font-mono">{file.name}</div>
                  <div className="text-[10px] text-white/40 truncate mt-0.5">
                    {file.description}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden">
            {/* File Path & Copy Action Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-white/10">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-xs font-mono text-white/80 truncate">
                  {currentFile.path}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  id="btn-copy-android-code"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-medium text-white transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">已複製</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>複製此檔案</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Code Pre container */}
            <div className="flex-1 p-4 overflow-auto bg-black/40 font-mono text-xs text-emerald-200/90 leading-relaxed selection:bg-sky-500/30">
              <pre className="whitespace-pre">{currentFile.content}</pre>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-4 bg-zinc-900/90 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-white/60">
            💡 使用說明：在 Android Studio 中新建 Empty Compose Activity，將對應代碼貼入即可直接執行！
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="btn-download-all-code"
              onClick={handleDownloadAll}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-medium text-xs shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span>匯出所有 Android 專案源碼 (.txt 整合包)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
