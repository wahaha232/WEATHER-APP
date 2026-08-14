import React from 'react';
import { Droplets, Sun, Eye, Cloud, Mountain, Sparkles } from 'lucide-react';
import { CurrentWeatherData, DailyWeatherData, GeocodingResult, WeatherSettings } from '../types';
import { getUvCategory, calculateDewPoint } from '../services/weatherService';

interface TodayDetailsGridProps {
  current: CurrentWeatherData;
  daily: DailyWeatherData;
  city: GeocodingResult;
  settings: WeatherSettings;
}

export const TodayDetailsGrid: React.FC<TodayDetailsGridProps> = ({
  current,
  daily,
  city,
  settings,
}) => {
  const lang = settings.language || 'zh';

  // 1. Humidity
  const humidityVal = `${current.relativeHumidity}%`;

  // 2. UV Index
  const todayUv = daily.uvIndexMax[0] ?? 0;
  const uvCat = getUvCategory(todayUv, lang);

  // 3. Visibility (meters -> km)
  const visKm = Math.round(Math.min(16, (current.visibility ?? 10000) / 1000));
  const visVal = `${visKm}km`;

  // 4. Dew point (雨露)
  const dewPointC = current.dewPoint ?? calculateDewPoint(current.temperature, current.relativeHumidity);
  const dewPointVal = settings.tempUnit === 'fahrenheit'
    ? `${Math.round((dewPointC * 9) / 5 + 32)}°F`
    : `${Math.round(dewPointC)}°C`;

  // 5. Elevation (海拔)
  const elevationM = city.elevation ?? 8.0;
  const elevationVal = `${elevationM.toFixed(2)}m`;

  // 6. Cloud cover (雲量)
  const cloudCoverVal = `${current.cloudCover}%`;

  const items = [
    {
      id: 'metric-humidity',
      label: lang === 'zh' ? '濕度' : 'Humidity',
      value: humidityVal,
      icon: Droplets,
      iconColor: 'text-sky-400',
    },
    {
      id: 'metric-uv',
      label: lang === 'zh' ? '紫外線指數' : 'UV Index',
      value: uvCat.label,
      icon: Sun,
      iconColor: 'text-amber-400',
    },
    {
      id: 'metric-visibility',
      label: lang === 'zh' ? '能見度' : 'Visibility',
      value: visVal,
      icon: Eye,
      iconColor: 'text-cyan-400',
    },
    {
      id: 'metric-dewpoint',
      label: lang === 'zh' ? '雨露' : 'Dew Point',
      value: dewPointVal,
      icon: Sparkles,
      iconColor: 'text-teal-400',
    },
    {
      id: 'metric-elevation',
      label: lang === 'zh' ? '海拔' : 'Elevation',
      value: elevationVal,
      icon: Mountain,
      iconColor: 'text-emerald-400',
    },
    {
      id: 'metric-cloudcover',
      label: lang === 'zh' ? '雲量' : 'Cloud Cover',
      value: cloudCoverVal,
      icon: Cloud,
      iconColor: 'text-indigo-300',
    },
  ];

  return (
    <div
      id="today-details-grid-card"
      className="w-full bg-[#0E2849]/70 backdrop-blur-xl rounded-3xl p-4 border border-white/15 shadow-xl text-white mb-3.5 select-none"
    >
      {/* Header: 今日詳情 */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <span className="text-sm font-semibold text-white tracking-wide">
          {lang === 'zh' ? '今日詳情' : "Today's Details"}
        </span>
      </div>

      {/* 3x2 Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-white/5 hover:bg-white/10 rounded-2xl p-3 border border-white/10 flex flex-col items-start justify-between transition-colors min-h-[76px]"
            >
              <div className="flex items-center gap-1.5 text-xs text-white/70">
                <Icon className={`w-3.5 h-3.5 ${item.iconColor} flex-shrink-0`} />
                <span className="truncate">{item.label}</span>
              </div>
              <span className="text-sm sm:text-base font-semibold text-white mt-1">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
