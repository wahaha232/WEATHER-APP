import React from 'react';
import { Camera, Sun, Moon } from 'lucide-react';
import { DailyWeatherData, WeatherSettings } from '../types';
import { getPhotographyTimes } from '../services/weatherService';

interface PhotographyCardProps {
  daily: DailyWeatherData;
  settings: WeatherSettings;
  onOpenDetails?: () => void;
}

export const PhotographyCard: React.FC<PhotographyCardProps> = ({
  daily,
  settings,
  onOpenDetails,
}) => {
  const lang = settings.language || 'zh';

  const sunriseStr = daily.sunrise[0];
  const sunsetStr = daily.sunset[0];

  const photoTimes = getPhotographyTimes(sunriseStr, sunsetStr);

  return (
    <div
      id="photography-card"
      className="w-full bg-[#0E2849]/70 backdrop-blur-xl rounded-3xl p-4 border border-white/15 shadow-xl text-white mb-3.5 select-none"
    >
      {/* Header: 攝影 | 更多 */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-white tracking-wide">
            {lang === 'zh' ? '攝影' : 'Photography'}
          </span>
          <Camera className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <button
          onClick={onOpenDetails}
          className="text-xs text-white/50 hover:text-white/80 transition-colors cursor-pointer"
        >
          {lang === 'zh' ? '更多' : 'More'}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {/* 1. 黃金時段 (Golden Hour) */}
        <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300">
              {lang === 'zh' ? '黃金時段' : 'Golden Hour'}
            </span>
          </div>

          <p className="text-[11px] text-white/70 leading-relaxed">
            {lang === 'zh'
              ? '當天空從紅色變為黃色時，天空將具有黃金色調。風景攝影的理想選擇。'
              : 'Warm golden tones as the sky transitions from red to yellow. Ideal for landscapes.'}
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-amber-200">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>{photoTimes.goldenMorning}</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-200">
              <Moon className="w-3.5 h-3.5 text-amber-400" />
              <span>{photoTimes.goldenEvening}</span>
            </div>
          </div>
        </div>

        {/* 2. 藍色時段 (Blue Hour) */}
        <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-300">
              {lang === 'zh' ? '藍色時段' : 'Blue Hour'}
            </span>
          </div>

          <p className="text-[11px] text-white/70 leading-relaxed">
            {lang === 'zh'
              ? '天空將有深藍色調和冷飽和色。城市攝影的理想選擇。'
              : 'Deep blue hues with cool saturated colors. Ideal for cityscape photography.'}
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-sky-200">
              <Sun className="w-3.5 h-3.5 text-sky-400" />
              <span>{photoTimes.blueMorning}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sky-200">
              <Moon className="w-3.5 h-3.5 text-sky-400" />
              <span>{photoTimes.blueEvening}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
