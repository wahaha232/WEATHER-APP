import React, { useMemo } from 'react';
import { DailyWeatherData, WeatherSettings } from '../types';
import { getWindDirectionLabel } from '../services/weatherService';

interface WindTrendCardProps {
  daily: DailyWeatherData;
  settings: WeatherSettings;
}

export const WindTrendCard: React.FC<WindTrendCardProps> = ({
  daily,
  settings,
}) => {
  const lang = settings.language || 'zh';
  const unitLabel = settings.windSpeedUnit === 'mph' ? 'mph' : settings.windSpeedUnit === 'ms' ? 'm/s' : 'km/h';

  const windItems = useMemo(() => {
    if (!daily.time || daily.time.length === 0) return [];
    const count = Math.min(7, daily.time.length);
    const items = [];

    const weekdayShortZh = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    const weekdayShortEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < count; i++) {
      const date = new Date(daily.time[i]);
      const m = date.getMonth() + 1;
      const d = date.getDate();
      const isToday = i === 0;

      const weekdayLabel = isToday
        ? (lang === 'zh' ? '今天' : 'Today')
        : (lang === 'zh' ? weekdayShortZh[date.getDay()] : weekdayShortEn[date.getDay()]);

      const rawKmh = daily.windSpeedMax[i] ?? 12;
      let speedValue = Math.round(rawKmh);
      if (settings.windSpeedUnit === 'mph') {
        speedValue = Math.round(rawKmh * 0.621371);
      } else if (settings.windSpeedUnit === 'ms') {
        speedValue = Math.round(rawKmh / 3.6);
      }

      // Wind direction
      const rawDeg = daily.windDirectionDominant?.[i] ?? ((i * 45 + 30) % 360);
      const dirText = getWindDirectionLabel(rawDeg, lang);

      items.push({
        dateLabel: `${m}/${d}`,
        weekdayLabel,
        speed: speedValue,
        deg: rawDeg,
        dirText,
      });
    }

    return items;
  }, [daily, settings.windSpeedUnit, lang]);

  // Compute SVG line path
  const { pathD, points } = useMemo(() => {
    if (windItems.length === 0) return { pathD: '', points: [] };

    const speeds = windItems.map((w) => w.speed);
    const min = Math.min(...speeds);
    const max = Math.max(...speeds);
    const range = Math.max(max - min, 4);

    const stepX = 64;
    const chartHeight = 36;

    const pts = windItems.map((item, idx) => {
      const x = idx * stepX + stepX / 2;
      const norm = (item.speed - min) / range;
      const y = chartHeight - norm * (chartHeight - 12) - 6;
      return { x, y, speed: item.speed };
    });

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const mx = (pts[i].x + pts[i + 1].x) / 2;
      d += ` C ${mx} ${pts[i].y}, ${mx} ${pts[i + 1].y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
    }

    return { pathD: d, points: pts };
  }, [windItems]);

  if (windItems.length === 0) return null;

  const totalWidth = windItems.length * 64;

  return (
    <div
      id="wind-trend-card"
      className="w-full bg-[#0E2849]/70 backdrop-blur-xl rounded-3xl p-4 border border-white/15 shadow-xl text-white mb-3.5 select-none"
    >
      {/* Header: 風 (mph) 🧭 */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-white tracking-wide">
            {lang === 'zh' ? `風 (${unitLabel})` : `Wind (${unitLabel})`}
          </span>
          <span className="text-sm">🧭</span>
        </div>
      </div>

      {/* Horizontal Scrollable Timeline */}
      <div className="overflow-x-auto no-scrollbar pb-1">
        <div style={{ width: `${totalWidth}px` }} className="relative flex flex-col">
          {/* 1. Wind Speed Number */}
          <div className="flex w-full mb-1">
            {windItems.map((item, idx) => (
              <div
                key={idx}
                className="w-16 flex-shrink-0 text-center text-xs font-semibold text-sky-200"
              >
                {item.speed}
              </div>
            ))}
          </div>

          {/* 2. Connected Line */}
          <div className="relative w-full h-9 my-1">
            <svg
              className="absolute inset-0 w-full h-full overflow-visible"
              viewBox={`0 0 ${totalWidth} 36`}
            >
              <path
                d={pathD}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {points.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r="3.5"
                  className="fill-sky-400 stroke-[#0E2849] stroke-2"
                />
              ))}
            </svg>
          </div>

          {/* 3. Direction Text */}
          <div className="flex w-full my-1.5">
            {windItems.map((item, idx) => (
              <div
                key={idx}
                className="w-16 flex-shrink-0 text-center text-[10px] text-white/80 font-medium truncate px-0.5"
              >
                {item.dirText}
              </div>
            ))}
          </div>

          {/* 4. Mini Compass Needle */}
          <div className="flex w-full my-2">
            {windItems.map((item, idx) => (
              <div
                key={idx}
                className="w-16 flex-shrink-0 flex items-center justify-center h-8"
              >
                <div
                  className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center relative shadow-inner"
                  title={`${item.dirText} (${item.deg}°)`}
                >
                  <div
                    style={{ transform: `rotate(${item.deg}deg)` }}
                    className="w-full h-full flex items-center justify-center transition-transform"
                  >
                    <div className="w-0.5 h-3.5 bg-gradient-to-t from-sky-400 to-red-400 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 5. Date & Weekday */}
          <div className="flex w-full mt-1">
            {windItems.map((item, idx) => (
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
        </div>
      </div>
    </div>
  );
};
