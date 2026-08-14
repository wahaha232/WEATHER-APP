import React from 'react';
import {
  CloudSun,
  MapPin,
  Search,
  Settings,
} from 'lucide-react';
import { AppLanguage, TRANSLATIONS } from '../services/i18n';

interface AndroidNavBarProps {
  currentTab: 'weather' | 'cities' | 'search' | 'settings' | 'widget' | 'export';
  onTabChange: (tab: 'weather' | 'cities' | 'search' | 'settings') => void;
  onOpenSearch: () => void;
  lang?: AppLanguage;
}

export const AndroidNavBar: React.FC<AndroidNavBarProps> = ({
  currentTab,
  onTabChange,
  onOpenSearch,
  lang = 'zh',
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <div
      id="android-bottom-nav-bar"
      className="w-full bg-zinc-950/80 backdrop-blur-xl border-t border-white/10 px-2 py-2 flex items-center justify-around text-white select-none z-30"
    >
      {/* Tab 1: Weather Live */}
      <button
        id="nav-tab-weather"
        onClick={() => onTabChange('weather')}
        className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-2xl transition-all cursor-pointer ${
          currentTab === 'weather'
            ? 'text-sky-400 font-semibold'
            : 'text-white/50 hover:text-white/80'
        }`}
      >
        <div
          className={`p-1 rounded-xl transition-all ${
            currentTab === 'weather' ? 'bg-sky-500/20 shadow-sm' : ''
          }`}
        >
          <CloudSun className="w-5 h-5" />
        </div>
        <span className="text-[11px] whitespace-nowrap leading-none tracking-tight">{t.navLiveWeather}</span>
      </button>

      {/* Tab 2: City List */}
      <button
        id="nav-tab-cities"
        onClick={() => onTabChange('cities')}
        className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-2xl transition-all cursor-pointer ${
          currentTab === 'cities'
            ? 'text-sky-400 font-semibold'
            : 'text-white/50 hover:text-white/80'
        }`}
      >
        <div
          className={`p-1 rounded-xl transition-all ${
            currentTab === 'cities' ? 'bg-sky-500/20 shadow-sm' : ''
          }`}
        >
          <MapPin className="w-5 h-5" />
        </div>
        <span className="text-[11px] whitespace-nowrap leading-none tracking-tight">{t.navMyCities}</span>
      </button>

      {/* Tab 3: Search */}
      <button
        id="nav-tab-search"
        onClick={() => {
          onTabChange('search');
          onOpenSearch();
        }}
        className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-2xl transition-all cursor-pointer ${
          currentTab === 'search'
            ? 'text-sky-400 font-semibold'
            : 'text-white/50 hover:text-white/80'
        }`}
      >
        <div
          className={`p-1 rounded-xl transition-all ${
            currentTab === 'search' ? 'bg-sky-500/20 shadow-sm' : ''
          }`}
        >
          <Search className="w-5 h-5" />
        </div>
        <span className="text-[11px] whitespace-nowrap leading-none tracking-tight">{t.navSearch}</span>
      </button>

      {/* Tab 4: Settings */}
      <button
        id="nav-tab-settings"
        onClick={() => onTabChange('settings')}
        className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-2xl transition-all cursor-pointer ${
          currentTab === 'settings'
            ? 'text-sky-400 font-semibold'
            : 'text-white/50 hover:text-white/80'
        }`}
      >
        <div
          className={`p-1 rounded-xl transition-all ${
            currentTab === 'settings' ? 'bg-sky-500/20 shadow-sm' : ''
          }`}
        >
          <Settings className="w-5 h-5" />
        </div>
        <span className="text-[11px] whitespace-nowrap leading-none tracking-tight">{t.navSettings}</span>
      </button>
    </div>
  );
};
