import React from 'react';
import { AirQualityData, WeatherSettings } from '../types';
import { getAqiCategory } from '../services/weatherService';

interface AqiDetailsCardProps {
  airQuality?: AirQualityData;
  settings: WeatherSettings;
  onOpenDetails?: () => void;
}

export const AqiDetailsCard: React.FC<AqiDetailsCardProps> = ({
  airQuality,
  settings,
  onOpenDetails,
}) => {
  const lang = settings.language || 'zh';

  const aqiScore = airQuality?.usAqi ?? airQuality?.europeanAqi ?? 75;
  const aqiCat = getAqiCategory(aqiScore, lang);

  // Pollutants
  const pm25 = Math.round(airQuality?.pm2_5 ?? 41);
  const pm10 = Math.round(airQuality?.pm10 ?? 30);
  const co = Math.round((airQuality?.carbonMonoxide ?? 200) / 100);
  const no2 = Math.round(airQuality?.nitrogenDioxide ?? 18);
  const so2 = Math.round(airQuality?.sulphurDioxide ?? 15);
  const o3 = Math.round(airQuality?.ozone ?? 75);

  // Determine short level text: e.g. "普通" / "良好" / "優"
  const shortLevel = aqiScore <= 50
    ? (lang === 'zh' ? '優' : 'Good')
    : aqiScore <= 100
    ? (lang === 'zh' ? '普通' : 'Moderate')
    : aqiScore <= 150
    ? (lang === 'zh' ? '輕度' : 'Unhealthy')
    : (lang === 'zh' ? '不良' : 'Poor');

  // Gauge calculation
  const gaugePercent = Math.min(100, Math.max(5, (aqiScore / 200) * 100));
  const strokeDashoffset = 283 - (283 * gaugePercent) / 100;

  return (
    <div
      id="aqi-details-card"
      className="w-full bg-[#0E2849]/70 backdrop-blur-xl rounded-3xl p-4 border border-white/15 shadow-xl text-white mb-3.5 select-none"
    >
      {/* Header: 空氣質量指數 | 更多 */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <span className="text-sm font-semibold text-white tracking-wide">
          {lang === 'zh' ? '空氣質量指數' : 'Air Quality Index'}
        </span>
        <button
          onClick={onOpenDetails}
          className="text-xs text-white/50 hover:text-white/80 transition-colors cursor-pointer"
        >
          {lang === 'zh' ? '更多' : 'More'}
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Left: Circular gauge */}
        <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="7"
            />
            {/* Value circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="7"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white tracking-tight">
              {aqiScore}
            </span>
            <span className="text-xs font-medium text-amber-300">
              {shortLevel}
            </span>
          </div>
        </div>

        {/* Right: Sub-pollutants grid pills */}
        <div className="flex-1 grid grid-cols-3 gap-1.5">
          <div className="bg-white/5 rounded-xl px-2 py-1.5 border border-white/10 flex flex-col items-center justify-center">
            <span className="text-[10px] text-white/60">PM2.5</span>
            <span className="text-xs font-semibold text-white">{pm25}</span>
          </div>
          <div className="bg-white/5 rounded-xl px-2 py-1.5 border border-white/10 flex flex-col items-center justify-center">
            <span className="text-[10px] text-white/60">PM10</span>
            <span className="text-xs font-semibold text-white">{pm10}</span>
          </div>
          <div className="bg-white/5 rounded-xl px-2 py-1.5 border border-white/10 flex flex-col items-center justify-center">
            <span className="text-[10px] text-white/60">CO</span>
            <span className="text-xs font-semibold text-white">{co}</span>
          </div>
          <div className="bg-white/5 rounded-xl px-2 py-1.5 border border-white/10 flex flex-col items-center justify-center">
            <span className="text-[10px] text-white/60">NO2</span>
            <span className="text-xs font-semibold text-white">{no2}</span>
          </div>
          <div className="bg-white/5 rounded-xl px-2 py-1.5 border border-white/10 flex flex-col items-center justify-center">
            <span className="text-[10px] text-white/60">SO2</span>
            <span className="text-xs font-semibold text-white">{so2}</span>
          </div>
          <div className="bg-white/5 rounded-xl px-2 py-1.5 border border-white/10 flex flex-col items-center justify-center">
            <span className="text-[10px] text-white/60">O3</span>
            <span className="text-xs font-semibold text-white">{o3}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
