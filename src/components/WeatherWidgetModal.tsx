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
  Globe,
} from 'lucide-react';
import { FullWeatherResponse, SavedCity, WeatherSettings } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { WeatherIllustration3D } from './WeatherIllustration3D';
import { TRANSLATIONS } from '../services/i18n';
import { formatLocalTime, resolveTimezone, isDaylightSavingTime } from '../services/timeService';

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

type WidgetSize = '4x2' | '4x1' | '2x2' | 'dual_clock' | 'lockscreen';
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

  // Update clock every second
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

  // Time & DST for primary city
  const primaryTz = resolveTimezone(activeCity.timezone, activeCity.latitude, activeCity.longitude);
  const primaryTimeFormatted = formatLocalTime(
    currentTime,
    primaryTz,
    settings.timeFormat === '12h',
    lang
  );
  const isPrimaryDst = isDaylightSavingTime(currentTime, primaryTz);

  // Time & DST for optional secondary city
  const secondaryCity = savedCities.find(
    (c) => String(c.id) === String(settings.secondaryCityId) && String(c.id) !== String(activeCity.id)
  ) || savedCities.find((c) => String(c.id) !== String(activeCity.id));

  const secondaryTz = secondaryCity
    ? resolveTimezone(secondaryCity.timezone, secondaryCity.latitude, secondaryCity.longitude)
    : undefined;
  const secondaryTimeFormatted = secondaryTz
    ? formatLocalTime(currentTime, secondaryTz, settings.timeFormat === '12h', lang)
    : null;
  const isSecondaryDst = secondaryTz ? isDaylightSavingTime(currentTime, secondaryTz) : false;

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
import java.time.ZonedDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter

/**
 * 4x2, 4x1 & Dual Clock Android Jetpack Glance Weather Widget
 * 自動支援 12/24 小時制 (${settings.timeFormat || '24h'}) 與日光節約時間 (DST)
 */
class PrecisionWeatherWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val cityName = "${activeCity.name}"
        val temp = "${temp}${tempUnit}"
        val condition = "${current.weatherCode}"
        val highLow = "H: ${highTemp}° / L: ${lowTemp}°"
        val timeFormat = "${settings.timeFormat || '24h'}"
        val timezoneId = "${primaryTz}"

        provideContent {
            GlanceTheme {
                WeatherWidgetContent(
                    cityName = cityName,
                    temp = temp,
                    highLow = highLow,
                    timezoneId = timezoneId,
                    timeFormat = timeFormat,
                    context = context
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
                  ? '自訂 4x2、4x1、2x2、雙時區時鐘及鎖定螢幕小工具，即時同步更新'
                  : 'Customize 4x2, 4x1, 2x2, Dual-Clock & lock screen widgets'}
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
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: '4x2', label: '4x2 大卡片' },
                    { id: '4x1', label: '4x1 長條' },
                    { id: '2x2', label: '2x2 正方' },
                    { id: 'dual_clock', label: '雙時區時鐘' },
                    { id: 'lockscreen', label: '鎖定螢幕' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      id={`btn-widget-size-${s.id}`}
                      onClick={() => setSelectedSize(s.id as WidgetSize)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        selectedSize === s.id
                          ? 'bg-sky-500 text-white border-sky-400 shadow-md font-bold'
                          : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme & Controls Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Theme Selector */}
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10 space-y-2">
                  <div className="text-xs font-medium text-white/70 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{lang === 'zh' ? '外觀風格主題' : 'Widget Visual Style'}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 text-xs">
                    {[
                      { id: 'glass', label: '毛玻璃' },
                      { id: 'dark', label: '極致黑' },
                      { id: 'sky', label: '天空藍' },
                      { id: 'minimal', label: '極簡透' },
                    ].map((th) => (
                      <button
                        key={th.id}
                        id={`btn-widget-theme-${th.id}`}
                        onClick={() => setWidgetTheme(th.id as WidgetTheme)}
                        className={`py-1.5 rounded-lg text-center font-medium border transition-all cursor-pointer ${
                          widgetTheme === th.id
                            ? 'bg-sky-500 text-white border-sky-400 font-bold'
                            : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {th.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10 space-y-2">
                  <div className="text-xs font-medium text-white/70">
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
                    <span>{primaryTimeFormatted.timeString}</span>
                    {isPrimaryDst && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        DST
                      </span>
                    )}
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
                      className={`w-full rounded-3xl p-4 sm:p-5 transition-all duration-300 relative overflow-hidden ${getWidgetBgClass()}`}
                    >
                      {/* Widget Top-Right Manual Refresh Action */}
                      <button
                        id="btn-widget-manual-refresh-4x2"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRefreshWeather();
                        }}
                        title={lang === 'zh' ? '手動更新天氣與時間' : 'Manual Refresh'}
                        className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white/80 hover:text-white transition-all cursor-pointer z-10"
                      >
                        <RefreshCw className="w-3.5 h-3.5 active:rotate-180 transition-transform" />
                      </button>

                      <div className="flex items-start justify-between pr-8">
                        <div>
                          {showTime && (
                            <div className="text-[11px] text-white/80 font-medium tracking-wide flex flex-wrap items-center gap-1.5 mb-0.5">
                              {/* YYYY/MM/DD + Weekday + Week Number */}
                              <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-sky-200">
                                {primaryTimeFormatted.dateYMD} ({primaryTimeFormatted.weekdayString})
                              </span>
                              <span className="text-[10px] text-amber-300 font-semibold bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">
                                {primaryTimeFormatted.weekNumberString}
                              </span>
                              <span className="font-mono font-bold text-white text-xs ml-0.5">
                                {primaryTimeFormatted.timeString}
                              </span>
                              {isPrimaryDst && (
                                <span className="text-[9px] px-1 rounded bg-amber-400/25 text-amber-200 border border-amber-300/30">
                                  DST
                                </span>
                              )}
                            </div>
                          )}
                          <h3 className="text-lg sm:text-xl font-bold tracking-tight mt-1 flex items-center gap-1.5">
                            <span>{activeCity.name}</span>
                            {activeCity.isGps && (
                              <span className="text-[9px] bg-sky-500/30 text-sky-300 border border-sky-400/40 px-1.5 py-0.2 rounded-full font-normal">
                                GPS
                              </span>
                            )}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-white/75 font-medium">
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
                      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
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
                      className={`w-full rounded-2xl px-4 py-3 flex items-center justify-between transition-all duration-300 relative ${getWidgetBgClass()}`}
                    >
                      <div className="flex items-center gap-3 pr-2">
                        <WeatherIcon
                          code={current.weatherCode}
                          isDay={current.isDay}
                          className="w-9 h-9 text-amber-300 flex-shrink-0"
                        />
                        <div>
                          <div className="text-sm font-bold flex items-center gap-1.5">
                            <span>{activeCity.name}</span>
                            <span className="text-xs font-normal text-white/60">• {current.weatherLabel}</span>
                          </div>
                          <div className="text-[11px] text-white/70 flex flex-wrap items-center gap-1.5 mt-0.5">
                            {showTime && (
                              <>
                                <span className="font-mono">{primaryTimeFormatted.dateYMD} {primaryTimeFormatted.weekdayString}</span>
                                <span className="text-amber-300 font-semibold">({primaryTimeFormatted.weekNumberString})</span>
                                <span className="font-mono font-bold text-sky-200">{primaryTimeFormatted.timeString}</span>
                                <span>•</span>
                              </>
                            )}
                            <span>{highTemp}° / {lowTemp}°</span>
                            {showPrecipitation && <span>• 降雨 {current.precipitation}%</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="text-right">
                          <div className="text-2xl font-black">{temp}{tempUnit}</div>
                          {showAqi && weatherData.airQuality && (
                            <div className="text-[9px] text-emerald-300 font-semibold">
                              AQI {weatherData.airQuality.usAqi}
                            </div>
                          )}
                        </div>
                        {/* Top-Right Manual Refresh Icon */}
                        <button
                          id="btn-widget-manual-refresh-4x1"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRefreshWeather();
                          }}
                          title={lang === 'zh' ? '手動更新' : 'Refresh'}
                          className="p-1 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white/80 hover:text-white transition-all cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 3. Size 2x2 Square Widget */}
                  {selectedSize === '2x2' && (
                    <div
                      id="widget-preview-2x2"
                      className={`w-52 h-52 rounded-3xl p-4 flex flex-col justify-between transition-all duration-300 relative ${getWidgetBgClass()}`}
                    >
                      {/* Top Right Refresh Icon */}
                      <button
                        id="btn-widget-manual-refresh-2x2"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRefreshWeather();
                        }}
                        title={lang === 'zh' ? '手動更新' : 'Refresh'}
                        className="absolute top-3 right-3 p-1 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white/80 hover:text-white transition-all cursor-pointer z-10"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>

                      <div className="flex items-start justify-between pr-6">
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
                        {showTime && (
                          <div className="text-[10px] text-white/80 mt-0.5 space-y-0.5">
                            <div className="font-mono text-sky-200">
                              {primaryTimeFormatted.dateYMD} {primaryTimeFormatted.weekdayString}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-amber-300 font-medium">{primaryTimeFormatted.weekNumberString}</span>
                              <span className="font-bold">{primaryTimeFormatted.timeString}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-white/60 pt-1.5 border-t border-white/10">
                        <span>體感 {Math.round(current.apparentTemperature)}°</span>
                        {showPrecipitation && <span>雨 {current.precipitation}%</span>}
                      </div>
                    </div>
                  )}

                  {/* 4. Dual-Clock Multi-Timezone Widget */}
                  {selectedSize === 'dual_clock' && (
                    <div
                      id="widget-preview-dual-clock"
                      className={`w-full rounded-3xl p-4 sm:p-5 transition-all duration-300 relative ${getWidgetBgClass()}`}
                    >
                      {/* Top Right Refresh Icon */}
                      <button
                        id="btn-widget-manual-refresh-dual"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRefreshWeather();
                        }}
                        title={lang === 'zh' ? '手動更新' : 'Refresh'}
                        className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white/80 hover:text-white transition-all cursor-pointer z-10"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>

                      <div className="text-xs font-semibold text-white/80 mb-2 flex items-center gap-1.5 pr-8">
                        <Globe className="w-4 h-4 text-sky-400" />
                        <span>{lang === 'zh' ? '雙時區時鐘 & 當地天氣' : 'Dual-Clock & World Weather'}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        {/* Clock 1: Primary City */}
                        <div className="bg-white/10 p-3 rounded-2xl border border-white/10 flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-sky-300 truncate">{activeCity.name}</span>
                            {isPrimaryDst && (
                              <span className="text-[8px] px-1 rounded bg-amber-400/25 text-amber-200">DST</span>
                            )}
                          </div>
                          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white my-1">
                            {primaryTimeFormatted.timeString}
                          </div>
                          <div className="text-[10px] text-white/70 space-y-0.5">
                            <div className="font-mono text-sky-200">
                              {primaryTimeFormatted.dateYMD} ({primaryTimeFormatted.weekdayString})
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-amber-300 font-medium">{primaryTimeFormatted.weekNumberString}</span>
                              <span className="font-bold text-white/90">{temp}{tempUnit}</span>
                            </div>
                          </div>
                        </div>

                        {/* Clock 2: Secondary City */}
                        <div className="bg-white/10 p-3 rounded-2xl border border-white/10 flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-300 truncate">
                              {secondaryCity?.name || (lang === 'zh' ? '第 2 地 (未設定)' : 'Secondary')}
                            </span>
                            {isSecondaryDst && (
                              <span className="text-[8px] px-1 rounded bg-amber-400/25 text-amber-200">DST</span>
                            )}
                          </div>
                          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white my-1">
                            {secondaryTimeFormatted ? secondaryTimeFormatted.timeString : '--:--'}
                          </div>
                          <div className="text-[10px] text-white/70 space-y-0.5">
                            <div className="font-mono text-amber-200">
                              {secondaryTimeFormatted ? `${secondaryTimeFormatted.dateYMD} (${secondaryTimeFormatted.weekdayString})` : '請在設定選取'}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-amber-300 font-medium">
                                {secondaryTimeFormatted ? secondaryTimeFormatted.weekNumberString : ''}
                              </span>
                              <span className="text-white/50">{secondaryCity?.timezone ? '時區同步' : ''}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. Lock Screen Widget */}
                  {selectedSize === 'lockscreen' && (
                    <div
                      id="widget-preview-lockscreen"
                      className="w-full max-w-md rounded-full bg-black/60 backdrop-blur-xl border border-white/20 px-4 py-2 flex items-center justify-between text-white shadow-xl relative"
                    >
                      <div className="flex items-center gap-2">
                        <WeatherIcon
                          code={current.weatherCode}
                          isDay={current.isDay}
                          className="w-5 h-5 text-amber-300 flex-shrink-0"
                        />
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-semibold">{activeCity.name}</span>
                          <span className="text-[10px] text-white/60 font-mono">
                            {primaryTimeFormatted.dateYMD} {primaryTimeFormatted.weekdayString} • {primaryTimeFormatted.weekNumberString}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-bold">{temp}{tempUnit}</span>
                        <span className="text-[11px] text-sky-200 font-mono font-bold">
                          {primaryTimeFormatted.timeString}
                        </span>
                        <button
                          id="btn-widget-manual-refresh-lock"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRefreshWeather();
                          }}
                          title={lang === 'zh' ? '手動更新' : 'Refresh'}
                          className="p-1 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white/80 hover:text-white transition-all cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
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
                  <div className="text-xs font-semibold text-white">
                    Android Jetpack Glance 1.1+ (Kotlin / Compose)
                  </div>
                  <div className="text-[11px] text-white/50">
                    PrecisionWeatherWidget.kt • 支援 12/24H 與自動 DST
                  </div>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-all shadow cursor-pointer"
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? '已複製！' : '複製程式碼'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-black/80 border border-white/15 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-[360px] leading-relaxed">
                <code>{kotlinGlanceCode}</code>
              </pre>
            </div>
          ) : (
            /* Pin to Home Guide */
            <div className="space-y-3">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3 text-xs leading-relaxed text-white/80">
                <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-sky-400" />
                  <span>如何在 Android 手機桌面新增天氣小工具？</span>
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-white/70">
                  <li>在手機主螢幕任何空白區域「長按」1 秒。</li>
                  <li>在底部彈出的選單中點選「微件 (Widgets)」或「小工具」。</li>
                  <li>在列表中找到「精準天氣」或本氣象應用程式。</li>
                  <li>按住喜愛的小工具尺寸（4x2、4x1、2x2、雙時區時鐘），拖曳至桌面即可。</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
