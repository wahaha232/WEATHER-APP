import React from 'react';
import {
  Sun,
  SunMedium,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  Snowflake,
  CloudLightning,
  Moon,
  CloudMoon,
} from 'lucide-react';

interface WeatherIconProps {
  code: number;
  isDay?: number;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  code,
  isDay = 1,
  className = 'w-8 h-8',
  size,
}) => {
  const isNight = isDay === 0;

  // Render night-specific icons for clear and partly cloudy
  if (isNight) {
    if (code === 0) {
      return (
        <Moon
          id="weather-icon-moon"
          size={size}
          className={`${className} text-indigo-200 drop-shadow-[0_0_8px_rgba(199,210,254,0.6)]`}
        />
      );
    }
    if (code === 1 || code === 2) {
      return (
        <CloudMoon
          id="weather-icon-cloud-moon"
          size={size}
          className={`${className} text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.5)]`}
        />
      );
    }
  }

  // WMO Code mapping
  switch (code) {
    case 0:
      return (
        <Sun
          id="weather-icon-sun"
          size={size}
          className={`${className} text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.7)] animate-[spin_24s_linear_infinite]`}
        />
      );
    case 1:
      return (
        <SunMedium
          id="weather-icon-sun-med"
          size={size}
          className={`${className} text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.6)]`}
        />
      );
    case 2:
      return (
        <CloudSun
          id="weather-icon-cloud-sun"
          size={size}
          className={`${className} text-sky-200 drop-shadow-[0_0_8px_rgba(186,230,253,0.5)]`}
        />
      );
    case 3:
      return (
        <Cloud
          id="weather-icon-cloud"
          size={size}
          className={`${className} text-slate-300 drop-shadow-[0_0_6px_rgba(203,213,225,0.4)]`}
        />
      );
    case 45:
    case 48:
      return (
        <CloudFog
          id="weather-icon-fog"
          size={size}
          className={`${className} text-stone-300 drop-shadow-[0_0_6px_rgba(214,211,209,0.4)]`}
        />
      );
    case 51:
    case 53:
    case 55:
    case 80:
      return (
        <CloudDrizzle
          id="weather-icon-drizzle"
          size={size}
          className={`${className} text-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,0.5)]`}
        />
      );
    case 61:
    case 63:
    case 65:
    case 81:
    case 82:
      return (
        <CloudRain
          id="weather-icon-rain"
          size={size}
          className={`${className} text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]`}
        />
      );
    case 71:
    case 73:
    case 75:
    case 85:
    case 86:
      return (
        <CloudSnow
          id="weather-icon-snow"
          size={size}
          className={`${className} text-sky-200 drop-shadow-[0_0_10px_rgba(186,230,253,0.7)]`}
        />
      );
    case 77:
      return (
        <Snowflake
          id="weather-icon-snowflake"
          size={size}
          className={`${className} text-cyan-200 drop-shadow-[0_0_8px_rgba(165,243,252,0.6)]`}
        />
      );
    case 95:
    case 96:
    case 99:
      return (
        <CloudLightning
          id="weather-icon-lightning"
          size={size}
          className={`${className} text-purple-300 drop-shadow-[0_0_12px_rgba(216,180,254,0.8)]`}
        />
      );
    default:
      return (
        <Cloud
          id="weather-icon-default"
          size={size}
          className={`${className} text-slate-300`}
        />
      );
  }
};
