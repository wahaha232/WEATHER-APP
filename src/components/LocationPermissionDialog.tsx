import React from 'react';
import { MapPin, ShieldCheck, Navigation } from 'lucide-react';
import { AppLanguage, TRANSLATIONS } from '../services/i18n';

interface LocationPermissionDialogProps {
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
  lang?: AppLanguage;
}

export const LocationPermissionDialog: React.FC<LocationPermissionDialogProps> = ({
  isOpen,
  onAllow,
  onDeny,
  lang = 'zh',
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[lang];

  return (
    <div
      id="android-location-permission-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
    >
      {/* Android 14 / Material You Native Permission Dialog Style */}
      <div className="w-full max-w-sm rounded-[28px] bg-[#1E222B] text-white border border-white/10 p-6 shadow-2xl animate-scale-up">
        {/* Top Icon & Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 ring-8 ring-blue-500/10">
            <Navigation className="w-7 h-7 text-blue-400 animate-pulse" />
          </div>

          <h3 className="text-xl font-bold tracking-tight text-white mb-2">
            {t.locationPermissionTitle}
          </h3>

          <p className="text-sm text-zinc-300 leading-relaxed mb-6">
            {t.locationPermissionDesc}
          </p>
        </div>

        {/* Permission Details */}
        <div className="bg-white/5 rounded-2xl p-3.5 mb-6 border border-white/5 space-y-2">
          <div className="flex items-center gap-2.5 text-xs text-zinc-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{t.permissionPreciseLocation}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-zinc-300">
            <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>{t.permissionWhileUsing}</span>
          </div>
        </div>

        {/* Android Material 3 Style Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            id="btn-permission-allow-precise"
            onClick={onAllow}
            className="w-full py-3.5 px-5 rounded-full bg-blue-500 hover:bg-blue-400 active:bg-blue-600 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t.allowWhileUsing}</span>
          </button>

          <button
            id="btn-permission-deny"
            onClick={onDeny}
            className="w-full py-3 px-5 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/15 text-zinc-400 hover:text-white font-medium text-sm transition-colors cursor-pointer"
          >
            {t.denyPermission}
          </button>
        </div>
      </div>
    </div>
  );
};
