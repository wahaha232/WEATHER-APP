import React, { useMemo } from 'react';
import { HourlyWeatherData, WeatherSettings } from '../types';
import { TRANSLATIONS } from '../services/i18n';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastCardProps {
  hourly: HourlyWeatherData;
  settings: WeatherSettings;
}

export const HourlyForecastCard: React.FC<HourlyForecastCardProps> = ({
  hourly,
  settings,
}) => {
  const lang = settings.language || 'zh';
  const t = TRANSLATIONS[lang];

  // Prepare 24-48 hours
  const hourlyItems = useMemo(() => {
    if (!hourly.time || hourly.time.length === 0) return [];

    const now = new Date();
    const currentIsoHour = now.toISOString().slice(0, 13);

    let startIdx = hourly.time.findIndex((t) => t.startsWith(currentIsoHour));
    if (startIdx === -1) {
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

    const count = Math.min(24, hourly.time.length - startIdx);
    const items = [];

    for (let i = 0; i < count; i++) {
      const idx = startIdx + i;
      const timeStr = hourly.time[idx];
      const date = new Date(timeStr);
      const hour = date.getHours();
      const hourLabel = `${hour.toString().padStart(2, '0')}:00`;

      // Determine day or night based on hour
      const isDay = hour >= 6 && hour < 19 ? 1 : 0;
      const rawTemp = hourly.temperature[idx] ?? 25;
      const tempNum = Math.round(
        settings.tempUnit === 'fahrenheit' ? (rawTemp * 9) / 5 + 32 : rawTemp
      );

      items.push({
        timeLabel: hourLabel,
        fullTime: timeStr,
        tempNum,
        weatherCode: hourly.weatherCode[idx] ?? 0,
        rainProb: hourly.precipitationProbability[idx] ?? 0,
        snowProb: hourly.snowfallProbability?.[idx] ?? 0,
        isDay,
      });
    }

    return items;
  }, [hourly, settings.tempUnit]);

  // Compute SVG smooth line path for temperature
  const { pathD, points, minTemp, maxTemp } = useMemo(() => {
    if (hourlyItems.length === 0) return { pathD: '', points: [], minTemp: 0, maxTemp: 100 };

    const temps = hourlyItems.map((i) => i.tempNum);
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const range = Math.max(max - min, 4);

    const stepX = 64; // width per column in px
    const chartHeight = 36; // SVG chart height in px

    const pts = hourlyItems.map((item, idx) => {
      const x = idx * stepX + stepX / 2;
      // y is inverted (higher temp = smaller y)
      const norm = (item.tempNum - min) / range;
      const y = chartHeight - norm * (chartHeight - 12) - 6;
      return { x, y, temp: item.tempNum };
    });

    if (pts.length < 2) {
      return { pathD: '', points: pts, minTemp: min, maxTemp: max };
    }

    // Build smooth cubic bezier curve
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const mx = (p0.x + p1.x) / 2;
      d += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    return { pathD: d, points: pts, minTemp: min, maxTemp: max };
  }, [hourlyItems]);

  if (hourlyItems.length === 0) return null;

  const totalWidth = hourlyItems.length * 64;

  return (
    <div
      id="hourly-forecast-card"
      className="w-full bg-[#0E2849]/70 backdrop-blur-xl rounded-3xl p-4 border border-white/15 shadow-xl text-white mb-3.5 select-none"
    >
      {/* Header: 小時預報 (Left) | 48 小時 (Right) */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <span className="text-sm font-semibold text-white tracking-wide">
          {lang === 'zh' ? '小時預報' : 'Hourly Forecast'}
        </span>
        <span className="text-xs text-white/50 font-medium">
          {lang === 'zh' ? '48 小時' : '48 Hours'}
        </span>
      </div>

      {/* Horizontal Scrollable Timeline Container */}
      <div className="overflow-x-auto no-scrollbar pb-1">
        <div style={{ width: `${totalWidth}px` }} className="relative flex flex-col">
          {/* 1. Time row */}
          <div className="flex w-full">
            {hourlyItems.map((item, idx) => (
              <div
                key={idx}
                className="w-16 flex-shrink-0 text-center text-xs text-white/70 font-medium"
              >
                {item.timeLabel}
              </div>
            ))}
          </div>

          {/* 2. Weather Icon row */}
          <div className="flex w-full my-2">
            {hourlyItems.map((item, idx) => (
              <div
                key={idx}
                className="w-16 flex-shrink-0 flex items-center justify-center h-7"
              >
                <WeatherIcon
                  code={item.weatherCode}
                  isDay={item.isDay}
                  className="w-6 h-6 drop-shadow-sm"
                  size={24}
                />
              </div>
            ))}
          </div>

          {/* 3. Temperature Number Labels */}
          <div className="flex w-full mb-1">
            {hourlyItems.map((item, idx) => (
              <div
                key={idx}
                className="w-16 flex-shrink-0 text-center text-xs font-semibold text-white"
              >
                {item.tempNum}°
              </div>
            ))}
          </div>

          {/* 4. Smooth Connected Line Graph */}
          <div className="relative w-full h-9 my-1">
            <svg
              className="absolute inset-0 w-full h-full overflow-visible"
              viewBox={`0 0 ${totalWidth} 36`}
            >
              {/* The smooth line */}
              <path
                d={pathD}
                fill="none"
                stroke="url(#hourly-line-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Connected Dots */}
              {points.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r="3.5"
                  className="fill-lime-400 stroke-[#0E2849] stroke-2 shadow-sm"
                />
              ))}

              <defs>
                <linearGradient id="hourly-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a3e635" />
                  <stop offset="50%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#a3e635" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* 5. Rain Probability with Umbrella Icon */}
          <div className="flex w-full mt-2">
            {hourlyItems.map((item, idx) => (
              <div
                key={idx}
                className="w-16 flex-shrink-0 flex items-center justify-center gap-0.5 text-[11px] font-medium text-sky-300"
              >
                <span>☔</span>
                <span>{item.rainProb}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Legend */}
      <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-white/10 text-[11px] text-white/50">
        <div className="flex items-center gap-1">
          <span>☔</span>
          <span>{lang === 'zh' ? '降雨機率' : 'Rain Probability'}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>❄️</span>
          <span>{lang === 'zh' ? '降雪機率' : 'Snow Probability'}</span>
        </div>
      </div>
    </div>
  );
};
