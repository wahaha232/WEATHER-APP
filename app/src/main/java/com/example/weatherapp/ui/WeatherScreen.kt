package com.example.weatherapp.ui

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
                                text = "${weather.current.temperature_2m.toInt()}",
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
                            text = "體感溫度 ${weather.current.apparent_temperature.toInt()}°C",
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
        Text(text = "${temp.toInt()}°", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
        Text(text = "💧${rainProb}%", color = Color(0xFF7DD3FC), fontSize = 10.sp)
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
        Text(text = "💧 ${rainProb}%", color = Color(0xFF7DD3FC), fontSize = 12.sp)
        Text(text = "${min.toInt()}° ~ ${max.toInt()}°", color = Color.White, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
    }
}
