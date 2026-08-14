import React, { useMemo } from 'react';
import { Sun, Moon } from 'lucide-react';
import { DailyWeatherData, WeatherSettings } from '../types';
import { getMoonPhase } from '../services/weatherService';

interface SunMoonCycleCardProps {
  daily: DailyWeatherData;
  settings: WeatherSettings;
}

export const SunMoonCycleCard: React.FC<SunMoonCycleCardProps> = ({
  daily,
  settings,
}) => {
  const lang = settings.language || 'zh';

  const sunriseStr = daily.sunrise[0];
  const sunsetStr = daily.sunset[0];

  const { sunriseTime, sunsetTime, sunPercent, isDay } = useMemo(() => {
    let sRise = new Date();
    sRise.setHours(5, 27, 0, 0);
    let sSet = new Date();
    sSet.setHours(18, 30, 0, 0);

    if (sunriseStr) {
      const d = new Date(sunriseStr);
      if (!isNaN(d.getTime())) sRise = d;
    }
    if (sunsetStr) {
      const d = new Date(sunsetStr);
      if (!isNaN(d.getTime())) sSet = d;
    }

    const pad = (n: number) => n.toString().padStart(2, '0');
    const riseStr = `${pad(sRise.getHours())}:${pad(sRise.getMinutes())}`;
    const setStr = `${pad(sSet.getHours())}:${pad(sSet.getMinutes())}`;

    const now = new Date();
    const riseTs = sRise.getTime();
    const setTs = sSet.getTime();
    const nowTs = now.getTime();

    let pct = 0;
    const isDayTime = nowTs >= riseTs && nowTs <= setTs;

    if (nowTs <= riseTs) {
      pct = 0;
    } else if (nowTs >= setTs) {
      pct = 1;
    } else {
      pct = (nowTs - riseTs) / (setTs - riseTs);
    }

    return {
      sunriseTime: riseStr,
      sunsetTime: setStr,
      sunPercent: pct,
      isDay: isDayTime,
    };
  }, [sunriseStr, sunsetStr]);

  const moon = getMoonPhase(new Date(), lang);

  // Compute position on SVG parabola
  // Arch equation: y = 4 * height * t * (1 - t)
  // SVG box: 280 x 80
  const svgWidth = 280;
  const svgHeight = 70;
  const sunX = 30 + sunPercent * (svgWidth - 60);
  const sunY = svgHeight - 4 * (svgHeight - 20) * sunPercent * (1 - sunPercent) - 10;

  return (
    <div
      id="sun-moon-cycle-card"
      className="w-full bg-[#0E2849]/70 backdrop-blur-xl rounded-3xl p-4 border border-white/15 shadow-xl text-white mb-3.5 select-none"
    >
      {/* Header: 日月 (Left) | 🌗 蛾眉月 (Right) */}
      <div className="flex items-center justify-between mb-2 px-0.5">
        <span className="text-sm font-semibold text-white tracking-wide">
          {lang === 'zh' ? '日月' : 'Sun & Moon'}
        </span>
        <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium">
          <span>{moon.icon}</span>
          <span>{moon.name}</span>
        </div>
      </div>

      {/* Sun Arch Visualization */}
      <div className="relative w-full h-28 flex items-center justify-center my-1">
        <svg
          className="w-full h-full overflow-visible"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
          {/* Parabolic Dotted Arc Track */}
          <path
            d={`M 30 ${svgHeight - 10} Q ${svgWidth / 2} 0 ${svgWidth - 30} ${svgHeight - 10}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Golden Sun Trajectory Progress Arc */}
          <path
            d={`M 30 ${svgHeight - 10} Q ${svgWidth / 2} 0 ${svgWidth - 30} ${svgHeight - 10}`}
            fill="none"
            stroke="url(#sun-arch-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Dynamic Sun Orb on the Arc */}
          <g transform={`translate(${sunX}, ${sunY})`}>
            <circle r="9" className="fill-amber-400/30 animate-ping" />
            <circle r="7" className="fill-amber-300 stroke-amber-100 stroke-1 shadow-lg" />
            <circle r="4" className="fill-amber-400" />
          </g>

          <defs>
            <linearGradient id="sun-arch-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Sunrise & Sunset times at base */}
      <div className="flex items-center justify-between px-2 pt-1 border-t border-white/10 text-xs text-white/80">
        <div className="flex items-center gap-1.5 font-mono">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-white/60">{lang === 'zh' ? '日出' : 'Sunrise'}</span>
          <span className="font-semibold text-white">{sunriseTime}</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono">
          <Moon className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-white/60">{lang === 'zh' ? '日落' : 'Sunset'}</span>
          <span className="font-semibold text-white">{sunsetTime}</span>
        </div>
      </div>
    </div>
  );
};
