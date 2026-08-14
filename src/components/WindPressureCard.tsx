import React from 'react';
import { Gauge } from 'lucide-react';
import { CurrentWeatherData, WeatherSettings } from '../types';
import { getBeaufortScale, getWindDirectionLabel } from '../services/weatherService';

interface WindPressureCardProps {
  current: CurrentWeatherData;
  settings: WeatherSettings;
}

export const WindPressureCard: React.FC<WindPressureCardProps> = ({
  current,
  settings,
}) => {
  const lang = settings.language || 'zh';

  // Wind conversions
  const rawKmh = current.windSpeed;
  let speedNum = rawKmh;
  let unitLabel = 'km/h';

  if (settings.windSpeedUnit === 'mph') {
    speedNum = Math.round(rawKmh * 0.621371 * 10) / 10;
    unitLabel = 'mph';
  } else if (settings.windSpeedUnit === 'ms') {
    speedNum = Math.round((rawKmh / 3.6) * 10) / 10;
    unitLabel = 'm/s';
  }

  const windDirText = getWindDirectionLabel(current.windDirection, lang);
  const beaufort = getBeaufortScale(rawKmh);

  // Pressure
  const pressureVal = current.surfacePressure || current.pressureMsl || 1013.2;

  return (
    <div
      id="wind-pressure-card"
      className="w-full bg-[#0E2849]/70 backdrop-blur-xl rounded-3xl p-4 border border-white/15 shadow-xl text-white mb-3.5 select-none"
    >
      {/* Header: 風 / 壓強 */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <span className="text-sm font-semibold text-white tracking-wide">
          {lang === 'zh' ? '風 / 壓強' : 'Wind & Pressure'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Left: Wind with animated turbines */}
        <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/70 font-medium">
              {lang === 'zh' ? '風向與風速' : 'Wind'}
            </span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold border border-sky-400/30">
              {lang === 'zh' ? `${beaufort.scale} 級` : `Scale ${beaufort.scale}`}
            </span>
          </div>

          {/* Wind turbines visual */}
          <div className="my-2.5 flex items-center gap-3">
            <div className="relative w-9 h-11 flex items-end justify-center">
              {/* Pole */}
              <div className="w-1 h-8 bg-sky-200/40 rounded-t-sm" />
              {/* Rotating Blades */}
              <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-8 h-8 animate-[spin_4s_linear_infinite]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-sky-200 rounded-full" />
                <div className="absolute bottom-1 right-0.5 w-1 h-3.5 bg-sky-200 rounded-full rotate-120 origin-top" />
                <div className="absolute bottom-1 left-0.5 w-1 h-3.5 bg-sky-200 rounded-full -rotate-120 origin-top" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-medium text-white/90">
                {windDirText}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold text-white tracking-tight">
                  {speedNum}
                </span>
                <span className="text-xs text-white/60 font-sans">
                  {unitLabel}
                </span>
              </div>
            </div>
          </div>

          <span className="text-[10px] text-white/50 truncate">
            {beaufort.descriptionZh}
          </span>
        </div>

        {/* Right: Pressure (壓強) */}
        <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/70 font-medium">
              {lang === 'zh' ? '壓強' : 'Pressure'}
            </span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>

          {/* Barometer visual & value */}
          <div className="my-2 flex flex-col justify-center">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white tracking-tight">
                {pressureVal.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-white/60 font-mono mt-0.5">
              mbar / hPa
            </span>
          </div>

          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              style={{
                width: `${Math.min(100, Math.max(0, ((pressureVal - 960) / (1040 - 960)) * 100))}%`,
              }}
              className="h-full bg-gradient-to-r from-sky-400 to-teal-300 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
