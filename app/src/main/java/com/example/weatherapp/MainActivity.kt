package com.example.weatherapp

import android.Manifest
import android.content.pm.PackageManager
import android.location.Address
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
                    resolveCityName(lat, lon) { resolvedCityName ->
                        weatherViewModel.loadWeather(lat, lon, resolvedCityName ?: "目前位置")
                    }
                } else {
                    // 若當前精確位置暫時為 null，嘗試使用最後已知位置
                    fusedLocationClient.lastLocation.addOnSuccessListener { lastLoc ->
                        if (lastLoc != null) {
                            resolveCityName(lastLoc.latitude, lastLoc.longitude) { resolvedCityName ->
                                weatherViewModel.loadWeather(lastLoc.latitude, lastLoc.longitude, resolvedCityName ?: "目前位置")
                            }
                        } else {
                            Toast.makeText(this, "無法獲取 GPS 座標，使用預設城市", Toast.LENGTH_SHORT).show()
                        }
                    }
                }
            }.addOnFailureListener { e ->
                Toast.makeText(this, "定位失敗: ${e.localizedMessage}", Toast.LENGTH_SHORT).show()
            }
        } catch (e: SecurityException) {
            e.printStackTrace()
        }
    }

    /**
     * 利用 Android Geocoder 將經緯度轉換為易讀的縣市區名稱。
     * Android 13 (API 33) 起 Geocoder 提供非同步 GeocodeListener API 取代已棄用的同步方法，
     * 因此依系統版本分流呼叫，並統一透過 callback 回傳結果。
     */
    private fun resolveCityName(lat: Double, lon: Double, callback: (String?) -> Unit) {
        try {
            val geocoder = Geocoder(this, Locale.TAIWAN)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                geocoder.getFromLocation(lat, lon, 1, object : Geocoder.GeocodeListener {
                    override fun onGeocode(addresses: MutableList<Address>) {
                        callback(extractCityName(addresses))
                    }

                    override fun onError(errorMessage: String?) {
                        callback(null)
                    }
                })
            } else {
                @Suppress("DEPRECATION")
                val addresses = geocoder.getFromLocation(lat, lon, 1)
                callback(extractCityName(addresses))
            }
        } catch (e: Exception) {
            callback(null)
        }
    }

    private fun extractCityName(addresses: List<Address>?): String? {
        if (addresses.isNullOrEmpty()) return null
        val addr = addresses[0]
        val adminArea = addr.adminArea ?: ""
        val locality = addr.locality ?: addr.subLocality ?: ""
        return if (adminArea.isNotEmpty() && locality.isNotEmpty() && adminArea != locality) {
            "$adminArea$locality"
        } else adminArea.ifEmpty { locality.ifEmpty { addr.featureName } }
    }
}
