import React, { useMemo } from 'react';
import {
  Activity,
  Sun,
  Sunset,
  Sunrise,
  Compass,
  Droplets,
  Eye,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { FullWeatherResponse, WeatherSettings } from '../types';
import {
  formatWindSpeed,
  getAqiCategory,
  getUvCategory,
  getWindDirectionText,
} from '../services/weatherService';
import { TRANSLATIONS } from '../services/i18n';

interface WeatherMetricsGridProps {
  data: FullWeatherResponse;
  settings: WeatherSettings;
}

export const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({
  data,
  settings,
}) => {
  const { current, daily, airQuality } = data;
  const lang = settings.language || 'zh';
  const t = TRANSLATIONS[lang];

  const aqiInfo = useMemo(
    () => getAqiCategory(airQuality?.usAqi, lang),
    [airQuality?.usAqi, lang]
  );

  const todayUvMax = daily.uvIndexMax[0] ?? 0;
  const uvInfo = useMemo(() => getUvCategory(todayUvMax, lang), [todayUvMax, lang]);

  const windInfo = formatWindSpeed(current.windSpeed, settings.windSpeedUnit);
  const gustInfo = formatWindSpeed(current.windGusts, settings.windSpeedUnit);
  const windDirText = getWindDirectionText(current.windDirection, lang);

  // Sunrise and Sunset format
  const sunriseStr = useMemo(() => {
    if (!daily.sunrise || !daily.sunrise[0]) return '--:--';
    const date = new Date(daily.sunrise[0]);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }, [daily.sunrise]);

  const sunsetStr = useMemo(() => {
    if (!daily.sunset || !daily.sunset[0]) return '--:--';
    const date = new Date(daily.sunset[0]);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }, [daily.sunset]);

  // Daylight duration
  const daylightDuration = useMemo(() => {
    if (!daily.sunrise?.[0] || !daily.sunset?.[0]) return lang === 'zh' ? '約 13 小時' : '~13 hours';
    const diffMs = new Date(daily.sunset[0]).getTime() - new Date(daily.sunrise[0]).getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return lang === 'zh' ? `${diffHrs}小時 ${diffMins}分鐘` : `${diffHrs}h ${diffMins}m`;
  }, [daily.sunrise, daily.sunset, lang]);

  return (
    <div id="weather-metrics-grid" className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
      {/* 1. Air Quality Card */}
      <div
        id="metric-card-aqi"
        className="bg-gradient-to-br from-[#0B3465]/90 to-[#071F3F]/95 backdrop-blur-xl rounded-[28px] p-4 sm:p-5 border border-white/20 shadow-xl text-white flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm text-white font-medium">
            <Activity className="w-4 h-4 text-emerald-300" />
            <span>{t.aqiTitle}</span>
          </div>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${aqiInfo.bgColor} ${aqiInfo.color}`}
          >
            {aqiInfo.label}
          </span>
        </div>

        <div className="flex items-baseline gap-3 my-2">
          <span className="text-4xl font-light font-sans text-white">
            {airQuality?.usAqi ?? '--'}
          </span>
          <div className="text-xs text-white/70 flex flex-col">
            <span>{t.aqiStandard}</span>
            {airQuality?.pm2_5 !== undefined && (
              <span className="text-emerald-300 font-medium">
                PM2.5: {airQuality.pm2_5.toFixed(1)} μg/m³
              </span>
            )}
          </div>
        </div>

        {/* AQI Progress Bar */}
        <div className="relative w-full h-2 bg-white/15 rounded-full overflow-hidden my-1">
          <div
            className="absolute top-0 left-0 bottom-0 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500"
            style={{
              width: `${Math.min(100, ((airQuality?.usAqi ?? 30) / 200) * 100)}%`,
            }}
          />
        </div>

        <p className="text-xs text-white/85 mt-2 leading-relaxed bg-[#051730]/60 p-2.5 rounded-2xl border border-white/10">
          {aqiInfo.advice}
        </p>
      </div>

      {/* 2. UV Index Card */}
      <div
        id="metric-card-uv"
        className="bg-gradient-to-br from-[#0B3465]/90 to-[#071F3F]/95 backdrop-blur-xl rounded-[28px] p-4 sm:p-5 border border-white/20 shadow-xl text-white flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm text-white font-medium">
            <Sun className="w-4 h-4 text-amber-300" />
            <span>{t.uvTitle}</span>
          </div>
          <span className={`text-xs font-semibold ${uvInfo.color}`}>
            {uvInfo.label}
          </span>
        </div>

        <div className="flex items-baseline gap-3 my-2">
          <span className="text-4xl font-light font-sans text-white">
            {todayUvMax.toFixed(1)}
          </span>
          <span className="text-xs text-white/70">{t.uvTodayMax}</span>
        </div>

        {/* UV Progress Bar */}
        <div className="relative w-full h-2 bg-white/15 rounded-full overflow-hidden my-1">
          <div
            className="absolute top-0 left-0 bottom-0 rounded-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-purple-600"
            style={{
              width: `${Math.min(100, (todayUvMax / 12) * 100)}%`,
            }}
          />
        </div>

        <p className="text-xs text-white/85 mt-2 leading-relaxed bg-[#051730]/60 p-2.5 rounded-2xl border border-white/10">
          {uvInfo.advice}
        </p>
      </div>

      {/* 3. Sunrise & Sunset Solar Arc Card */}
      <div
        id="metric-card-sun"
        className="bg-gradient-to-br from-[#0B3465]/90 to-[#071F3F]/95 backdrop-blur-xl rounded-[28px] p-4 sm:p-5 border border-white/20 shadow-xl text-white flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm text-white font-medium">
            <Sunrise className="w-4 h-4 text-amber-300" />
            <span>{t.sunriseSunsetTitle}</span>
          </div>
          <span className="text-xs text-white/60">{t.totalDaylight} {daylightDuration}</span>
        </div>

        {/* Arc visual */}
        <div className="relative w-full h-16 flex items-center justify-center my-1">
          {/* Curve arc */}
          <div className="w-4/5 h-16 border-t-2 border-dashed border-amber-300/60 rounded-t-full relative flex items-center justify-center">
            <div className="absolute -top-3 w-6 h-6 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] flex items-center justify-center text-amber-950 font-bold text-[10px]">
              <Sun className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '20s' }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl">
            <Sunrise className="w-5 h-5 text-amber-300" />
            <div className="flex flex-col">
              <span className="text-[11px] text-white/60">{t.sunrise}</span>
              <span className="text-sm font-semibold text-white">{sunriseStr}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl">
            <Sunset className="w-5 h-5 text-orange-400" />
            <div className="flex flex-col">
              <span className="text-[11px] text-white/60">{t.sunset}</span>
              <span className="text-sm font-semibold text-white">{sunsetStr}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Wind Compass Card */}
      <div
        id="metric-card-wind"
        className="bg-gradient-to-br from-[#0B3465]/90 to-[#071F3F]/95 backdrop-blur-xl rounded-[28px] p-4 sm:p-5 border border-white/20 shadow-xl text-white flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm text-white font-medium">
            <Compass className="w-4 h-4 text-teal-300" />
            <span>{t.windTitle}</span>
          </div>
          <span className="text-xs text-white/70 bg-white/10 px-2 py-0.5 rounded-full">
            {windDirText}
          </span>
        </div>

        <div className="flex items-center justify-between my-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-light font-sans text-white">
                {windInfo.value}
              </span>
              <span className="text-xs text-white/70">{windInfo.label}</span>
            </div>
            <div className="text-xs text-white/60 mt-1">
              {t.gustMax}{gustInfo.value} {gustInfo.label}
            </div>
          </div>

          {/* Rotating Compass Indicator */}
          <div className="relative w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center bg-black/20 shadow-inner">
            <span className="absolute top-0.5 text-[9px] font-bold text-white/60">N</span>
            <span className="absolute bottom-0.5 text-[9px] font-bold text-white/60">S</span>
            <span className="absolute left-1 text-[9px] font-bold text-white/60">W</span>
            <span className="absolute right-1 text-[9px] font-bold text-white/60">E</span>
            <div
              className="w-8 h-8 flex items-center justify-center transition-transform duration-500"
              style={{
                transform: `rotate(${current.windDirection}deg)`,
              }}
            >
              <div className="w-1.5 h-6 bg-gradient-to-t from-transparent via-teal-300 to-amber-300 rounded-full" />
            </div>
          </div>
        </div>

        <div className="text-xs text-white/80 bg-[#051730]/60 p-2 rounded-xl mt-1 border border-white/10">
          {t.windAngle}{current.windDirection}° ({windDirText})
        </div>
      </div>

      {/* 5. Humidity & Pressure */}
      <div
        id="metric-card-humidity"
        className="bg-gradient-to-br from-[#0B3465]/90 to-[#071F3F]/95 backdrop-blur-xl rounded-[28px] p-4 sm:p-5 border border-white/20 shadow-xl text-white flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm text-white font-medium">
            <Droplets className="w-4 h-4 text-blue-300" />
            <span>{t.humidityPressureTitle}</span>
          </div>
          <span className="text-xs text-white/60">
            {current.relativeHumidity > 75
              ? t.humidEnv
              : current.relativeHumidity < 40
              ? t.dryEnv
              : t.comfortableEnv}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 my-2">
          <div>
            <span className="text-[11px] text-white/60">{t.relativeHumidity}</span>
            <div className="text-3xl font-light font-sans text-white">
              {current.relativeHumidity}%
            </div>
          </div>
          <div>
            <span className="text-[11px] text-white/60">{t.airPressure}</span>
            <div className="text-3xl font-light font-sans text-white">
              {Math.round(current.pressureMsl || current.surfacePressure || 1013)}
              <span className="text-xs font-normal text-white/60 ml-1">hPa</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-white/80 bg-[#051730]/60 p-2 rounded-xl border border-white/10">
          {t.cloudCover}{current.cloudCover}%
        </div>
      </div>

      {/* 6. Visibility & Safe Travel Tip */}
      <div
        id="metric-card-visibility"
        className="bg-gradient-to-br from-[#0B3465]/90 to-[#071F3F]/95 backdrop-blur-xl rounded-[28px] p-4 sm:p-5 border border-white/20 shadow-xl text-white flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm text-white font-medium">
            <Eye className="w-4 h-4 text-indigo-300" />
            <span>{t.visibilityTitle}</span>
          </div>
          <span className="text-xs text-emerald-300 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t.viewClear}
          </span>
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-light font-sans text-white">
              {(data.hourly.visibility?.[0] ? data.hourly.visibility[0] / 1000 : 10).toFixed(0)}
            </span>
            <span className="text-xs text-white/70">{lang === 'zh' ? '公里 (km)' : 'km'}</span>
          </div>
          <p className="text-xs text-white/60 mt-1">{t.visibilityTip}</p>
        </div>

        <div className="text-xs text-white/85 bg-[#051730]/60 p-2 rounded-xl flex items-center gap-2 border border-white/10">
          <Flame className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{t.stayHydratedTip}</span>
        </div>
      </div>
    </div>
  );
};
