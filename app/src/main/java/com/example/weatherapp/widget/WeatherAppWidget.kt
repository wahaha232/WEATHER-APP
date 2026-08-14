package com.example.weatherapp.widget

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
}
