import React, { useMemo } from 'react';
import { CalendarDays, Droplets } from 'lucide-react';
import { DailyWeatherData, WeatherSettings } from '../types';
import {
  formatTemp,
  getWeatherCondition,
} from '../services/weatherService';
import { TRANSLATIONS } from '../services/i18n';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastCardProps {
  daily: DailyWeatherData;
  settings: WeatherSettings;
}

export const DailyForecastCard: React.FC<DailyForecastCardProps> = ({
  daily,
  settings,
}) => {
  const lang = settings.language || 'zh';
  const t = TRANSLATIONS[lang];

  const daysList = useMemo(() => {
    if (!daily.time || daily.time.length === 0) return [];

    const weekdays = t.weekdays;

    // Find global min and max across all days to normalize the temperature range bars
    const allMins = daily.temperatureMin.filter((v) => v !== undefined && !isNaN(v));
    const allMaxs = daily.temperatureMax.filter((v) => v !== undefined && !isNaN(v));

    const globalMin = Math.min(...allMins);
    const globalMax = Math.max(...allMaxs);
    const globalRange = Math.max(globalMax - globalMin, 1);

    return daily.time.map((dateStr, index) => {
      const date = new Date(dateStr);
      const isToday = index === 0;
      const isTomorrow = index === 1;

      const dayName = isToday
        ? t.today
        : isTomorrow
        ? t.tomorrow
        : weekdays[date.getDay()];

      const monthDay = `${date.getMonth() + 1}/${date.getDate()}`;
      const minTemp = daily.temperatureMin[index] ?? 0;
      const maxTemp = daily.temperatureMax[index] ?? 0;
      const weatherCode = daily.weatherCode[index] ?? 0;
      const rainProb = daily.precipitationProbabilityMax[index] ?? 0;
      const condition = getWeatherCondition(weatherCode, lang);

      // Relative bar position calculations
      const leftPercent = Math.max(0, ((minTemp - globalMin) / globalRange) * 100);
      const widthPercent = Math.max(
        12,
        ((maxTemp - minTemp) / globalRange) * 100
      );

      return {
        dateStr,
        dayName,
        monthDay,
        minTemp,
        maxTemp,
        weatherCode,
        condition,
        rainProb,
        isToday,
        barStyle: {
          left: `${leftPercent.toFixed(1)}%`,
          width: `${widthPercent.toFixed(1)}%`,
        },
      };
    });
  }, [daily, lang, t]);

  if (daysList.length === 0) return null;

  return (
    <div
      id="daily-forecast-card"
      className="w-full bg-gradient-to-br from-[#0B3465]/90 to-[#071F3F]/95 backdrop-blur-xl rounded-[28px] p-4 sm:p-5 border border-white/20 shadow-xl text-white mb-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 text-white text-sm font-medium">
          <CalendarDays className="w-4 h-4 text-emerald-300" />
          <span>{t.dailyForecastTitle}</span>
        </div>
        <span className="text-xs text-white/60">{t.tempRangeTrend}</span>
      </div>

      {/* Days List */}
      <div className="flex flex-col divide-y divide-white/10">
        {daysList.map((day) => (
          <div
            key={day.dateStr}
            className="flex items-center justify-between py-2.5 px-1 hover:bg-white/5 rounded-xl transition-colors"
          >
            {/* Weekday & Date */}
            <div className="flex flex-col w-20 flex-shrink-0">
              <span
                className={`text-sm font-medium ${
                  day.isToday ? 'text-amber-300 font-bold' : 'text-white'
                }`}
              >
                {day.dayName}
              </span>
              <span className="text-[11px] text-white/60">{day.monthDay}</span>
            </div>

            {/* Weather Icon & Rain Prob */}
            <div className="flex items-center gap-2 w-28 flex-shrink-0">
              <WeatherIcon
                code={day.weatherCode}
                isDay={1}
                className="w-6 h-6"
                size={24}
              />
              <div className="flex flex-col">
                <span className="text-xs text-white font-normal truncate max-w-[65px]">
                  {day.condition.label}
                </span>
                {day.rainProb > 0 ? (
                  <span className="flex items-center gap-0.5 text-[10px] text-sky-300 font-medium">
                    <Droplets className="w-2.5 h-2.5" />
                    {day.rainProb}%
                  </span>
                ) : (
                  <span className="text-[10px] text-white/30">0%</span>
                )}
              </div>
            </div>

            {/* Min Temp */}
            <span className="text-xs text-white/70 font-medium w-8 text-right flex-shrink-0">
              {formatTemp(day.minTemp, settings.tempUnit)}
            </span>

            {/* Temperature Gradient Range Bar */}
            <div className="relative flex-1 mx-3 h-2 bg-white/15 rounded-full overflow-hidden">
              <div
                className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400 shadow-sm"
                style={day.barStyle}
              />
            </div>

            {/* Max Temp */}
            <span className="text-xs text-white font-semibold w-8 text-right flex-shrink-0">
              {formatTemp(day.maxTemp, settings.tempUnit)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
