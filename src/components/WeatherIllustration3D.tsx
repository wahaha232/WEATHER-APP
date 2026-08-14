import React from 'react';

interface WeatherIllustration3DProps {
  code: number;
  isDay?: number;
  className?: string;
  size?: number;
}

export const WeatherIllustration3D: React.FC<WeatherIllustration3DProps> = ({
  code,
  isDay = 1,
  className = 'w-28 h-28',
  size = 120,
}) => {
  const isNight = isDay === 0;

  // Render 3D SVG Illustrations matching the exact archetype in the user's reference image
  // 1. Thunderstorm / Lightning (WMO 95, 96, 99)
  if (code === 95 || code === 96 || code === 99) {
    return (
      <div
        className={`relative flex items-center justify-center select-none ${className}`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full drop-shadow-2xl overflow-visible"
        >
          <defs>
            {/* Front Cloud Gradient */}
            <linearGradient id="cloudFrontGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#255588" />
              <stop offset="60%" stopColor="#183E6A" />
              <stop offset="100%" stopColor="#0F2B4D" />
            </linearGradient>

            {/* Back Cloud Gradient */}
            <linearGradient id="cloudBackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F0F6FC" />
              <stop offset="40%" stopColor="#D2E3F5" />
              <stop offset="100%" stopColor="#98B8DB" />
            </linearGradient>

            {/* Dark Storm Shadow Gradient */}
            <linearGradient id="stormDepthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E4774" />
              <stop offset="100%" stopColor="#0B203B" />
            </linearGradient>

            {/* 3D Lightning Bolt Gradient */}
            <linearGradient id="lightning3DGrad" x1="15%" y1="0%" x2="85%" y2="100%">
              <stop offset="0%" stopColor="#FFF275" />
              <stop offset="40%" stopColor="#FFD000" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            <linearGradient id="lightningBevelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFE066" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0.9" />
            </linearGradient>

            {/* Rain Streak Gradient */}
            <linearGradient id="rainStreakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.1" />
            </linearGradient>

            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="lightningGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Ambient Circle Depth */}
          <circle cx="100" cy="80" r="55" fill="#0A2649" fillOpacity="0.5" />

          {/* Back White/Light Cloud Bubble */}
          <g transform="translate(18, -4)">
            <circle cx="108" cy="58" r="32" fill="url(#cloudBackGrad)" />
            <circle cx="85" cy="68" r="24" fill="url(#cloudBackGrad)" />
            <circle cx="125" cy="74" r="22" fill="url(#cloudBackGrad)" />
          </g>

          {/* Rain Streaks on background */}
          <line
            x1="55"
            y1="82"
            x2="35"
            y2="118"
            stroke="url(#rainStreakGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line
            x1="72"
            y1="75"
            x2="52"
            y2="122"
            stroke="url(#rainStreakGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line
            x1="92"
            y1="88"
            x2="78"
            y2="128"
            stroke="url(#rainStreakGrad)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Main Dark 3D Storm Cloud */}
          <g filter="url(#softGlow)">
            {/* Base cloud spheres */}
            <circle cx="56" cy="56" r="34" fill="url(#cloudFrontGrad)" />
            <circle cx="34" cy="74" r="26" fill="url(#stormDepthGrad)" />
            <circle cx="82" cy="72" r="30" fill="url(#cloudFrontGrad)" />
            <ellipse cx="58" cy="80" rx="38" ry="18" fill="url(#stormDepthGrad)" />
          </g>

          {/* Cloud Specular Highlight Arc */}
          <path
            d="M 38 42 A 28 28 0 0 1 74 38"
            stroke="#6BA4E0"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />

          {/* Popping 3D Golden Yellow Lightning Bolt */}
          <g filter="url(#lightningGlow)" transform="translate(2, 4)">
            {/* Lightning Drop Shadow */}
            <path
              d="M 92 34 L 56 86 L 82 86 L 62 134 L 110 74 L 84 74 Z"
              fill="#9A3412"
              opacity="0.35"
              transform="translate(2, 3)"
            />
            {/* Lightning Main Body */}
            <path
              d="M 90 32 L 54 84 L 80 84 L 60 132 L 108 72 L 82 72 Z"
              fill="url(#lightning3DGrad)"
            />
            {/* Lightning Bevel Edge (Top/Left highlight) */}
            <path
              d="M 90 32 L 54 84 L 80 84 L 75 88 L 57 88 L 90 35 Z"
              fill="#FFFBEB"
              opacity="0.75"
            />
            {/* Center Energy Line */}
            <path
              d="M 86 40 L 59 82 L 78 82 L 67 115"
              stroke="#FEF3C7"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
          </g>
        </svg>
      </div>
    );
  }

  // 2. Sunny / Clear Day (WMO 0, 1)
  if (!isNight && (code === 0 || code === 1)) {
    return (
      <div
        className={`relative flex items-center justify-center select-none ${className}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-2xl overflow-visible">
          <defs>
            <linearGradient id="sun3DGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF7A1" />
              <stop offset="35%" stopColor="#FBBF24" />
              <stop offset="85%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
            <linearGradient id="sunRayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.2" />
            </linearGradient>
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ambient Glow */}
          <circle cx="80" cy="80" r="70" fill="url(#sunGlow)" />

          {/* Rotating Solar Flare Beams */}
          <g className="animate-[spin_30s_linear_infinite]" style={{ transformOrigin: '80px 80px' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <rect
                key={i}
                x="76"
                y="16"
                width="8"
                height="16"
                rx="4"
                fill="url(#sunRayGrad)"
                transform={`rotate(${i * 45} 80 80)`}
              />
            ))}
          </g>

          {/* 3D Sun Sphere */}
          <circle cx="80" cy="80" r="42" fill="url(#sun3DGrad)" />
          {/* 3D Specular Highlight */}
          <circle cx="68" cy="68" r="14" fill="#FFFFFF" fillOpacity="0.4" />
        </svg>
      </div>
    );
  }

  // 3. Clear Night (WMO 0, 1 Night)
  if (isNight && (code === 0 || code === 1)) {
    return (
      <div
        className={`relative flex items-center justify-center select-none ${className}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-2xl overflow-visible">
          <defs>
            <linearGradient id="moon3DGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#E0E7FF" />
              <stop offset="90%" stopColor="#A5B4FC" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
            <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#818CF8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Glow */}
          <circle cx="75" cy="80" r="65" fill="url(#moonGlow)" />

          {/* Stars */}
          <circle cx="120" cy="45" r="2.5" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: '3s' }} />
          <circle cx="132" cy="78" r="2" fill="#E0E7FF" className="animate-pulse" />
          <circle cx="40" cy="40" r="1.8" fill="#FFFFFF" />

          {/* 3D Crescent Moon */}
          <path
            d="M 96 35 C 65 38 42 66 45 98 C 47 122 66 140 92 142 C 68 132 58 106 66 84 C 73 64 88 46 112 40 C 107 36 102 35 96 35 Z"
            fill="url(#moon3DGrad)"
          />
        </svg>
      </div>
    );
  }

  // 4. Partly Cloudy / Sun Behind Cloud (WMO 2)
  if (code === 2) {
    return (
      <div
        className={`relative flex items-center justify-center select-none ${className}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-2xl overflow-visible">
          <defs>
            <linearGradient id="cloudWhiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
            <linearGradient id="sunPartlyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF275" />
              <stop offset="70%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>

          {/* Background Sun Sphere */}
          <circle cx="106" cy="54" r="30" fill="url(#sunPartlyGrad)" />
          <circle cx="98" cy="46" r="9" fill="#FFFFFF" fillOpacity="0.5" />

          {/* 3D Front Cloud */}
          <g>
            <circle cx="56" cy="88" r="32" fill="url(#cloudWhiteGrad)" />
            <circle cx="86" cy="94" r="26" fill="url(#cloudWhiteGrad)" />
            <circle cx="34" cy="100" r="22" fill="url(#cloudWhiteGrad)" />
            <ellipse cx="60" cy="108" rx="40" ry="16" fill="url(#cloudWhiteGrad)" />
          </g>
        </svg>
      </div>
    );
  }

  // 5. Rain / Showers / Drizzle (WMO 51, 53, 55, 61, 63, 65, 80, 81, 82)
  if (
    code === 51 ||
    code === 53 ||
    code === 55 ||
    code === 61 ||
    code === 63 ||
    code === 65 ||
    code === 80 ||
    code === 81 ||
    code === 82
  ) {
    return (
      <div
        className={`relative flex items-center justify-center select-none ${className}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-2xl overflow-visible">
          <defs>
            <linearGradient id="rainCloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="50%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="dropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>

          {/* 3D Cloud */}
          <g>
            <circle cx="68" cy="62" r="34" fill="url(#rainCloudGrad)" />
            <circle cx="102" cy="74" r="28" fill="url(#rainCloudGrad)" />
            <circle cx="40" cy="80" r="24" fill="url(#rainCloudGrad)" />
            <ellipse cx="72" cy="88" rx="42" ry="18" fill="url(#rainCloudGrad)" />
          </g>

          {/* 3D Rain Drops */}
          <g transform="translate(0, 10)">
            <ellipse cx="46" cy="118" rx="3.5" ry="8" transform="rotate(-20 46 118)" fill="url(#dropGrad)" />
            <ellipse cx="72" cy="124" rx="4" ry="9" transform="rotate(-20 72 124)" fill="url(#dropGrad)" />
            <ellipse cx="98" cy="116" rx="3.5" ry="8" transform="rotate(-20 98 116)" fill="url(#dropGrad)" />
            <ellipse cx="60" cy="138" rx="3" ry="7" transform="rotate(-20 60 138)" fill="url(#dropGrad)" />
            <ellipse cx="86" cy="140" rx="3" ry="7" transform="rotate(-20 86 140)" fill="url(#dropGrad)" />
          </g>
        </svg>
      </div>
    );
  }

  // 6. Snow (WMO 71, 73, 75, 77, 85, 86)
  if (code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86) {
    return (
      <div
        className={`relative flex items-center justify-center select-none ${className}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-2xl overflow-visible">
          <defs>
            <linearGradient id="snowCloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#7DD3FC" />
            </linearGradient>
          </defs>

          {/* 3D Cloud */}
          <g>
            <circle cx="68" cy="62" r="34" fill="url(#snowCloudGrad)" />
            <circle cx="102" cy="74" r="28" fill="url(#snowCloudGrad)" />
            <circle cx="40" cy="80" r="24" fill="url(#snowCloudGrad)" />
            <ellipse cx="72" cy="88" rx="42" ry="18" fill="url(#snowCloudGrad)" />
          </g>

          {/* 3D Snowflakes */}
          <g fill="#E0F2FE">
            <circle cx="50" cy="120" r="5" fill="#BAE6FD" />
            <circle cx="76" cy="128" r="6" fill="#FFFFFF" />
            <circle cx="104" cy="122" r="5" fill="#BAE6FD" />
            <circle cx="62" cy="142" r="4" fill="#FFFFFF" />
            <circle cx="90" cy="144" r="4.5" fill="#BAE6FD" />
          </g>
        </svg>
      </div>
    );
  }

  // 7. Default / Cloudy / Overcast (WMO 3, 45, 48)
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-2xl overflow-visible">
        <defs>
          <linearGradient id="defaultCloudBack" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="50%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
          <linearGradient id="defaultCloudFront" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
        </defs>

        {/* Back Cloud */}
        <g transform="translate(18, -8)">
          <circle cx="82" cy="62" r="28" fill="url(#defaultCloudBack)" />
          <circle cx="108" cy="72" r="24" fill="url(#defaultCloudBack)" />
        </g>

        {/* Front Cloud */}
        <g>
          <circle cx="58" cy="74" r="34" fill="url(#defaultCloudFront)" />
          <circle cx="94" cy="84" r="28" fill="url(#defaultCloudFront)" />
          <circle cx="32" cy="90" r="22" fill="url(#defaultCloudFront)" />
          <ellipse cx="64" cy="98" rx="42" ry="18" fill="url(#defaultCloudFront)" />
        </g>
      </svg>
    </div>
  );
};
