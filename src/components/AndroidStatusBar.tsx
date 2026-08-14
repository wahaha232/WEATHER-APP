import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export const AndroidStatusBar: React.FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="android-status-bar"
      className="w-full h-8 px-4 flex items-center justify-between text-white/90 text-xs select-none z-30 font-medium"
    >
      {/* Clock Time */}
      <span className="font-semibold tracking-tight">{time || '12:00'}</span>

      {/* Front Camera Hole Simulation */}
      <div className="w-3.5 h-3.5 rounded-full bg-black/80 border border-white/20 shadow-inner flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-950/80" />
      </div>

      {/* Status Icons */}
      <div className="flex items-center gap-1.5">
        <Signal className="w-3.5 h-3.5 text-white/90" />
        <Wifi className="w-3.5 h-3.5 text-white/90" />
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] text-white/80">98%</span>
          <BatteryMedium className="w-3.5 h-3.5 text-white/90" />
        </div>
      </div>
    </div>
  );
};
