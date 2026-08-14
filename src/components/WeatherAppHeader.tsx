import React, { useState, useEffect } from 'react';
import { Menu, Plus, LayoutGrid, MapPin } from 'lucide-react';
import { GeocodingResult, WeatherSettings } from '../types';
import { TRANSLATIONS } from '../services/i18n';
import { formatLocalTime, resolveTimezone } from '../services/timeService';

interface WeatherAppHeaderProps {
  city: GeocodingResult;
  settings: WeatherSettings;
  onOpenMenu: () => void;
  onOpenSearch: () => void;
  onOpenWidget: () => void;
  theme?: 'dark' | 'light';
}

export const WeatherAppHeader: React.FC<WeatherAppHeaderProps> = ({
  city,
  settings,
  onOpenMenu,
  onOpenSearch,
  onOpenWidget,
  theme = 'dark',
}) => {
  const [now, setNow] = useState(() => new Date());
  const lang = settings.language || 'zh';
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tz = resolveTimezone(city.timezone, city.latitude, city.longitude);
  const localTime = formatLocalTime(now, tz, settings.timeFormat === '12h', lang);

  // e.g. "週五 18:02" or "Fri 18:02"
  const weekdayShort = localTime.weekdayString.replace(/星期/, '週');
  const subtitle = `${weekdayShort} ${localTime.timeString}`;

  return (
    <div
      id="weather-app-top-header"
      className="w-full px-4 pt-2 pb-1 flex items-center justify-between z-20 text-white select-none"
    >
      {/* Left: Menu Hamburger */}
      <button
        id="btn-header-menu"
        onClick={onOpenMenu}
        aria-label="Menu"
        className="w-9 h-9 rounded-full bg-black/20 hover:bg-black/35 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer active:scale-95 border border-white/10"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Center: City Name + Time Subtitle */}
      <button
        id="btn-header-city"
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center cursor-pointer group"
      >
        <div className="flex items-center gap-1 text-white font-semibold text-base sm:text-lg tracking-tight drop-shadow-sm group-hover:text-sky-200 transition-colors">
          <span>{city.name}</span>
          <MapPin className="w-3.5 h-3.5 text-white/80 fill-white/20" />
        </div>
        <span className="text-[11px] text-white/80 font-medium tracking-wide">
          {subtitle}
        </span>
      </button>

      {/* Right: Widget icon + Add city icon */}
      <div className="flex items-center gap-1.5">
        <button
          id="btn-header-widgets"
          onClick={onOpenWidget}
          aria-label="Widgets"
          title={lang === 'zh' ? '桌面小工具' : 'Widgets'}
          className="w-9 h-9 rounded-full bg-black/20 hover:bg-black/35 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer active:scale-95 border border-white/10"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
        <button
          id="btn-header-add-city"
          onClick={onOpenSearch}
          aria-label="Add City"
          title={lang === 'zh' ? '新增城市' : 'Add City'}
          className="w-9 h-9 rounded-full bg-black/20 hover:bg-black/35 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer active:scale-95 border border-white/10"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
