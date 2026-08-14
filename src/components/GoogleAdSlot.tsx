import React from 'react';
import { Info, ExternalLink } from 'lucide-react';
import { AppLanguage, TRANSLATIONS } from '../services/i18n';

interface GoogleAdSlotProps {
  type?: 'banner' | 'medium-rectangle' | 'native';
  className?: string;
  adUnitId?: string;
  isTestMode?: boolean;
  lang?: AppLanguage;
}

export const GoogleAdSlot: React.FC<GoogleAdSlotProps> = ({
  type = 'banner',
  className = '',
  adUnitId = 'ca-app-pub-1512317781873771/6879519480', // 使用者配置的 Google AdMob 橫幅廣告單元 ID
  isTestMode = false,
  lang = 'zh',
}) => {
  const t = TRANSLATIONS[lang];

  if (type === 'banner') {
    return (
      <div
        id="google-admob-banner-slot"
        className={`w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900/80 via-zinc-800/60 to-zinc-900/80 border border-white/10 backdrop-blur-md p-3 text-center transition-all hover:border-amber-500/30 ${className}`}
      >
        {/* Ad Tag Badge */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold tracking-wider uppercase">
              {t.adMobBanner}
            </span>
            {isTestMode && (
              <span className="text-[10px] text-white/40">
                (Test Ready)
              </span>
            )}
          </div>
          <span className="text-[10px] text-white/40 flex items-center gap-0.5">
            <Info className="w-3 h-3" />
            {t.adUnitReserved}
          </span>
        </div>

        {/* Ad Content Container (Simulating Adaptive Banner 320x50 / Responsive Banner) */}
        <div className="h-14 sm:h-16 w-full rounded-xl bg-black/40 border border-dashed border-white/20 flex items-center justify-between px-3.5 py-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm font-black text-sm">
              G
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-white/90 truncate max-w-[170px] sm:max-w-[240px]">
                Google AdMob Banner Slot
              </p>
              <p className="text-[11px] text-white/50 truncate max-w-[170px] sm:max-w-[240px]">
                {t.adLoadingPrompt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 text-xs px-2.5 py-1 rounded-lg transition-colors cursor-pointer">
            <span className="text-[11px] font-medium">{t.view}</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>

        <div className="mt-1.5 flex justify-between items-center text-[9px] text-white/40 px-1">
          <span>Ad Unit ID: <code className="text-white/60">{adUnitId}</code></span>
          <span>Adaptive Banner (320x50)</span>
        </div>
      </div>
    );
  }

  // Medium Rectangle Ad (300x250)
  return (
    <div
      id="google-admob-mrec-slot"
      className={`w-full relative overflow-hidden rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-md p-4 text-center ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold tracking-wider uppercase">
          {t.adMobNative}
        </span>
        <span className="text-[10px] text-white/40">300x250 MREC</span>
      </div>

      <div className="h-44 w-full rounded-xl bg-black/40 border border-dashed border-white/20 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg mb-2">
          Ad
        </div>
        <p className="text-xs font-medium text-white/80">{t.adMobNative}</p>
        <p className="text-[11px] text-white/40 mt-1 max-w-xs text-center">
          <code>AdView</code> with <code>AdSize.MEDIUM_RECTANGLE</code>
        </p>
      </div>
    </div>
  );
};
