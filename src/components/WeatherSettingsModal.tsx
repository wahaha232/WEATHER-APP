import React, { useState, useEffect } from 'react';
import {
  Settings,
  X,
  Thermometer,
  Wind,
  Languages,
  Smartphone,
  Info,
  Check,
  Clock,
  LayoutGrid,
  Globe,
  SunMedium,
  Timer,
  MapPin,
  Star,
  Palette,
  Moon,
  Sun,
} from 'lucide-react';
import { SavedCity, WeatherSettings } from '../types';
import { TRANSLATIONS } from '../services/i18n';
import { formatLocalTime, resolveTimezone, isDaylightSavingTime } from '../services/timeService';

interface WeatherSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WeatherSettings;
  onUpdateSettings: (newSettings: Partial<WeatherSettings>) => void;
  onOpenWidgets?: () => void;
  onOpenRating?: () => void;
  savedCities?: SavedCity[];
  currentCity?: SavedCity;
}

export const WeatherSettingsModal: React.FC<WeatherSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenWidgets,
  onOpenRating,
  savedCities = [],
  currentCity,
}) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const t = TRANSLATIONS[settings.language || 'zh'];
  const REFRESH_INTERVALS = [5, 10, 15, 20, 25, 30];

  const primaryTz = resolveTimezone(currentCity?.timezone, currentCity?.latitude, currentCity?.longitude);
  const isPrimaryDst = isDaylightSavingTime(now, primaryTz);

  const secondaryCity = savedCities.find((c) => String(c.id) === String(settings.secondaryCityId));
  const secondaryTz = secondaryCity ? resolveTimezone(secondaryCity.timezone, secondaryCity.latitude, secondaryCity.longitude) : undefined;
  const isSecondaryDst = secondaryTz ? isDaylightSavingTime(now, secondaryTz) : false;

  const primaryTimeSample = formatLocalTime(
    now,
    primaryTz,
    settings.timeFormat === '12h',
    settings.language || 'zh'
  );

  return (
    <div
      id="weather-settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="weather-settings-modal-container"
        className="w-full max-w-md bg-zinc-900/95 border border-white/20 rounded-3xl p-5 shadow-2xl text-white flex flex-col max-h-[88vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-semibold">{t.settingsTitle}</h2>
          </div>
          <button
            id="btn-close-settings-modal"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="flex-1 overflow-y-auto space-y-4 my-4 no-scrollbar pr-1">
          {/* ========================================================================= */}
          {/* 1. Time Format: 12-Hour vs 24-Hour Switcher */}
          {/* ========================================================================= */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Timer className="w-4 h-4 text-amber-400" />
                <span>{t.timeFormatLabel}</span>
              </div>
              <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                {primaryTimeSample.timeString}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2.5">
              <button
                id="btn-time-format-12h"
                onClick={() => onUpdateSettings({ timeFormat: '12h' })}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  settings.timeFormat === '12h'
                    ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md font-bold'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {settings.timeFormat === '12h' && <Check className="w-3.5 h-3.5 text-zinc-950" />}
                <span>{t.timeFormat12h}</span>
              </button>
              <button
                id="btn-time-format-24h"
                onClick={() => onUpdateSettings({ timeFormat: '24h' })}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  settings.timeFormat !== '12h'
                    ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md font-bold'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {settings.timeFormat !== '12h' && <Check className="w-3.5 h-3.5 text-zinc-950" />}
                <span>{t.timeFormat24h}</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. Automatic Daylight Saving Time (DST) Detection Card */}
          {/* ========================================================================= */}
          <div className="bg-gradient-to-r from-amber-950/40 to-orange-950/30 p-4 rounded-2xl border border-amber-500/25">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 mt-0.5">
                  <SunMedium className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    <span>{t.dstAutoDetect}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                      AUTO
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60 mt-1 leading-relaxed">
                    {currentCity?.name || '當地'}：{primaryTimeSample.timezoneName} ({primaryTimeSample.utcOffsetString})
                  </p>
                  {isPrimaryDst ? (
                    <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                      <Check className="w-3 h-3 text-amber-400" />
                      <span>{t.dstActiveBadge}</span>
                    </div>
                  ) : (
                    <div className="mt-1 text-[11px] text-white/40">
                      標準時間（目前未實施日光節約時制）
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. Secondary Location Time (Dual Clock) */}
          {/* ========================================================================= */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-sm font-medium text-white mb-1.5">
              <Globe className="w-4 h-4 text-sky-400" />
              <span>{t.secondaryClockTitle}</span>
            </div>
            <p className="text-[11px] text-white/50 mb-3 leading-relaxed">
              {t.secondaryClockDesc}
            </p>

            <div className="space-y-2">
              {/* Option: None */}
              <button
                id="btn-secondary-city-none"
                onClick={() => onUpdateSettings({ secondaryCityId: undefined })}
                className={`w-full p-2.5 rounded-xl text-xs font-medium border flex items-center justify-between transition-all cursor-pointer ${
                  !settings.secondaryCityId
                    ? 'bg-sky-500/20 text-sky-300 border-sky-400/50 shadow-sm'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{t.secondaryClockNone}</span>
                {!settings.secondaryCityId && <Check className="w-4 h-4 text-sky-400" />}
              </button>

              {/* Saved cities to pick as 2nd location */}
              {savedCities
                .filter((c) => String(c.id) !== String(currentCity?.id))
                .map((city) => {
                  const isSelected = String(settings.secondaryCityId) === String(city.id);
                  const cityTz = resolveTimezone(city.timezone, city.latitude, city.longitude);
                  const cityTime = formatLocalTime(
                    now,
                    cityTz,
                    settings.timeFormat === '12h',
                    settings.language || 'zh'
                  );
                  const isDst = isDaylightSavingTime(now, cityTz);

                  return (
                    <button
                      key={city.id}
                      id={`btn-secondary-city-${city.id}`}
                      onClick={() => onUpdateSettings({ secondaryCityId: city.id })}
                      className={`w-full p-2.5 rounded-xl text-xs font-medium border flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-500 text-white border-sky-400 shadow-md font-semibold'
                          : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-sky-400'}`} />
                        <span>{city.name}</span>
                        {isDst && (
                          <span className={`text-[9px] px-1.5 py-0.2 rounded ${isSelected ? 'bg-black/20 text-white' : 'bg-amber-500/20 text-amber-300'}`}>
                            DST
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-xs ${isSelected ? 'text-white font-bold' : 'text-white/70'}`}>
                          {cityTime.timeString}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Auto Refresh Interval Options */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{t.autoRefreshLabel}</span>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                {settings.autoRefreshIntervalMinutes || 15} {t.minuteUnit}
              </span>
            </div>
            <p className="text-[11px] text-white/50 mb-3">
              {t.autoRefreshDesc}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {REFRESH_INTERVALS.map((mins) => {
                const isSelected = (settings.autoRefreshIntervalMinutes || 15) === mins;
                return (
                  <button
                    key={mins}
                    id={`btn-refresh-interval-${mins}`}
                    onClick={() =>
                      onUpdateSettings({ autoRefreshIntervalMinutes: mins })
                    }
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-md font-bold'
                        : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-zinc-950" />}
                    <span>{mins} {t.minuteUnit}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Home Screen Widgets Entry */}
          {onOpenWidgets && (
            <div className="bg-gradient-to-r from-sky-950/60 to-indigo-950/60 p-4 rounded-2xl border border-sky-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {t.widgetCenterTitle}
                  </div>
                  <div className="text-[11px] text-white/60">
                    4x2, 4x1, 2x2 & Dual-Clock
                  </div>
                </div>
              </div>
              <button
                id="btn-open-widget-from-settings"
                onClick={() => {
                  onClose();
                  onOpenWidgets();
                }}
                className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-white text-xs font-bold transition-all shadow cursor-pointer"
              >
                {settings.language === 'zh' ? '自訂小工具' : 'Customize'}
              </button>
            </div>
          )}

          {/* Theme Switcher: 黑 (Dark) / 白 (Light) / 裝置 (System/Device) */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Palette className="w-4 h-4 text-purple-400" />
                <span>{t.themeLabel}</span>
              </div>
              <span className="text-xs font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                {settings.theme === 'light'
                  ? (settings.language === 'zh' ? '白' : 'Light')
                  : settings.theme === 'dark'
                  ? (settings.language === 'zh' ? '黑' : 'Dark')
                  : (settings.language === 'zh' ? '裝置' : 'Device')}
              </span>
            </div>
            <p className="text-[11px] text-white/50 mb-3">
              {t.themeDesc}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {/* Dark: 黑 */}
              <button
                id="btn-theme-dark"
                onClick={() => onUpdateSettings({ theme: 'dark' })}
                className={`py-2.5 px-2 rounded-xl text-xs font-semibold border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  (settings.theme || 'dark') === 'dark'
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md font-bold'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Moon className="w-3.5 h-3.5" />
                  <span>{settings.language === 'zh' ? '黑' : 'Dark'}</span>
                </div>
                {(settings.theme || 'dark') === 'dark' && <Check className="w-3 h-3 text-white" />}
              </button>

              {/* Light: 白 */}
              <button
                id="btn-theme-light"
                onClick={() => onUpdateSettings({ theme: 'light' })}
                className={`py-2.5 px-2 rounded-xl text-xs font-semibold border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  settings.theme === 'light'
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md font-bold'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5" />
                  <span>{settings.language === 'zh' ? '白' : 'Light'}</span>
                </div>
                {settings.theme === 'light' && <Check className="w-3 h-3 text-white" />}
              </button>

              {/* System: 裝置 */}
              <button
                id="btn-theme-system"
                onClick={() => onUpdateSettings({ theme: 'system' })}
                className={`py-2.5 px-2 rounded-xl text-xs font-semibold border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  settings.theme === 'system'
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md font-bold'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{settings.language === 'zh' ? '裝置' : 'Device'}</span>
                </div>
                {settings.theme === 'system' && <Check className="w-3 h-3 text-white" />}
              </button>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-sm font-medium mb-3 text-white">
              <Languages className="w-4 h-4 text-sky-300" />
              <span>{t.languageLabel}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-set-lang-zh"
                onClick={() => onUpdateSettings({ language: 'zh' })}
                className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  settings.language === 'zh'
                    ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                }`}
              >
                {settings.language === 'zh' && <Check className="w-3.5 h-3.5" />}
                <span>{t.langZh}</span>
              </button>
              <button
                id="btn-set-lang-en"
                onClick={() => onUpdateSettings({ language: 'en' })}
                className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  settings.language === 'en'
                    ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                }`}
              >
                {settings.language === 'en' && <Check className="w-3.5 h-3.5" />}
                <span>{t.langEn}</span>
              </button>
            </div>
          </div>

          {/* Temperature Unit */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-sm font-medium mb-3 text-white">
              <Thermometer className="w-4 h-4 text-amber-300" />
              <span>{t.tempUnitLabel}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-unit-celsius"
                onClick={() => onUpdateSettings({ tempUnit: 'celsius' })}
                className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  settings.tempUnit === 'celsius'
                    ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                }`}
              >
                {settings.tempUnit === 'celsius' && <Check className="w-3.5 h-3.5" />}
                <span>{t.celsius}</span>
              </button>
              <button
                id="btn-unit-fahrenheit"
                onClick={() => onUpdateSettings({ tempUnit: 'fahrenheit' })}
                className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  settings.tempUnit === 'fahrenheit'
                    ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                }`}
              >
                {settings.tempUnit === 'fahrenheit' && <Check className="w-3.5 h-3.5" />}
                <span>{t.fahrenheit}</span>
              </button>
            </div>
          </div>

          {/* Wind Speed Unit */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-sm font-medium mb-3 text-white">
              <Wind className="w-4 h-4 text-teal-300" />
              <span>{t.windUnitLabel}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'kmh', label: 'km/h' },
                { id: 'ms', label: 'm/s' },
                { id: 'mph', label: 'mph' },
              ].map((unit) => (
                <button
                  key={unit.id}
                  id={`btn-wind-unit-${unit.id}`}
                  onClick={() =>
                    onUpdateSettings({
                      windSpeedUnit: unit.id as 'kmh' | 'ms' | 'mph',
                    })
                  }
                  className={`py-2 px-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    settings.windSpeedUnit === unit.id
                      ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                      : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {settings.windSpeedUnit === unit.id && (
                    <Check className="w-3 h-3" />
                  )}
                  <span>{unit.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Phone Frame Mode Toggle */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-emerald-300" />
              <div>
                <div className="text-sm font-medium text-white">
                  {t.phoneFrameModeLabel}
                </div>
                <div className="text-[11px] text-white/50 mt-0.5">
                  {t.phoneFrameModeDesc}
                </div>
              </div>
            </div>
            <button
              id="btn-toggle-phone-frame"
              onClick={() =>
                onUpdateSettings({ phoneFrameMode: !settings.phoneFrameMode })
              }
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.phoneFrameMode ? 'bg-emerald-500' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  settings.phoneFrameMode ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Rate App & User Feedback Entry */}
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 p-4 rounded-2xl border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  {settings.language === 'zh' ? '為 APP 評分與建議' : 'Rate App & Feedback'}
                </div>
                <div className="text-[11px] text-white/60 mt-0.5">
                  {settings.language === 'zh' ? '滿意我們的精準天氣嗎？給予我們 5 星好評！' : 'Loving the app? Give us 5 stars!'}
                </div>
              </div>
            </div>
            {onOpenRating && (
              <button
                id="btn-settings-open-rating"
                onClick={() => {
                  onClose();
                  onOpenRating();
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {settings.language === 'zh' ? '立即評分' : 'Rate Now'}
              </button>
            )}
          </div>

          {/* About & API info */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-xs text-white/70 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/icon.svg"
                alt="天氣即時通 App Icon"
                className="w-12 h-12 rounded-2xl shadow-lg border border-white/15 object-cover flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm">天氣即時通</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono border border-sky-400/30">
                    v1.0.0
                  </span>
                </div>
                <div className="text-[11px] text-white/50 truncate mt-0.5">
                  Android Material You & PWA Weather
                </div>
              </div>
            </div>
            <p className="leading-relaxed text-white/60 pt-1 border-t border-white/10">
              {t.techInfoDesc}
            </p>
          </div>
        </div>

        <button
          id="btn-finish-settings"
          onClick={onClose}
          className="w-full py-3 bg-sky-500 hover:bg-sky-600 active:scale-98 rounded-2xl font-medium text-sm text-white transition-all shadow-md mt-2 cursor-pointer"
        >
          {t.finishSettings}
        </button>
      </div>
    </div>
  );
};
