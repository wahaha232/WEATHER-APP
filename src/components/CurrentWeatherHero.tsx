import React from 'react';
import {
  MapPin,
  Wind,
  Droplets,
  Sun,
  CloudRain,
} from 'lucide-react';
import { FullWeatherResponse, WeatherSettings } from '../types';
import {
  formatTemp,
  formatWindSpeed,
  getWeatherCondition,
} from '../services/weatherService';
import { TRANSLATIONS } from '../services/i18n';
import { WeatherIllustration3D } from './WeatherIllustration3D';

interface CurrentWeatherHeroProps {
  data: FullWeatherResponse;
  settings: WeatherSettings;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onOpenSearch?: () => void;
  onOpenCityDrawer: () => void;
  onToggleLanguage?: () => void;
  totalSavedCities: number;
  currentCityIndex: number;
}

export const CurrentWeatherHero: React.FC<CurrentWeatherHeroProps> = ({
  data,
  settings,
  onOpenCityDrawer,
  totalSavedCities,
  currentCityIndex,
}) => {
  const { current, daily, city, lastUpdated } = data;
  const lang = settings.language || 'zh';
  const t = TRANSLATIONS[lang];
  const condition = getWeatherCondition(current.weatherCode, lang);

  const todayMax = daily.temperatureMax[0] ?? current.temperature;
  const todayMin = daily.temperatureMin[0] ?? current.temperature;
  const todayRainProb = daily.precipitationProbabilityMax[0] ?? 0;
  const todayUv = daily.uvIndexMax[0] ?? 0;
  const windInfo = formatWindSpeed(current.windSpeed, settings.windSpeedUnit);

  // Formatted date (e.g. "Sunday, 12 July" or "8月14日 星期五")
  const formattedDate = React.useMemo(() => {
    const now = new Date();
    const weekdaysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsEn = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (lang === 'zh') {
      const weekdaysZh = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      return `${now.getMonth() + 1}月${now.getDate()}日 ${weekdaysZh[now.getDay()]}`;
    } else {
      return `${weekdaysEn[now.getDay()]}, ${now.getDate()} ${monthsEn[now.getMonth()]}`;
    }
  }, [lang]);

  const currentTempNum = Math.round(
    settings.tempUnit === 'fahrenheit'
      ? (current.temperature * 9) / 5 + 32
      : current.temperature
  );

  return (
    <div id="current-weather-hero" className="flex flex-col items-center pt-1 pb-4 px-2 sm:px-4 text-center w-full">
      {/* Top City Header / Action Bar */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        {/* City Switcher Trigger Button */}
        <button
          id="btn-open-city-selector"
          onClick={onOpenCityDrawer}
          className="flex items-center gap-2 bg-[#0B2C52]/70 hover:bg-[#0E3868]/90 active:scale-95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 transition-all text-sm font-medium shadow-md cursor-pointer text-white"
          title={t.switchCity}
        >
          <MapPin className="w-4 h-4 text-amber-300 flex-shrink-0" />
          <span className="max-w-[160px] sm:max-w-[220px] truncate font-semibold">
            {city.name}
          </span>
          {city.district && city.name !== city.district && (
            <span className="hidden sm:inline-block text-[10px] text-amber-200 bg-amber-400/20 px-1.5 py-0.5 rounded-full border border-amber-300/30">
              {city.district}
            </span>
          )}
          {city.country && (
            <span className="text-xs text-white/70 bg-white/10 px-1.5 py-0.5 rounded">
              {city.country_code || city.country}
            </span>
          )}
        </button>
      </div>

      {/* City Dots Indicator */}
      {totalSavedCities > 1 && (
        <div className="flex items-center gap-1.5 mb-2.5">
          {Array.from({ length: totalSavedCities }).map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentCityIndex
                  ? 'w-5 bg-sky-300 shadow-sm'
                  : 'w-1.5 bg-[#0B2C52]/40'
              }`}
            />
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ⭐ HERO WEATHER CAPSULE CARD (Exact Archetype from User Reference Image) ⭐ */}
      {/* ========================================================================= */}
      <div
        id="hero-weather-main-card"
        className="w-full relative overflow-hidden rounded-[30px] sm:rounded-[34px] bg-gradient-to-r from-[#0C386D] via-[#092B54] to-[#061C38] border border-white/20 shadow-[0_16px_36px_rgba(5,23,54,0.35)] p-4 sm:p-5 text-white my-1"
      >
        {/* Subtle Background Glow Circle */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-[#1A4B84]/40 blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 -top-12 w-36 h-36 rounded-full bg-[#184578]/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          {/* Left: Weather Condition Label & Giant 22° Temperature */}
          <div className="flex flex-col items-start justify-center flex-shrink-0 text-left pl-1 sm:pl-2">
            <span
              id="hero-condition-label"
              className="text-base sm:text-lg font-medium text-white/95 tracking-normal mb-0.5"
            >
              {condition.label}
            </span>
            <div className="flex items-start tracking-tight">
              <span
                id="hero-current-temp"
                className="text-5xl sm:text-6xl font-normal text-white font-sans"
              >
                {currentTempNum}
              </span>
              <span className="text-3xl sm:text-4xl font-light text-white ml-0.5 -mt-0.5">
                °
              </span>
            </div>
          </div>

          {/* Middle: Subtle Vertical Divider Line */}
          <div className="w-[1.5px] h-12 sm:h-14 bg-white/25 mx-2.5 sm:mx-4 flex-shrink-0 rounded-full" />

          {/* Middle-Right: Date & City Name with Pin */}
          <div className="flex flex-col items-start justify-center text-left flex-1 min-w-0 pr-1">
            <span className="text-xs sm:text-sm font-medium text-white/90 truncate max-w-full">
              {formattedDate}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-white truncate max-w-full">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white flex-shrink-0" />
              <span className="text-sm sm:text-base font-semibold truncate">
                {city.name}
              </span>
            </div>
          </div>

          {/* Right: 3D Weather Illustration (Clouds, Lightning, Sun) */}
          <div className="flex-shrink-0 -mr-2 sm:-mr-1 -my-3 sm:-my-4">
            <WeatherIllustration3D
              code={current.weatherCode}
              isDay={current.isDay}
              className="w-24 h-24 sm:w-32 sm:h-32"
              size={120}
            />
          </div>
        </div>
      </div>

      {/* High / Low & Feels Like Bar */}
      <div className="flex items-center justify-center gap-3 mt-3 text-xs sm:text-sm text-slate-800 font-medium">
        <div className="flex items-center gap-1.5 bg-[#0C386D]/15 px-3 py-1 rounded-full backdrop-blur-sm border border-[#0C386D]/20 text-[#092B54]">
          <span className="font-semibold">{t.high} {formatTemp(todayMax, settings.tempUnit)}</span>
          <span className="text-[#092B54]/40">|</span>
          <span className="font-semibold">{t.low} {formatTemp(todayMin, settings.tempUnit)}</span>
        </div>
        <div className="bg-[#0C386D]/15 px-3 py-1 rounded-full backdrop-blur-sm border border-[#0C386D]/20 text-[#092B54]">
          {t.feelsLike} <span className="font-semibold">{formatTemp(current.apparentTemperature, settings.tempUnit)}</span>
        </div>
      </div>

      {/* Real-time Quick Glance 4-Item Pill Bar */}
      <div className="w-full grid grid-cols-4 gap-2 mt-3.5">
        {/* Rain Chance */}
        <div className="flex flex-col items-center justify-center p-2.5 bg-[#0C386D]/10 hover:bg-[#0C386D]/15 backdrop-blur-md rounded-2xl border border-[#0C386D]/15 transition-all text-[#092B54] shadow-sm">
          <div className="flex items-center gap-1 text-[#1D4ED8] text-xs mb-0.5">
            <CloudRain className="w-3.5 h-3.5" />
            <span className="truncate">{t.rainProbability}</span>
          </div>
          <span className="font-bold text-[#092B54] text-sm sm:text-base">
            {todayRainProb}%
          </span>
        </div>

        {/* Wind */}
        <div className="flex flex-col items-center justify-center p-2.5 bg-[#0C386D]/10 hover:bg-[#0C386D]/15 backdrop-blur-md rounded-2xl border border-[#0C386D]/15 transition-all text-[#092B54] shadow-sm">
          <div className="flex items-center gap-1 text-[#0D9488] text-xs mb-0.5">
            <Wind className="w-3.5 h-3.5" />
            <span className="truncate">{t.windSpeed}</span>
          </div>
          <span className="font-bold text-[#092B54] text-sm sm:text-base truncate">
            {windInfo.value} {windInfo.label}
          </span>
        </div>

        {/* Humidity */}
        <div className="flex flex-col items-center justify-center p-2.5 bg-[#0C386D]/10 hover:bg-[#0C386D]/15 backdrop-blur-md rounded-2xl border border-[#0C386D]/15 transition-all text-[#092B54] shadow-sm">
          <div className="flex items-center gap-1 text-[#2563EB] text-xs mb-0.5">
            <Droplets className="w-3.5 h-3.5" />
            <span className="truncate">{t.humidity}</span>
          </div>
          <span className="font-bold text-[#092B54] text-sm sm:text-base">
            {current.relativeHumidity}%
          </span>
        </div>

        {/* UV Index */}
        <div className="flex flex-col items-center justify-center p-2.5 bg-[#0C386D]/10 hover:bg-[#0C386D]/15 backdrop-blur-md rounded-2xl border border-[#0C386D]/15 transition-all text-[#092B54] shadow-sm">
          <div className="flex items-center gap-1 text-[#D97706] text-xs mb-0.5">
            <Sun className="w-3.5 h-3.5" />
            <span className="truncate">{t.uvIndex}</span>
          </div>
          <span className="font-bold text-[#092B54] text-sm sm:text-base">
            {todayUv.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Last update timestamp */}
      <div className="mt-2.5 text-[11px] text-[#092B54]/70 flex items-center justify-center font-medium">
        <span>{t.updatedAt}{lastUpdated}</span>
      </div>
    </div>
  );
};
