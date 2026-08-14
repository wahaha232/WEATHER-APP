import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';
import { formatLocalTime, resolveTimezone } from '../services/timeService';

interface AndroidStatusBarProps {
  timeFormat?: '12h' | '24h';
  timezone?: string;
  theme?: 'dark' | 'light';
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({
  timeFormat = '24h',
  timezone,
  theme = 'dark',
}) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const tz = resolveTimezone(timezone);
      const formatted = formatLocalTime(now, tz, timeFormat === '12h');
      setTime(formatted.timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 5000);
    return () => clearInterval(interval);
  }, [timeFormat, timezone]);

  const isLight = theme === 'light';

  return (
    <div
      id="android-status-bar"
      className={`w-full h-8 px-4 flex items-center justify-between text-xs select-none z-30 font-medium transition-colors ${
        isLight ? 'text-slate-800' : 'text-white/90'
      }`}
    >
      {/* Clock Time with user-defined 12/24h format */}
      <span className="font-semibold tracking-tight">{time || '12:00'}</span>

      {/* Front Camera Hole Simulation */}
      <div className={`w-3.5 h-3.5 rounded-full bg-black/80 border flex items-center justify-center ${
        isLight ? 'border-black/20' : 'border-white/20'
      }`}>
        <div className="w-1.5 h-1.5 rounded-full bg-blue-950/80" />
      </div>

      {/* Status Icons */}
      <div className="flex items-center gap-1.5">
        <Signal className={`w-3.5 h-3.5 ${isLight ? 'text-slate-800' : 'text-white/90'}`} />
        <Wifi className={`w-3.5 h-3.5 ${isLight ? 'text-slate-800' : 'text-white/90'}`} />
        <div className="flex items-center gap-0.5">
          <span className={`text-[10px] ${isLight ? 'text-slate-700' : 'text-white/80'}`}>98%</span>
          <BatteryMedium className={`w-3.5 h-3.5 ${isLight ? 'text-slate-800' : 'text-white/90'}`} />
        </div>
      </div>
    </div>
  );
};
