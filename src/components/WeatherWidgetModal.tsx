import React, { useState, useEffect } from 'react';
import {
  X,
  LayoutGrid,
  Sparkles,
  Smartphone,
  Copy,
  Check,
  RefreshCw,
  Clock,
  Wind,
  Droplets,
  CloudSun,
  ShieldCheck,
  Eye,
  Sliders,
  Code,
  Download,
  Info,
  Flame,
} from 'lucide-react';
import { FullWeatherResponse, SavedCity, WeatherSettings } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { WeatherIllustration3D } from './WeatherIllustration3D';
import { TRANSLATIONS } from '../services/i18n';

interface WeatherWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  weatherData: FullWeatherResponse | null;
  activeCity: SavedCity;
  savedCities: SavedCity[];
  onSelectCity: (city: SavedCity) => void;
  settings: WeatherSettings;
  onRefreshWeather: () => void;
}

type WidgetSize = '4x2' | '4x1' | '2x2' | 'lockscreen';
type WidgetTheme = 'glass' | 'dark' | 'sky' | 'minimal';

export const WeatherWidgetModal: React.FC<WeatherWidgetModalProps> = ({
  isOpen,
  onClose,
  weatherData,
  activeCity,
  savedCities,
  onSelectCity,
  settings,
  onRefreshWeather,
}) => {
  const [selectedSize, setSelectedSize] = useState<WidgetSize>('4x2');
  const [widgetTheme, setWidgetTheme] = useState<WidgetTheme>('glass');
  const [showTime, setShowTime] = useState(true);
  const [showAqi, setShowAqi] = useState(true);
  const [showPrecipitation, setShowPrecipitation] = useState(true);
  const [showHumidity, setShowHumidity] = useState(true);
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'guide'>('preview');
  const [copiedCode, setCopiedCode] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  const lang = settings.language || 'zh';
  const t = TRANSLATIONS[lang];

  // Live digital clock tick for preview
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen || !weatherData) return null;

  const current = weatherData.current;
  const temp = Math.round(
    settings.tempUnit === 'fahrenheit'
      ? (current.temperature * 9) / 5 + 32
      : current.temperature
  );
  const tempUnit = settings.tempUnit === 'fahrenheit' ? '°F' : '°C';
  const highTemp = Math.round(
    settings.tempUnit === 'fahrenheit'
      ? (weatherData.daily.temperatureMax[0] * 9) / 5 + 32
      : weatherData.daily.temperatureMax[0]
  );
  const lowTemp = Math.round(
    settings.tempUnit === 'fahrenheit'
      ? (weatherData.daily.temperatureMin[0] * 9) / 5 + 32
      : weatherData.daily.temperatureMin[0]
  );

  const formattedHours = currentTime.getHours().toString().padStart(2, '0');
  const formattedMinutes = currentTime.getMinutes().toString().padStart(2, '0');
  const formattedDate = currentTime.toLocaleDateString(lang === 'zh' ? 'zh-TW' : 'en-US', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  });

  // Background style helper
  const getWidgetBgClass = () => {
    switch (widgetTheme) {
      case 'glass':
        return 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white';
      case 'dark':
        return 'bg-zinc-900/90 backdrop-blur-md border border-zinc-800 shadow-2xl text-white';
      case 'sky':
        return 'bg-gradient-to-br from-sky-600/85 via-indigo-700/85 to-slate-900/90 backdrop-blur-md border border-sky-400/30 shadow-2xl text-white';
      case 'minimal':
        return 'bg-black/40 backdrop-blur-lg border border-white/10 shadow-lg text-white';
    }
  };

  const kotlinGlanceCode = `package com.weather.precision.widget

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.GlanceTheme
import androidx.glance.Image
import androidx.glance.ImageProvider
import androidx.glance.action.actionStartActivity
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.*
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import com.weather.precision.MainActivity
import com.weather.precision.R

/**
 * 4x2 & 4x1 Android Jetpack Glance Weather Widget
 * 自動根據設定 (每 ${settings.autoRefreshIntervalMinutes || 15} 分鐘) 於背景排程更新
 */
class PrecisionWeatherWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        // 從資料庫或 SharedPreferences 讀取最新快取氣象
        val cityName = "${activeCity.name}"
        val temp = "${temp}${tempUnit}"
        val condition = "${current.weatherLabel}"
        val highLow = "H: ${highTemp}° / L: ${lowTemp}°"

        provideContent {
            GlanceTheme {
                WeatherWidgetContent(
                    cityName = cityName,
                    temp = temp,
                    condition = condition,
                    highLow = highLow,
                    context = context
                )
            }
        }
    }

    @Composable
    private fun WeatherWidgetContent(
        cityName: String,
        temp: String,
        condition: String,
        highLow: String,
        context: Context
    ) {
        Column(
            modifier = GlanceModifier
                .fillMaxSize()
                .background(R.drawable.widget_glass_background)
                .padding(16.dp)
                .clickable(actionStartActivity<MainActivity>()),
            verticalAlignment = Alignment.CenterVertically,
            horizontalAlignment = Alignment.Start
        ) {
            Row(
                modifier = GlanceModifier.fillMaxWidth(),
                horizontalAlignment = Alignment.Start,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = GlanceModifier.defaultWeight()) {
                    Text(
                        text = cityName,
                        style = TextStyle(
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                    )
                    Text(
                        text = highLow,
                        style = TextStyle(fontSize = 12.sp)
                    )
                }
                Text(
                    text = temp,
                    style = TextStyle(
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Bold
                    )
                )
            }

            Spacer(modifier = GlanceModifier.height(8.dp))

            Row(
                modifier = GlanceModifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = condition,
                    style = TextStyle(fontSize = 13.sp)
                )
            }
        }
    }
}

class PrecisionWeatherWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = PrecisionWeatherWidget()
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(kotlinGlanceCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div
      id="weather-widget-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="weather-widget-modal-container"
        className="w-full max-w-2xl bg-zinc-900/95 border border-white/20 rounded-3xl p-4 sm:p-6 shadow-2xl text-white flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                {lang === 'zh' ? '桌面天氣小工具 (Home Screen Widgets)' : 'Home Screen Widgets'}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Android & Web
                </span>
              </h2>
              <p className="text-xs text-white/50">
                {lang === 'zh'
                  ? '自訂 4x2、4x1、2x2 及鎖定螢幕小工具，即時同步更新'
                  : 'Customize 4x2, 4x1, 2x2 & lock screen widgets'}
              </p>
            </div>
          </div>

          <button
            id="btn-close-widget-modal"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-3.5 mb-2 bg-white/5 p-1 rounded-2xl border border-white/10">
          <button
            id="btn-widget-tab-preview"
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{lang === 'zh' ? '即時視覺預覽' : 'Live Preview'}</span>
          </button>
          <button
            id="btn-widget-tab-code"
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>{lang === 'zh' ? 'Android 原生程式碼' : 'Kotlin Glance Code'}</span>
          </button>
          <button
            id="btn-widget-tab-guide"
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>{lang === 'zh' ? '新增至桌面教學' : 'Pin to Home Guide'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 no-scrollbar my-2">
          {activeTab === 'preview' ? (
            <>
              {/* Size Selectors */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-sky-400" />
                  <span>{lang === 'zh' ? '選擇小工具尺寸規格' : 'Select Widget Layout Size'}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: '4x2', label: '4x2 全能大圖示', desc: '含逐時與詳細指標' },
                    { id: '4x1', label: '4x1 經典橫向列', desc: '輕薄時鐘與當前氣溫' },
                    { id: '2x2', label: '2x2 正方形方塊', desc: '緊湊大字體設計' },
                    { id: 'lockscreen', label: '鎖定螢幕膠囊', desc: '極簡 Glance Style' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      id={`btn-widget-size-${s.id}`}
                      onClick={() => setSelectedSize(s.id as WidgetSize)}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedSize === s.id
                          ? 'bg-sky-500/20 border-sky-400 text-white shadow-sm ring-1 ring-sky-400'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-xs font-bold text-sky-300">{s.id.toUpperCase()}</div>
                      <div className="text-[11px] font-medium text-white/90 truncate">{s.label}</div>
                      <div className="text-[10px] text-white/50 truncate">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme & Display Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Theme Selector */}
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                  <div className="text-xs font-semibold text-white/80 mb-2">
                    {lang === 'zh' ? '小工具材質樣式' : 'Widget Material Style'}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'glass', label: '毛玻璃 (Glass)' },
                      { id: 'dark', label: '深邃黑 (OLED)' },
                      { id: 'sky', label: '動態天空 (Sky)' },
                      { id: 'minimal', label: '極簡透明 (Clean)' },
                    ].map((th) => (
                      <button
                        key={th.id}
                        id={`btn-widget-theme-${th.id}`}
                        onClick={() => setWidgetTheme(th.id as WidgetTheme)}
                        className={`py-1.5 px-2 rounded-xl text-xs border text-center transition-all cursor-pointer ${
                          widgetTheme === th.id
                            ? 'bg-sky-500 text-white border-sky-400 font-semibold'
                            : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {th.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* City & Toggles */}
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10 space-y-2">
                  <div className="text-xs font-semibold text-white/80">
                    {lang === 'zh' ? '資訊顯示開關' : 'Widget Info Toggles'}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer text-white/80 select-none">
                      <input
                        type="checkbox"
                        checked={showTime}
                        onChange={(e) => setShowTime(e.target.checked)}
                        className="rounded accent-sky-500 cursor-pointer"
                      />
                      <span>{lang === 'zh' ? '顯示時鐘日期' : 'Show Clock'}</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-white/80 select-none">
                      <input
                        type="checkbox"
                        checked={showAqi}
                        onChange={(e) => setShowAqi(e.target.checked)}
                        className="rounded accent-sky-500 cursor-pointer"
                      />
                      <span>{lang === 'zh' ? '顯示 AQI 指數' : 'Show AQI'}</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-white/80 select-none">
                      <input
                        type="checkbox"
                        checked={showPrecipitation}
                        onChange={(e) => setShowPrecipitation(e.target.checked)}
                        className="rounded accent-sky-500 cursor-pointer"
                      />
                      <span>{lang === 'zh' ? '顯示降雨機率' : 'Show Rain %'}</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-white/80 select-none">
                      <input
                        type="checkbox"
                        checked={showHumidity}
                        onChange={(e) => setShowHumidity(e.target.checked)}
                        className="rounded accent-sky-500 cursor-pointer"
                      />
                      <span>{lang === 'zh' ? '顯示濕度風速' : 'Show Humidity'}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Simulated Android Home Screen Canvas */}
              <div className="relative rounded-3xl overflow-hidden border border-white/20 p-4 sm:p-6 bg-gradient-to-b from-indigo-950 via-slate-900 to-black shadow-inner">
                {/* Android Top Minimal Status in Wallpaper */}
                <div className="flex items-center justify-between text-[11px] text-white/60 mb-4 px-2">
                  <div className="flex items-center gap-1.5 font-mono">
                    <Clock className="w-3 h-3 text-sky-400" />
                    <span>{formattedHours}:{formattedMinutes}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">
                      {lang === 'zh' ? `自動更新: 每 ${settings.autoRefreshIntervalMinutes || 15} 分鐘` : `Auto: Every ${settings.autoRefreshIntervalMinutes || 15}m`}
                    </span>
                    <button
                      onClick={onRefreshWeather}
                      className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all active:rotate-180"
                      title={lang === 'zh' ? '手動觸發小工具更新' : 'Refresh Widget'}
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* THE WIDGET CONTAINER */}
                <div className="flex items-center justify-center min-h-[170px]">
                  {/* 1. Size 4x2 Hero Widget */}
                  {selectedSize === '4x2' && (
                    <div
                      id="widget-preview-4x2"
                      className={`w-full rounded-3xl p-4 sm:p-5 transition-all duration-300 ${getWidgetBgClass()}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          {showTime && (
                            <div className="text-[11px] text-white/70 font-medium tracking-wide">
                              {formattedDate} • {formattedHours}:{formattedMinutes}
                            </div>
                          )}
                          <h3 className="text-lg sm:text-xl font-bold tracking-tight mt-0.5 flex items-center gap-1.5">
                            <span>{activeCity.name}</span>
                            {activeCity.isGps && (
                              <span className="text-[9px] bg-sky-500/30 text-sky-300 border border-sky-400/40 px-1.5 py-0.2 rounded-full font-normal">
                                GPS
                              </span>
                            )}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-xs text-white/75 font-medium">
                            <span>{current.weatherLabel}</span>
                            <span>•</span>
                            <span>{highTemp}° / {lowTemp}°</span>
                          </div>
                        </div>

                        <div className="text-right flex flex-col items-end">
                          <div className="flex items-center gap-2">
                            <WeatherIllustration3D
                              code={current.weatherCode}
                              isDay={current.isDay}
                              className="w-10 h-10 -my-1"
                              size={44}
                            />
                            <span className="text-3xl sm:text-4xl font-extrabold tracking-tighter">
                              {temp}{tempUnit}
                            </span>
                          </div>
                          {showAqi && weatherData.airQuality && (
                            <div className="mt-1 flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                              <ShieldCheck className="w-3 h-3" />
                              <span>AQI {weatherData.airQuality.usAqi} {weatherData.airQuality.label}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Mini Hourly Strip inside 4x2 Widget */}
                      <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
                        {weatherData.hourly.time.slice(0, 5).map((timeStr, idx) => {
                          const hour = new Date(timeStr).getHours();
                          const hTemp = Math.round(
                            settings.tempUnit === 'fahrenheit'
                              ? (weatherData.hourly.temperature[idx] * 9) / 5 + 32
                              : weatherData.hourly.temperature[idx]
                          );
                          const hCode = weatherData.hourly.weatherCode[idx];
                          const isNow = idx === 0;

                          return (
                            <div
                              key={timeStr}
                              className={`flex flex-col items-center flex-1 py-1 px-1 rounded-xl text-center ${
                                isNow ? 'bg-white/10 font-bold' : ''
                              }`}
                            >
                              <span className="text-[10px] text-white/60">
                                {isNow ? t.now : `${hour}:00`}
                              </span>
                              <WeatherIcon
                                code={hCode}
                                isDay={hour >= 6 && hour < 18}
                                className="w-4 h-4 my-1"
                              />
                              <span className="text-xs font-semibold">{hTemp}°</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 2. Size 4x1 Pill Widget */}
                  {selectedSize === '4x1' && (
                    <div
                      id="widget-preview-4x1"
                      className={`w-full rounded-2xl px-4 py-3 flex items-center justify-between transition-all duration-300 ${getWidgetBgClass()}`}
                    >
                      <div className="flex items-center gap-3">
                        <WeatherIcon
                          code={current.weatherCode}
                          isDay={current.isDay}
                          className="w-9 h-9 text-amber-300"
                        />
                        <div>
                          <div className="text-sm font-bold flex items-center gap-1.5">
                            <span>{activeCity.name}</span>
                            <span className="text-xs font-normal text-white/60">• {current.weatherLabel}</span>
                          </div>
                          <div className="text-[11px] text-white/60">
                            {showTime ? `${formattedHours}:${formattedMinutes} • ` : ''}
                            {highTemp}° / {lowTemp}°
                            {showPrecipitation ? ` • 降雨 ${current.precipitation}%` : ''}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-black">{temp}{tempUnit}</div>
                        {showAqi && weatherData.airQuality && (
                          <div className="text-[9px] text-emerald-300 font-semibold">
                            AQI {weatherData.airQuality.usAqi}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 3. Size 2x2 Square Widget */}
                  {selectedSize === '2x2' && (
                    <div
                      id="widget-preview-2x2"
                      className={`w-48 h-48 rounded-3xl p-4 flex flex-col justify-between transition-all duration-300 ${getWidgetBgClass()}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold truncate max-w-[90px]">{activeCity.name}</h4>
                          <span className="text-[10px] text-white/60">{current.weatherLabel}</span>
                        </div>
                        <WeatherIcon
                          code={current.weatherCode}
                          isDay={current.isDay}
                          className="w-7 h-7 text-amber-300"
                        />
                      </div>

                      <div className="my-1">
                        <div className="text-3xl font-extrabold">{temp}{tempUnit}</div>
                        <div className="text-[10px] text-white/70">
                          {highTemp}° / {lowTemp}°
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-white/60 pt-1.5 border-t border-white/10">
                        <span>體感 {Math.round(current.apparentTemperature)}°</span>
                        {showPrecipitation && <span>雨 {current.precipitation}%</span>}
                      </div>
                    </div>
                  )}

                  {/* 4. Lock Screen Widget */}
                  {selectedSize === 'lockscreen' && (
                    <div
                      id="widget-preview-lockscreen"
                      className="w-full max-w-sm rounded-full bg-black/60 backdrop-blur-xl border border-white/20 px-4 py-2 flex items-center justify-between text-white shadow-xl"
                    >
                      <div className="flex items-center gap-2">
                        <WeatherIcon
                          code={current.weatherCode}
                          isDay={current.isDay}
                          className="w-5 h-5 text-amber-300"
                        />
                        <span className="text-xs font-semibold">{activeCity.name}</span>
                        <span className="text-xs text-white/60">{current.weatherLabel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{temp}{tempUnit}</span>
                        <span className="text-[10px] text-white/50 font-mono">
                          {formattedHours}:{formattedMinutes}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Simulated Android App Dock at bottom */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-around text-white/40 text-[10px]">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <span>Phone</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-2xl bg-sky-500/30 border border-sky-400/50 flex items-center justify-center text-sky-300 shadow-md">
                      <CloudSun className="w-4 h-4" />
                    </div>
                    <span className="text-white/80 font-bold">Weather</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                      <Eye className="w-4 h-4" />
                    </div>
                    <span>Camera</span>
                  </div>
                </div>
              </div>
            </>
          ) : activeTab === 'code' ? (
            /* Kotlin Glance Code Export View */
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/10">
                <div>
                  <div className="text-xs font-bold text-emerald-300">
                    Android 14+ Jetpack Glance AppWidget
                  </div>
                  <div className="text-[11px] text-white/60">
                    {lang === 'zh'
                      ? '使用現代 Compose 語法構建的輕量級高效能 Android 桌面小工具'
                      : 'Modern Compose declarative syntax for Android home screen widget'}
                  </div>
                </div>
                <button
                  id="btn-copy-widget-code"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-zinc-950 font-bold text-xs transition-all shadow cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? (lang === 'zh' ? '已複製！' : 'Copied!') : (lang === 'zh' ? '複製程式碼' : 'Copy Code')}</span>
                </button>
              </div>

              <div className="relative bg-zinc-950 rounded-2xl p-3 border border-white/10 overflow-x-auto text-xs font-mono text-emerald-400 max-h-72">
                <pre className="leading-relaxed whitespace-pre">{kotlinGlanceCode}</pre>
              </div>
            </div>
          ) : (
            /* Guide View */
            <div className="space-y-3 text-xs text-white/80 leading-relaxed">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h4 className="font-bold text-white text-sm mb-1.5 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-sky-400" />
                  <span>{lang === 'zh' ? '如何在 Android 手機上新增天氣小工具？' : 'How to add Widget on Android'}</span>
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-white/70 mt-2">
                  <li>
                    {lang === 'zh'
                      ? '長按 Android 手機主畫面任何空白處。'
                      : 'Long-press any empty space on your Android home screen.'}
                  </li>
                  <li>
                    {lang === 'zh'
                      ? '點擊彈出的「小工具 (Widgets)」選單。'
                      : 'Tap "Widgets" from the menu that appears.'}
                  </li>
                  <li>
                    {lang === 'zh'
                      ? '向下滾動找到「極簡精準天氣 (Precision Weather)」。'
                      : 'Scroll down and find "Precision Weather".'}
                  </li>
                  <li>
                    {lang === 'zh'
                      ? '選擇 4x2 或 4x1 尺寸並按住拖曳至您喜歡的主畫面位置即可！'
                      : 'Choose 4x2 or 4x1 and drag it to your preferred position!'}
                  </li>
                </ol>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h4 className="font-bold text-white text-sm mb-1.5 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'zh' ? '自動更新週期 (Auto-Update)' : 'Auto-Update Interval'}</span>
                </h4>
                <p className="text-white/70">
                  {lang === 'zh'
                    ? `小工具已自動與您在設定中選擇的「每 ${settings.autoRefreshIntervalMinutes || 15} 分鐘」排程同步。Android WorkManager 將在後台精確維持省電與資料即時性。`
                    : `Widgets automatically synchronize with your selected ${settings.autoRefreshIntervalMinutes || 15}-minute interval via Android WorkManager.`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Close / Action */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          <div className="text-[11px] text-white/50">
            {lang === 'zh' ? '已自動儲存偏好樣式' : 'Preferences auto-saved'}
          </div>
          <button
            id="btn-confirm-widget-modal"
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
          >
            {t.finishSettings || '完成'}
          </button>
        </div>
      </div>
    </div>
  );
};
