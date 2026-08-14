import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Navigation,
  X,
  Loader2,
  Globe,
  Check,
} from 'lucide-react';
import { GeocodingResult, WeatherSettings } from '../types';
import { POPULAR_CITIES, searchCities } from '../services/weatherService';
import { TRANSLATIONS } from '../services/i18n';

interface CitySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (city: GeocodingResult) => void;
  onLocateGps: () => void;
  isLocatingGps: boolean;
  currentCityId?: number | string;
  settings: WeatherSettings;
}

export const CitySearchModal: React.FC<CitySearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCity,
  onLocateGps,
  isLocatingGps,
  currentCityId,
  settings,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const lang = settings.language || 'zh';
  const t = TRANSLATIONS[lang];

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchCities(query, lang);
        setResults(res);
        setHasSearched(true);
      } catch (e) {
        console.error('Search failed', e);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, lang]);

  if (!isOpen) return null;

  return (
    <div
      id="city-search-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="city-search-modal-container"
        className="w-full max-w-lg bg-zinc-900/95 border border-white/20 rounded-3xl p-5 shadow-2xl text-white flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-semibold">{t.searchModalTitle}</h2>
          </div>
          <button
            id="btn-close-search-modal"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative my-4">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            id="input-city-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            autoFocus
            className="w-full pl-11 pr-10 py-3 bg-white/10 rounded-2xl border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 text-sm transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* GPS Quick Action */}
        <div className="mb-4">
          <button
            id="btn-gps-locate"
            onClick={() => {
              onLocateGps();
              onClose();
            }}
            disabled={isLocatingGps}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-500/20 to-blue-600/20 hover:from-sky-500/30 hover:to-blue-600/30 border border-sky-400/30 text-sky-300 font-medium text-sm transition-all active:scale-98 cursor-pointer"
          >
            {isLocatingGps ? (
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
            ) : (
              <Navigation className="w-4 h-4 rotate-45 text-sky-400" />
            )}
            <span>{t.locateMeGps}</span>
          </button>
        </div>

        {/* Content Area: Results or Popular City Chips */}
        <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 text-white/60 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
              <span className="text-xs">{t.searchingDatabase}</span>
            </div>
          ) : results.length > 0 ? (
            <div>
              <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 px-1">
                {t.searchResults} ({results.length})
              </div>
              <div className="space-y-1.5">
                {results.map((item) => {
                  const isCurrent =
                    currentCityId === item.id ||
                    (item.latitude &&
                      item.longitude &&
                      Number(currentCityId) === item.id);

                  return (
                    <button
                      key={`${item.id}-${item.latitude}-${item.longitude}`}
                      onClick={() => {
                        onSelectCity(item);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:bg-sky-500/20 border border-white/10 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white/10 group-hover:bg-sky-500/20 text-sky-300 transition-colors">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white group-hover:text-sky-200 flex items-center gap-1.5">
                            <span>{item.name}</span>
                            {item.district && item.name !== item.district && (
                              <span className="text-[10px] bg-sky-500/20 text-sky-200 border border-sky-400/30 px-1.5 py-0.2 rounded-full">
                                {item.district}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-white/60">
                            {[item.admin1, item.country].filter(Boolean).join(', ')}
                          </div>
                        </div>
                      </div>
                      {isCurrent ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> {t.currentSelected}
                        </span>
                      ) : (
                        <span className="text-xs text-white/40 group-hover:text-white/80">
                          {t.select}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : hasSearched ? (
            <div className="text-center py-8 text-white/60">
              <p className="text-sm">{t.noCityFound}</p>
              <p className="text-xs text-white/40 mt-1">{t.tryDifferentQuery}</p>
            </div>
          ) : (
            <div>
              <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2.5 px-1">
                {t.popularCitiesRecommend}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {POPULAR_CITIES.map((popCity) => (
                  <button
                    key={popCity.id}
                    onClick={() => {
                      onSelectCity(popCity);
                      onClose();
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition-all hover:border-sky-400/40 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                    <div className="truncate">
                      <div className="text-xs font-medium text-white truncate">
                        {popCity.name}
                      </div>
                      <div className="text-[10px] text-white/50 truncate">
                        {popCity.country}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
