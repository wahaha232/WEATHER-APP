import React from 'react';
import {
  MapPin,
  Plus,
  Trash2,
  X,
  Navigation,
  Check,
  Building,
} from 'lucide-react';
import { SavedCity, WeatherSettings } from '../types';
import { TRANSLATIONS } from '../services/i18n';

interface CityManagerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedCities: SavedCity[];
  currentCityId: string | number;
  onSelectCity: (city: SavedCity) => void;
  onRemoveCity: (id: string) => void;
  onOpenSearch: () => void;
  settings: WeatherSettings;
}

export const CityManagerDrawer: React.FC<CityManagerDrawerProps> = ({
  isOpen,
  onClose,
  savedCities,
  currentCityId,
  onSelectCity,
  onRemoveCity,
  onOpenSearch,
  settings,
}) => {
  if (!isOpen) return null;

  const lang = settings.language || 'zh';
  const t = TRANSLATIONS[lang];

  return (
    <div
      id="city-manager-drawer-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="city-manager-drawer-container"
        className="w-full max-w-md bg-zinc-900/95 border border-white/20 rounded-3xl p-5 shadow-2xl text-white flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-semibold">{t.cityDrawerTitle}</h2>
          </div>
          <button
            id="btn-close-city-drawer"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add City Button */}
        <div className="my-3">
          <button
            id="btn-add-city-from-drawer"
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-sky-500 hover:bg-sky-600 active:scale-98 font-medium text-sm text-white shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addNewCity}</span>
          </button>
        </div>

        {/* Cities List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 no-scrollbar my-1">
          {savedCities.map((c) => {
            const isSelected = String(c.id) === String(currentCityId);

            return (
              <div
                key={c.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-sky-500/20 border-sky-400/40 shadow-sm'
                    : 'bg-white/5 hover:bg-white/10 border-white/10'
                }`}
              >
                <button
                  onClick={() => {
                    onSelectCity(c);
                    onClose();
                  }}
                  className="flex items-center gap-3 flex-1 text-left cursor-pointer"
                >
                  <div
                    className={`p-2 rounded-xl ${
                      c.isGps
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-white/10 text-sky-300'
                    }`}
                  >
                    {c.isGps ? (
                      <Navigation className="w-4 h-4 rotate-45" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-white">{c.name}</span>
                      {c.district && c.name !== c.district && (
                        <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded-full font-medium">
                          {c.district}
                        </span>
                      )}
                      {c.isGps && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded-full font-medium">
                          {t.locateGpsBadge}
                        </span>
                      )}
                      {isSelected && (
                        <span className="text-[10px] bg-sky-500/30 text-sky-200 border border-sky-400/30 px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5" /> {t.displayingBadge}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-white/50 mt-0.5">
                      {[c.admin1, c.country].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </button>

                {/* Delete button (prevent deleting if only 1 city) */}
                {savedCities.length > 1 && (
                  <button
                    onClick={() => onRemoveCity(c.id)}
                    className="p-2 rounded-xl text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-2 cursor-pointer"
                    title={t.removeCityTooltip}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-white/10 text-xs text-center text-white/40">
          {t.autoSavePreferenceTip}
        </div>
      </div>
    </div>
  );
};
