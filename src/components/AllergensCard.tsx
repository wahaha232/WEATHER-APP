import React from 'react';
import { AirQualityData, CurrentWeatherData, WeatherSettings } from '../types';
import { calculatePollenAndAllergens } from '../services/weatherService';

interface AllergensCardProps {
  current: CurrentWeatherData;
  airQuality?: AirQualityData;
  settings: WeatherSettings;
  onOpenDetails?: () => void;
}

export const AllergensCard: React.FC<AllergensCardProps> = ({
  current,
  airQuality,
  settings,
  onOpenDetails,
}) => {
  const lang = settings.language || 'zh';

  const allergenItems = calculatePollenAndAllergens(
    current.relativeHumidity,
    current.windSpeed,
    current.temperature,
    airQuality?.usAqi ?? 50,
    lang
  );

  return (
    <div
      id="allergens-card"
      className="w-full bg-[#0E2849]/70 backdrop-blur-xl rounded-3xl p-4 border border-white/15 shadow-xl text-white mb-3.5 select-none"
    >
      {/* Header: 過敏 | 更多 */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <span className="text-sm font-semibold text-white tracking-wide">
          {lang === 'zh' ? '過敏' : 'Allergies & Pollen'}
        </span>
        <button
          onClick={onOpenDetails}
          className="text-xs text-white/50 hover:text-white/80 transition-colors cursor-pointer"
        >
          {lang === 'zh' ? '更多' : 'More'}
        </button>
      </div>

      {/* Allergen items list */}
      <div className="flex flex-col gap-2.5">
        {allergenItems.map((item, idx) => {
          const isHigh = item.level.includes('高') || item.level.includes('High');
          return (
            <div
              key={idx}
              className="flex items-center justify-between bg-white/5 rounded-2xl px-3.5 py-2.5 border border-white/10"
            >
              <span className="text-xs font-medium text-white/90">
                {item.name}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                    isHigh
                      ? 'bg-purple-500/25 text-purple-200 border-purple-400/40'
                      : 'bg-emerald-500/25 text-emerald-200 border-emerald-400/40'
                  }`}
                >
                  {item.level}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
