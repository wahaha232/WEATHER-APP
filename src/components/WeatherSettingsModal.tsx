import React from 'react';
import {
  Settings,
  X,
  Thermometer,
  Wind,
  Languages,
  Smartphone,
  Info,
  Check,
  Clock,
  LayoutGrid,
} from 'lucide-react';
import { WeatherSettings } from '../types';
import { TRANSLATIONS } from '../services/i18n';

interface WeatherSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WeatherSettings;
  onUpdateSettings: (newSettings: Partial<WeatherSettings>) => void;
  onOpenWidgets?: () => void;
}

export const WeatherSettingsModal: React.FC<WeatherSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenWidgets,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[settings.language || 'zh'];
  const REFRESH_INTERVALS = [5, 10, 15, 20, 25, 30];

  return (
    <div
      id="weather-settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="weather-settings-modal-container"
        className="w-full max-w-md bg-zinc-900/95 border border-white/20 rounded-3xl p-5 shadow-2xl text-white flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-semibold">{t.settingsTitle}</h2>
          </div>
          <button
            id="btn-close-settings-modal"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="flex-1 overflow-y-auto space-y-4 my-4 no-scrollbar pr-1">
          {/* Auto Refresh Interval Options: 5 / 10 / 15 / 20 / 25 / 30 mins */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{t.autoRefreshLabel}</span>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                {settings.autoRefreshIntervalMinutes || 15} {t.minuteUnit}
              </span>
            </div>
            <p className="text-[11px] text-white/50 mb-3">
              {t.autoRefreshDesc}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {REFRESH_INTERVALS.map((mins) => {
                const isSelected = (settings.autoRefreshIntervalMinutes || 15) === mins;
                return (
                  <button
                    key={mins}
                    id={`btn-refresh-interval-${mins}`}
                    onClick={() =>
                      onUpdateSettings({ autoRefreshIntervalMinutes: mins })
                    }
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-md font-bold'
                        : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-zinc-950" />}
                    <span>{mins} {t.minuteUnit}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Home Screen Widgets Entry */}
          {onOpenWidgets && (
            <div className="bg-gradient-to-r from-sky-950/60 to-indigo-950/60 p-4 rounded-2xl border border-sky-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {t.widgetCenterTitle}
                  </div>
                  <div className="text-[11px] text-white/60">
                    4x2, 4x1, 2x2 & Glance
                  </div>
                </div>
              </div>
              <button
                id="btn-open-widget-from-settings"
                onClick={() => {
                  onClose();
                  onOpenWidgets();
                }}
                className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-white text-xs font-bold transition-all shadow cursor-pointer"
              >
                {settings.language === 'zh' ? '自訂小工具' : 'Customize'}
              </button>
            </div>
          )}

          {/* Language Switcher */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-sm font-medium mb-3 text-white">
              <Languages className="w-4 h-4 text-sky-300" />
              <span>{t.languageLabel}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-set-lang-zh"
                onClick={() => onUpdateSettings({ language: 'zh' })}
                className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  settings.language === 'zh'
                    ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                }`}
              >
                {settings.language === 'zh' && <Check className="w-3.5 h-3.5" />}
                <span>{t.langZh}</span>
              </button>
              <button
                id="btn-set-lang-en"
                onClick={() => onUpdateSettings({ language: 'en' })}
                className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  settings.language === 'en'
                    ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                }`}
              >
                {settings.language === 'en' && <Check className="w-3.5 h-3.5" />}
                <span>{t.langEn}</span>
              </button>
            </div>
          </div>

          {/* Temperature Unit */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-sm font-medium mb-3 text-white">
              <Thermometer className="w-4 h-4 text-amber-300" />
              <span>{t.tempUnitLabel}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-unit-celsius"
                onClick={() => onUpdateSettings({ tempUnit: 'celsius' })}
                className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  settings.tempUnit === 'celsius'
                    ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                }`}
              >
                {settings.tempUnit === 'celsius' && <Check className="w-3.5 h-3.5" />}
                <span>{t.celsius}</span>
              </button>
              <button
                id="btn-unit-fahrenheit"
                onClick={() => onUpdateSettings({ tempUnit: 'fahrenheit' })}
                className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  settings.tempUnit === 'fahrenheit'
                    ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                }`}
              >
                {settings.tempUnit === 'fahrenheit' && <Check className="w-3.5 h-3.5" />}
                <span>{t.fahrenheit}</span>
              </button>
            </div>
          </div>

          {/* Wind Speed Unit */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-sm font-medium mb-3 text-white">
              <Wind className="w-4 h-4 text-teal-300" />
              <span>{t.windUnitLabel}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'kmh', label: 'km/h' },
                { id: 'ms', label: 'm/s' },
                { id: 'mph', label: 'mph' },
              ].map((unit) => (
                <button
                  key={unit.id}
                  id={`btn-wind-unit-${unit.id}`}
                  onClick={() =>
                    onUpdateSettings({
                      windSpeedUnit: unit.id as 'kmh' | 'ms' | 'mph',
                    })
                  }
                  className={`py-2 px-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    settings.windSpeedUnit === unit.id
                      ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                      : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {settings.windSpeedUnit === unit.id && (
                    <Check className="w-3 h-3" />
                  )}
                  <span>{unit.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Phone Frame Mode Toggle */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-emerald-300" />
              <div>
                <div className="text-sm font-medium text-white">
                  {t.phoneFrameModeLabel}
                </div>
                <div className="text-[11px] text-white/50 mt-0.5">
                  {t.phoneFrameModeDesc}
                </div>
              </div>
            </div>
            <button
              id="btn-toggle-phone-frame"
              onClick={() =>
                onUpdateSettings({ phoneFrameMode: !settings.phoneFrameMode })
              }
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.phoneFrameMode ? 'bg-emerald-500' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  settings.phoneFrameMode ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* About & API info */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-xs text-white/70 space-y-2">
            <div className="flex items-center gap-2 font-medium text-white">
              <Info className="w-4 h-4 text-sky-400" />
              <span>{t.techInfoTitle}</span>
            </div>
            <p className="leading-relaxed text-white/60">
              {t.techInfoDesc}
            </p>
          </div>
        </div>

        <button
          id="btn-finish-settings"
          onClick={onClose}
          className="w-full py-3 bg-sky-500 hover:bg-sky-600 active:scale-98 rounded-2xl font-medium text-sm text-white transition-all shadow-md mt-2 cursor-pointer"
        >
          {t.finishSettings}
        </button>
      </div>
    </div>
  );
};
