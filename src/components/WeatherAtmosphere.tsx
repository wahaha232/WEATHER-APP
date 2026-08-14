import React, { useMemo } from 'react';
import { getWeatherCondition } from '../services/weatherService';

interface WeatherAtmosphereProps {
  weatherCode: number;
  isDay: number;
  children: React.ReactNode;
}

export const WeatherAtmosphere: React.FC<WeatherAtmosphereProps> = ({
  weatherCode,
  isDay,
  children,
}) => {
  const condition = useMemo(() => getWeatherCondition(weatherCode), [weatherCode]);
  const isNight = isDay === 0;

  // Generate rain drops
  const rainDrops = useMemo(() => {
    if (condition.bgType !== 'rain' && condition.bgType !== 'thunder') return [];
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${(i * 3.33 + Math.random() * 2).toFixed(1)}%`,
      delay: `${(Math.random() * 1.5).toFixed(2)}s`,
      duration: `${(0.6 + Math.random() * 0.4).toFixed(2)}s`,
      height: `${16 + Math.floor(Math.random() * 14)}px`,
      opacity: (0.3 + Math.random() * 0.5).toFixed(2),
    }));
  }, [condition.bgType]);

  // Generate snow flakes
  const snowFlakes = useMemo(() => {
    if (condition.bgType !== 'snow') return [];
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: `${(i * 3.5 + Math.random() * 2).toFixed(1)}%`,
      delay: `${(Math.random() * 4).toFixed(2)}s`,
      duration: `${(3 + Math.random() * 3).toFixed(2)}s`,
      size: `${4 + Math.floor(Math.random() * 6)}px`,
      opacity: (0.4 + Math.random() * 0.5).toFixed(2),
    }));
  }, [condition.bgType]);

  // Generate stars for clear night
  const stars = useMemo(() => {
    if (!isNight || condition.bgType === 'rain' || condition.bgType === 'thunder') return [];
    return Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      top: `${Math.floor(Math.random() * 60)}%`,
      left: `${Math.floor(Math.random() * 95)}%`,
      size: `${1 + Math.random() * 2.5}px`,
      delay: `${(Math.random() * 3).toFixed(2)}s`,
      duration: `${(1.5 + Math.random() * 2).toFixed(2)}s`,
    }));
  }, [isNight, condition.bgType]);

  // Gradient background definition matching the soft soothing periwinkle sky aesthetic
  const bgGradient = isNight
    ? condition.bgType === 'thunder'
      ? 'bg-gradient-to-b from-[#0F1E36] via-[#162544] to-[#0A1324]'
      : condition.bgType === 'rain'
      ? 'bg-gradient-to-b from-[#14233D] via-[#1B2F52] to-[#0D182B]'
      : condition.bgType === 'snow'
      ? 'bg-gradient-to-b from-[#1E293B] via-[#334155] to-[#0F172A]'
      : condition.bgType === 'cloudy'
      ? 'bg-gradient-to-b from-[#1E293B] via-[#2D3748] to-[#0F172A]'
      : 'bg-gradient-to-b from-[#0F2042] via-[#152B57] to-[#0A162E]'
    : condition.bgType === 'thunder'
    ? 'bg-gradient-to-b from-[#BACDE5] via-[#C8DAF0] to-[#A8C2E2]'
    : condition.bgType === 'rain'
    ? 'bg-gradient-to-b from-[#B8CCE4] via-[#CDE0F5] to-[#ABC5E4]'
    : condition.bgType === 'snow'
    ? 'bg-gradient-to-b from-[#E0EBF7] via-[#EFF6FC] to-[#D0E2F5]'
    : condition.bgType === 'cloudy'
    ? 'bg-gradient-to-b from-[#C2D6EE] via-[#D5E4F8] to-[#B6CEEC]'
    : condition.bgType === 'fog'
    ? 'bg-gradient-to-b from-[#CCDCEE] via-[#DDE7F5] to-[#BCCEE5]'
    : 'bg-gradient-to-b from-[#C4DBF6] via-[#DCE9FA] to-[#B9D3F3]';

  return (
    <div
      id="weather-atmosphere-container"
      className={`relative min-h-full w-full ${bgGradient} text-white transition-colors duration-1000 overflow-hidden select-none`}
    >
      {/* Background Visual Effects Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Sunny Day Solar Glow Effect */}
        {!isNight && condition.bgType === 'clear' && (
          <div
            id="atmosphere-sun-glow"
            className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-amber-300/25 blur-3xl animate-pulse"
            style={{ animationDuration: '6s' }}
          />
        )}

        {/* Clear Night Stars Effect */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-ping"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDuration: star.duration,
              animationDelay: star.delay,
              opacity: 0.8,
            }}
          />
        ))}

        {/* Drifting Ambient Cloud Blurs */}
        {(condition.bgType === 'cloudy' || condition.bgType === 'fog') && (
          <>
            <div
              className="absolute top-12 -left-20 w-72 h-36 bg-white/10 rounded-full blur-2xl animate-[pulse_8s_ease-in-out_infinite]"
            />
            <div
              className="absolute top-48 -right-16 w-80 h-40 bg-slate-300/10 rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite]"
              style={{ animationDelay: '3s' }}
            />
          </>
        )}

        {/* Thunder flash animation */}
        {condition.bgType === 'thunder' && (
          <div
            id="atmosphere-thunder-flash"
            className="absolute inset-0 bg-white/15 animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite] pointer-events-none"
          />
        )}

        {/* Rain Streaks */}
        {rainDrops.map((drop) => (
          <div
            key={drop.id}
            className="absolute bg-sky-200/80 rounded-full"
            style={{
              left: drop.left,
              top: '-20px',
              width: '1.5px',
              height: drop.height,
              opacity: Number(drop.opacity),
              animation: `rainfall ${drop.duration} linear infinite`,
              animationDelay: drop.delay,
            }}
          />
        ))}

        {/* Snow Drift Flakes */}
        {snowFlakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute bg-white rounded-full blur-[0.5px]"
            style={{
              left: flake.left,
              top: '-10px',
              width: flake.size,
              height: flake.size,
              opacity: Number(flake.opacity),
              animation: `snowfall ${flake.duration} linear infinite`,
              animationDelay: flake.delay,
            }}
          />
        ))}
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full">{children}</div>

      {/* Global CSS keyframes for atmospheric weather */}
      <style>{`
        @keyframes rainfall {
          0% {
            transform: translateY(-20px) translateX(0);
          }
          100% {
            transform: translateY(100vh) translateX(-15px);
          }
        }
        @keyframes snowfall {
          0% {
            transform: translateY(-10px) translateX(0);
          }
          50% {
            transform: translateY(50vh) translateX(12px);
          }
          100% {
            transform: translateY(100vh) translateX(-8px);
          }
        }
      `}</style>
    </div>
  );
};
