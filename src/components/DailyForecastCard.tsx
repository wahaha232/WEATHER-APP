import React, { useMemo } from 'react';
import { DailyWeatherData, WeatherSettings } from '../types';
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

  // Process 7 to 10 days
  const dailyItems = useMemo(() => {
    if (!daily.time || daily.time.length === 0) return [];

    const daysCount = Math.min(7, daily.time.length);
    const items = [];

    const weekdayShortZh = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    const weekdayShortEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < daysCount; i++) {
      const dateStr = daily.time[i];
      const date = new Date(dateStr);
      const isToday = i === 0;

      const m = date.getMonth() + 1;
      const d = date.getDate();
      const dateLabel = `${m}/${d}`;

      const dayIdx = date.getDay();
      const weekdayLabel = isToday
        ? (lang === 'zh' ? '今天' : 'Today')
        : (lang === 'zh' ? weekdayShortZh[dayIdx] : weekdayShortEn[dayIdx]);

      const rawMax = daily.temperatureMax[i] ?? 25;
      const rawMin = daily.temperatureMin[i] ?? 18;

      const maxTempNum = Math.round(
        settings.tempUnit === 'fahrenheit' ? (rawMax * 9) / 5 + 32 : rawMax
      );
      const minTempNum = Math.round(
        settings.tempUnit === 'fahrenheit' ? (rawMin * 9) / 5 + 32 : rawMin
      );

      const dayRainProb = daily.precipitationProbabilityMax[i] ?? 0;
      const nightRainProb = daily.precipitationProbabilityNight?.[i] ?? Math.max(5, Math.round(dayRainProb * 0.4));

      items.push({
        weekdayLabel,
        dateLabel,
        isToday,
        weatherCode: daily.weatherCode[i] ?? 0,
        maxTempNum,
        minTempNum,
        dayRainProb,
        nightRainProb,
      });
    }

    return items;
  }, [daily, settings.tempUnit, lang]);

  // Compute Dual Line SVG path (High line + Low line + Shaded area)
  const { highPathD, lowPathD, areaPathD, highPts, lowPts } = useMemo(() => {
    if (dailyItems.length === 0) {
      return { highPathD: '', lowPathD: '', areaPathD: '', highPts: [], lowPts: [] };
    }

    const allMax = dailyItems.map((d) => d.maxTempNum);
    const allMin = dailyItems.map((d) => d.minTempNum);

    const overallMin = Math.min(...allMin) - 1;
    const overallMax = Math.max(...allMax) + 1;
    const range = Math.max(overallMax - overallMin, 5);

    const stepX = 64; // px per day column
    const chartHeight = 56; // SVG chart height in px

    const hPts = dailyItems.map((item, idx) => {
      const x = idx * stepX + stepX / 2;
      const norm = (item.maxTempNum - overallMin) / range;
      const y = chartHeight - norm * (chartHeight - 14) - 7;
      return { x, y, temp: item.maxTempNum };
    });

    const lPts = dailyItems.map((item, idx) => {
      const x = idx * stepX + stepX / 2;
      const norm = (item.minTempNum - overallMin) / range;
      const y = chartHeight - norm * (chartHeight - 14) - 7;
      return { x, y, temp: item.minTempNum };
    });

    // Build smooth high line
    let hD = `M ${hPts[0].x} ${hPts[0].y}`;
    for (let i = 0; i < hPts.length - 1; i++) {
      const mx = (hPts[i].x + hPts[i + 1].x) / 2;
      hD += ` C ${mx} ${hPts[i].y}, ${mx} ${hPts[i + 1].y}, ${hPts[i + 1].x} ${hPts[i + 1].y}`;
    }

    // Build smooth low line
    let lD = `M ${lPts[0].x} ${lPts[0].y}`;
    for (let i = 0; i < lPts.length - 1; i++) {
      const mx = (lPts[i].x + lPts[i + 1].x) / 2;
      lD += ` C ${mx} ${lPts[i].y}, ${mx} ${lPts[i + 1].y}, ${lPts[i + 1].x} ${lPts[i + 1].y}`;
    }

    // Build shaded area between high and low lines
    let aD = `M ${hPts[0].x} ${hPts[0].y}`;
    for (let i = 0; i < hPts.length - 1; i++) {
      const mx = (hPts[i].x + hPts[i + 1].x) / 2;
      aD += ` C ${mx} ${hPts[i].y}, ${mx} ${hPts[i + 1].y}, ${hPts[i + 1].x} ${hPts[i + 1].y}`;
    }
    aD += ` L ${lPts[lPts.length - 1].x} ${lPts[lPts.length - 1].y}`;
    for (let i = lPts.length - 1; i > 0; i--) {
      const mx = (lPts[i].x + lPts[i - 1].x) / 2;
      aD += ` C ${mx} ${lPts[i].y}, ${mx} ${lPts[i - 1].y}, ${lPts[i - 1].x} ${lPts[i - 1].y}`;
    }
    aD += ' Z';

    return {
      highPathD: hD,
      lowPathD: lD,
      areaPathD: aD,
      highPts: hPts,
      lowPts: lPts,
    };
  }, [dailyItems]);

  if (dailyItems.length === 0) return null;

  const totalWidth = dailyItems.length * 64;

  return (
    <div
      id="daily-forecast-card"
      className="w-full bg-[#0E2849]/70 backdrop-blur-xl rounded-3xl p-4 border border-white/15 shadow-xl text-white mb-3.5 select-none"
    >
      {/* Header: 每日預報 📑 (Left) | 15 天 (Right) */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-white tracking-wide">
            {lang === 'zh' ? '每日預報' : 'Daily Forecast'}
          </span>
          <span className="text-sm">📑</span>
        </div>
        <span className="text-xs text-white/50 font-medium">
          {lang === 'zh' ? '15 天' : '15 Days'}
        </span>
      </div>

      {/* Horizontal Scrollable Daily Columns */}
      <div className="overflow-x-auto no-scrollbar pb-1">
        <div style={{ width: `${totalWidth}px` }} className="relative flex flex-col">
          {/* 1. Date Header row: "今天 8/14", "週六 8/15"... */}
          <div className="flex w-full">
            {dailyItems.map((item, idx) => (
              <div
                key={idx}
                className="w-16 flex-shrink-0 text-center flex flex-col items-center"
              >
                <span className="text-xs font-semibold text-white">
                  {item.weekdayLabel}
                </span>
                <span className="text-[10px] text-white/60 font-mono">
                  {item.dateLabel}
                </span>
              </div>
            ))}
          </div>

          {/* 2. Daytime Weather Icon */}
          <div className="flex w-full my-2">
            {dailyItems.map((item, idx) => (
              <div
                key={idx}
                className="w-16 flex-shrink-0 flex items-center justify-center h-7"
              >
                <WeatherIcon
                  code={item.weatherCode}
                  isDay={1}
                  className="w-6 h-6 drop-shadow-sm"
                  size={24}
                />
              </div>
            ))}
          </div>

          {/* 3. Daytime Rain Chance: ☔ 66% */}
          <div className="flex w-full mb-2">
            {dailyItems.map((item, idx) => (
              <div
                key={idx}
                className="w-16 flex-shrink-0 flex items-center justify-center gap-0.5 text-[10px] font-medium text-sky-300"
              >
                <span>☔</span>
                <span>{item.dayRainProb}%</span>
              </div>
            ))}
          </div>

          {/* 4. High Temp Text: ↑35° */}
          <div className="flex w-full mb-1">
            {dailyItems.map((item, idx) => (
              <div
                key={idx}
                className="w-16 flex-shrink-0 text-center text-xs font-semibold text-amber-300"
              >
                ↑{item.maxTempNum}°
              </div>
            ))}
          </div>

          {/* 5. Dual Line Trend Chart with Shaded Area */}
          <div className="relative w-full h-14 my-1">
            <svg
              className="absolute inset-0 w-full h-full overflow-visible"
              viewBox={`0 0 ${totalWidth} 56`}
            >
              {/* Shaded Area between curves */}
              <path d={areaPathD} fill="url(#daily-area-gradient)" opacity="0.25" />

              {/* High Temp Line */}
              <path
                d={highPathD}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Low Temp Line */}
              <path
                d={lowPathD}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* High Temp Dots */}
              {highPts.map((pt, idx) => (
                <circle
                  key={`h-${idx}`}
                  cx={pt.x}
                  cy={pt.y}
                  r="3.5"
                  className="fill-amber-400 stroke-[#0E2849] stroke-2"
                />
              ))}

              {/* Low Temp Dots */}
              {lowPts.map((pt, idx) => (
                <circle
                  key={`l-${idx}`}
                  cx={pt.x}
                  cy={pt.y}
                  r="3.5"
                  className="fill-sky-400 stroke-[#0E2849] stroke-2"
                />
              ))}

              <defs>
                <linearGradient id="daily-area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* 6. Low Temp Text: ↓26° */}
          <div className="flex w-full mt-1 mb-2">
            {dailyItems.map((item, idx) => (
              <div
                key={idx}
                className="w-16 flex-shrink-0 text-center text-xs font-semibold text-sky-300"
              >
                ↓{item.minTempNum}°
              </div>
            ))}
          </div>

          {/* 7. Nighttime Weather Icon */}
          <div className="flex w-full my-1">
            {dailyItems.map((item, idx) => (
              <div
                key={idx}
                className="w-16 flex-shrink-0 flex items-center justify-center h-7"
              >
                <WeatherIcon
                  code={item.weatherCode}
                  isDay={0}
                  className="w-5 h-5 opacity-90 drop-shadow-sm"
                  size={20}
                />
              </div>
            ))}
          </div>

          {/* 8. Nighttime Rain Chance: ☔ 15% */}
          <div className="flex w-full mt-1">
            {dailyItems.map((item, idx) => (
              <div
                key={idx}
                className="w-16 flex-shrink-0 flex items-center justify-center gap-0.5 text-[10px] font-medium text-sky-300/80"
              >
                <span>☔</span>
                <span>{item.nightRainProb}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
