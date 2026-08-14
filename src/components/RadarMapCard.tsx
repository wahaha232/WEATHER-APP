import React, { useState } from 'react';
import { Layers, Maximize2, Play, Pause } from 'lucide-react';
import { GeocodingResult, WeatherSettings } from '../types';

interface RadarMapCardProps {
  city: GeocodingResult;
  settings: WeatherSettings;
  onOpenRadarModal?: () => void;
}

export const RadarMapCard: React.FC<RadarMapCardProps> = ({
  city,
  settings,
  onOpenRadarModal,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const lang = settings.language || 'zh';

  return (
    <div
      id="radar-map-card"
      className="w-full bg-[#0E2849]/70 backdrop-blur-xl rounded-3xl p-4 border border-white/15 shadow-xl text-white mb-3.5 select-none"
    >
      {/* Header: 雷達地圖 */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-white tracking-wide">
            {lang === 'zh' ? '雷達地圖' : 'Radar Map'}
          </span>
          <Layers className="w-3.5 h-3.5 text-sky-400" />
        </div>
        <button
          id="btn-expand-radar"
          onClick={onOpenRadarModal}
          className="text-xs text-white/60 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>{lang === 'zh' ? '全螢幕' : 'Expand'}</span>
        </button>
      </div>

      {/* Map Preview Container */}
      <div
        onClick={onOpenRadarModal}
        className="relative w-full h-44 rounded-2xl overflow-hidden border border-white/10 bg-[#07172B] cursor-pointer group"
      >
        {/* Dynamic Stylized Radar Canvas / Map representation */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

        {/* Map topography silhouette */}
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 300 150">
          <path
            d="M 20 80 Q 60 40 100 70 T 180 60 T 260 90 L 300 120 L 300 150 L 0 150 Z"
            fill="#1e293b"
          />
        </svg>

        {/* Animated Radar Sweep */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-36 h-36 rounded-full border border-sky-400/20">
            <div className="absolute inset-0 rounded-full border border-sky-400/10 scale-75" />
            <div className="absolute inset-0 rounded-full border border-sky-400/10 scale-50" />
            {/* Sweep ray */}
            <div className="absolute inset-0 animate-[spin_5s_linear_infinite] origin-center">
              <div className="w-1/2 h-1/2 bg-gradient-to-br from-sky-400/30 via-emerald-400/15 to-transparent rounded-tl-full" />
            </div>
          </div>
        </div>

        {/* Precipitation Blobs */}
        <div className="absolute top-10 left-12 w-16 h-12 rounded-full bg-emerald-500/30 blur-md animate-pulse" />
        <div className="absolute top-14 left-24 w-20 h-14 rounded-full bg-cyan-500/25 blur-lg" />
        <div className="absolute top-8 right-16 w-14 h-10 rounded-full bg-yellow-500/20 blur-md" />

        {/* Center City Pin */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="relative flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-red-500 ring-4 ring-red-400/40 animate-ping" />
            <div className="w-2.5 h-2.5 rounded-full bg-white absolute" />
          </div>
          <span className="mt-1 text-[11px] font-semibold text-white drop-shadow-md bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/20">
            {city.name}
          </span>
        </div>

        {/* Radar Scale Legend at Bottom */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px]">
          <div className="flex items-center gap-1 text-white/70">
            <span>{lang === 'zh' ? '降水強度' : 'Intensity'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-white/60">{lang === 'zh' ? '小' : 'Light'}</span>
            <div className="w-16 h-1.5 rounded-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-500" />
            <span className="text-[9px] text-white/60">{lang === 'zh' ? '強' : 'Heavy'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
