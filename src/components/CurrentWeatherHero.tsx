import React from 'react';
import { ChevronRight, Shirt, RefreshCw } from 'lucide-react';
import { FullWeatherResponse, SavedCity, WeatherSettings } from '../types';
import { formatTemp, getWeatherCondition } from '../services/weatherService';
import { TRANSLATIONS } from '../services/i18n';

interface CurrentWeatherHeroProps {
  data: FullWeatherResponse;
  settings: WeatherSettings;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onOpenCityDrawer: () => void;
  onOpenRadar?: () => void;
  totalSavedCities: number;
  currentCityIndex: number;
  savedCities?: SavedCity[];
}

export const CurrentWeatherHero: React.FC<CurrentWeatherHeroProps> = ({
  data,
  settings,
  isRefreshing = false,
  onRefresh,
  onOpenRadar,
}) => {
  const { current, daily } = data;
  const lang = settings.language || 'zh';
  const t = TRANSLATIONS[lang];
  const condition = getWeatherCondition(current.weatherCode, lang);

  const todayMax = daily.temperatureMax[0] ?? current.temperature;
  const todayMin = daily.temperatureMin[0] ?? current.temperature;
  const feelsLike = current.apparentTemperature ?? current.temperature;

  const currentTempNum = Math.round(
    settings.tempUnit === 'fahrenheit'
      ? (current.temperature * 9) / 5 + 32
      : current.temperature
  );

  const maxTempNum = Math.round(
    settings.tempUnit === 'fahrenheit'
      ? (todayMax * 9) / 5 + 32
      : todayMax
  );

  const minTempNum = Math.round(
    settings.tempUnit === 'fahrenheit'
      ? (todayMin * 9) / 5 + 32
      : todayMin
  );

  const feelsLikeNum = Math.round(
    settings.tempUnit === 'fahrenheit'
      ? (feelsLike * 9) / 5 + 32
      : feelsLike
  );

  // Precipitation text
  const isRaining = current.precipitation > 0 || current.rain > 0 || current.showers > 0;
  const precipText = isRaining
    ? (lang === 'zh' ? '目前降雨中，外出請攜帶雨具 >' : 'Rain currently falling >')
    : (lang === 'zh' ? '在 120 分鐘內無降水 >' : 'No precipitation in next 120 min >');

  return (
    <div
      id="current-weather-hero"
      className="w-full pt-4 pb-6 px-4 text-white flex flex-col items-start select-none relative"
    >
      {/* Weather condition text, e.g. "阴" / "多雲" / "晴" */}
      <div className="flex items-center justify-between w-full">
        <span
          id="hero-condition-text"
          className="text-lg sm:text-xl font-normal text-white/95 tracking-wide drop-shadow-sm"
        >
          {condition.label}
        </span>

        {/* Manual Refresh Button */}
        {onRefresh && (
          <button
            id="btn-hero-refresh"
            onClick={onRefresh}
            title={lang === 'zh' ? '手動更新天氣' : 'Refresh Weather'}
            className="p-1 bg-transparent hover:bg-white/10 active:scale-90 flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer rounded-full"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-sky-300' : ''}`} />
          </button>
        )}
      </div>

      {/* Giant Temperature: 28° C */}
      <div className="flex items-start my-1 tracking-tight">
        <span
          id="hero-main-temp"
          className="text-7xl sm:text-8xl font-light tracking-tighter font-sans text-white drop-shadow-md"
        >
          {currentTempNum}°
        </span>
        <span className="text-2xl sm:text-3xl font-light text-white/90 mt-2 sm:mt-3 ml-1 font-sans">
          {settings.tempUnit === 'fahrenheit' ? 'F' : 'C'}
        </span>
      </div>

      {/* High / Low / Clothes Feels-like line: ↑ 35°  ↓ 26°  👕 36° */}
      <div
        id="hero-temp-range"
        className="flex items-center gap-3 text-sm sm:text-base font-normal text-white/90 drop-shadow-sm mt-0.5"
      >
        <span className="flex items-center gap-0.5">
          <span className="text-amber-300 font-semibold">↑</span>
          <span>{maxTempNum}°</span>
        </span>
        <span className="flex items-center gap-0.5">
          <span className="text-cyan-300 font-semibold">↓</span>
          <span>{minTempNum}°</span>
        </span>
        <span className="flex items-center gap-1 text-white/95">
          <span className="text-base">👕</span>
          <span>{feelsLikeNum}°</span>
        </span>
      </div>

      {/* Precipitation banner: 在 120 分钟内无降水 > */}
      <button
        id="hero-precip-banner"
        onClick={onOpenRadar}
        className="mt-3.5 px-3.5 py-1.5 rounded-full bg-black/15 hover:bg-black/25 active:scale-98 backdrop-blur-md border border-white/15 text-xs sm:text-sm text-white/90 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
      >
        <span>{precipText}</span>
      </button>
    </div>
  );
};
