import React, { useMemo } from 'react';
import { Clock, Droplet, Wind } from 'lucide-react';
import { HourlyWeatherData, WeatherSettings } from '../types';
import { formatTemp, formatWindSpeed } from '../services/weatherService';
import { TRANSLATIONS } from '../services/i18n';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastCardProps {
  hourly: HourlyWeatherData;
  settings: WeatherSettings;
  currentTimeString?: string;
}

export const HourlyForecastCard: React.FC<HourlyForecastCardProps> = ({
  hourly,
  settings,
}) => {
  const lang = settings.language || 'zh';
  const t = TRANSLATIONS[lang];

  // Find current hour index or slice next 24 hours
  const next24Hours = useMemo(() => {
    if (!hourly.time || hourly.time.length === 0) return [];

    const now = new Date();
    const currentIsoHour = now.toISOString().slice(0, 13); // e.g. 2026-08-13T14

    let startIdx = hourly.time.findIndex((t) => t.startsWith(currentIsoHour));
    if (startIdx === -1) {
      // Find nearest hour
      const nowTs = now.getTime();
      let minDiff = Infinity;
      startIdx = 0;
      hourly.time.forEach((t, i) => {
        const diff = Math.abs(new Date(t).getTime() - nowTs);
        if (diff < minDiff) {
          minDiff = diff;
          startIdx = i;
        }
      });
    }

    const items = [];
    const count = Math.min(24, hourly.time.length - startIdx);

    for (let i = 0; i < count; i++) {
      const idx = startIdx + i;
      const timeStr = hourly.time[idx];
      const date = new Date(timeStr);
      const hour = date.getHours();
      const isCurrentHour = i === 0;

      // Determine day or night roughly based on hour (6am to 19pm)
      const isDay = hour >= 6 && hour < 19 ? 1 : 0;

      items.push({
        timeLabel: isCurrentHour ? t.now : `${hour.toString().padStart(2, '0')}:00`,
        fullTime: timeStr,
        temp: hourly.temperature[idx] ?? 0,
        weatherCode: hourly.weatherCode[idx] ?? 0,
        rainProb: hourly.precipitationProbability[idx] ?? 0,
        windSpeed: hourly.windSpeed[idx] ?? 0,
        uv: hourly.uvIndex[idx] ?? 0,
        isDay,
        isCurrentHour,
      });
    }

    return items;
  }, [hourly, t.now]);

  if (next24Hours.length === 0) return null;

  return (
    <div
      id="hourly-forecast-card"
      className="w-full bg-gradient-to-br from-[#0B3465]/90 to-[#071F3F]/95 backdrop-blur-xl rounded-[28px] p-4 border border-white/20 shadow-xl text-white mb-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 text-white font-medium text-sm">
          <Clock className="w-4 h-4 text-sky-300" />
          <span>{t.hourlyForecastTitle}</span>
        </div>
        <span className="text-xs text-white/60">{t.hourlySwipeTip}</span>
      </div>

      {/* Horizontal Scrollable Weather Timeline */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
        {next24Hours.map((item, index) => {
          const wind = formatWindSpeed(item.windSpeed, settings.windSpeedUnit);
          return (
            <div
              key={item.fullTime + index}
              className={`flex-shrink-0 flex flex-col items-center justify-between py-3 px-3 rounded-2xl transition-all ${
                item.isCurrentHour
                  ? 'bg-white/20 border border-white/40 shadow-md min-w-[76px]'
                  : 'bg-white/5 hover:bg-white/15 border border-white/10 min-w-[72px]'
              }`}
            >
              {/* Hour Time */}
              <span
                className={`text-xs font-medium mb-1.5 ${
                  item.isCurrentHour ? 'text-amber-300 font-bold' : 'text-white/80'
                }`}
              >
                {item.timeLabel}
              </span>

              {/* Weather Icon */}
              <div className="my-1.5 flex items-center justify-center h-8">
                <WeatherIcon
                  code={item.weatherCode}
                  isDay={item.isDay}
                  className="w-7 h-7"
                  size={28}
                />
              </div>

              {/* Rain Probability Badge */}
              <div
                className={`flex items-center gap-0.5 text-[11px] mb-1.5 font-medium ${
                  item.rainProb > 20 ? 'text-sky-300' : 'text-white/40'
                }`}
              >
                <Droplet className="w-2.5 h-2.5" />
                <span>{item.rainProb}%</span>
              </div>

              {/* Temperature */}
              <span className="text-base font-semibold text-white">
                {formatTemp(item.temp, settings.tempUnit)}
              </span>

              {/* Wind Speed small indicator */}
              <div className="flex items-center gap-0.5 text-[10px] text-white/50 mt-1">
                <Wind className="w-2.5 h-2.5" />
                <span>{wind.value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
