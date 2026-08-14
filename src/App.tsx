import React, { useState, useEffect, useCallback } from 'react';
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  Smartphone,
  Languages,
} from 'lucide-react';
import {
  FullWeatherResponse,
  GeocodingResult,
  SavedCity,
  WeatherSettings,
} from './types';
import {
  fetchFullWeatherData,
  POPULAR_CITIES,
  reverseGeocode,
} from './services/weatherService';
import { TRANSLATIONS } from './services/i18n';
import { WeatherAtmosphere } from './components/WeatherAtmosphere';
import { CurrentWeatherHero } from './components/CurrentWeatherHero';
import { HourlyForecastCard } from './components/HourlyForecastCard';
import { DailyForecastCard } from './components/DailyForecastCard';
import { WeatherMetricsGrid } from './components/WeatherMetricsGrid';
import { CitySearchModal } from './components/CitySearchModal';
import { CityManagerDrawer } from './components/CityManagerDrawer';
import { AndroidProjectExportModal } from './components/AndroidProjectExportModal';
import { WeatherSettingsModal } from './components/WeatherSettingsModal';
import { WeatherWidgetModal } from './components/WeatherWidgetModal';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { AndroidNavBar } from './components/AndroidNavBar';
import { GoogleAdSlot } from './components/GoogleAdSlot';
import { LocationPermissionDialog } from './components/LocationPermissionDialog';

const STORAGE_KEY_CITIES = 'weather_app_saved_cities_v2';
const STORAGE_KEY_SETTINGS = 'weather_app_settings_v2';
const STORAGE_KEY_CURRENT_CITY = 'weather_app_current_city_id_v2';
const STORAGE_KEY_PERMISSION_PROMPTED = 'weather_app_location_permission_prompted_v2';

const DEFAULT_SAVED_CITIES: SavedCity[] = [
  {
    id: '1668341',
    name: '台北市信義區',
    district: '信義區',
    admin1: '台灣',
    country: '台灣',
    latitude: 25.033,
    longitude: 121.5654,
  },
  {
    id: '5128581',
    name: '紐約市皇后區',
    district: '皇后區 (Queens)',
    admin1: 'New York',
    country: '美國',
    latitude: 40.7282,
    longitude: -73.7949,
  },
  {
    id: '1850147',
    name: '東京新宿區',
    district: '新宿區 (Shinjuku)',
    admin1: '東京都',
    country: '日本',
    latitude: 35.6938,
    longitude: 139.7034,
  },
];

const DEFAULT_SETTINGS: WeatherSettings = {
  tempUnit: 'celsius',
  windSpeedUnit: 'kmh',
  pressureUnit: 'hPa',
  phoneFrameMode: true,
  autoRefreshIntervalMinutes: 30,
  language: 'zh',
};

export default function App() {
  // 1. App settings state
  const [settings, setSettings] = useState<WeatherSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Failed reading settings', e);
    }
    return DEFAULT_SETTINGS;
  });

  const lang = settings.language || 'zh';
  const t = TRANSLATIONS[lang];

  // 2. Saved cities state
  const [savedCities, setSavedCities] = useState<SavedCity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CITIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed reading saved cities', e);
    }
    return DEFAULT_SAVED_CITIES;
  });

  // 3. Active city state
  const [currentCityId, setCurrentCityId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEY_CURRENT_CITY);
      if (savedId) return savedId;
    } catch (e) {
      console.warn('Failed reading current city id', e);
    }
    return DEFAULT_SAVED_CITIES[0].id;
  });

  // 4. Weather response state
  const [weatherData, setWeatherData] = useState<FullWeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocatingGps, setIsLocatingGps] = useState(false);

  // 5. Navigation & Modal states
  const [currentTab, setCurrentTab] = useState<'weather' | 'cities' | 'widget' | 'export' | 'settings'>('weather');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCityDrawerOpen, setIsCityDrawerOpen] = useState(false);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showLocationPermissionDialog, setShowLocationPermissionDialog] = useState(false);

  // Check if first launch needs location permission prompt
  useEffect(() => {
    try {
      const alreadyPrompted = localStorage.getItem(STORAGE_KEY_PERMISSION_PROMPTED);
      if (!alreadyPrompted) {
        // First install/launch: prompt user for device location permission
        setShowLocationPermissionDialog(true);
      }
    } catch (e) {
      console.warn('Failed checking permission prompted state', e);
    }
  }, []);

  // Persist saved cities to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CITIES, JSON.stringify(savedCities));
    } catch (e) {
      console.warn('Failed saving cities to localStorage', e);
    }
  }, [savedCities]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed saving settings to localStorage', e);
    }
  }, [settings]);

  // Persist current city id
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT_CITY, currentCityId);
    } catch (e) {
      console.warn('Failed saving current city id', e);
    }
  }, [currentCityId]);

  // Find active city
  const activeCity =
    savedCities.find((c) => String(c.id) === String(currentCityId)) ||
    savedCities[0] ||
    DEFAULT_SAVED_CITIES[0];

  const currentCityIndex = savedCities.findIndex(
    (c) => String(c.id) === String(currentCityId)
  );

  // Fetch Weather Data Function
  const loadWeather = useCallback(
    async (city: SavedCity, showLoadingIndicator = true) => {
      if (showLoadingIndicator) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      try {
        const geoResult: GeocodingResult = {
          id: Number(city.id) || Date.now(),
          name: city.name,
          district: city.district,
          admin1: city.admin1,
          country: city.country,
          latitude: city.latitude,
          longitude: city.longitude,
        };

        const res = await fetchFullWeatherData(geoResult, lang);
        setWeatherData(res);
      } catch (err: any) {
        console.error('Fetch weather error:', err);
        setError(err?.message || (lang === 'zh' ? '取得天氣預報資料失敗，請檢查網路連線後重試' : 'Failed to fetch weather forecast, please check network connection'));
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [lang]
  );

  // Load weather whenever active city changes or language toggles
  useEffect(() => {
    if (activeCity) {
      loadWeather(activeCity, !weatherData);
    }
  }, [activeCity.id, activeCity.latitude, activeCity.longitude, lang]);

  // Periodic Auto-Refresh Timer (5, 10, 15, 20, 25, 30 mins based on settings)
  useEffect(() => {
    const intervalMinutes = settings.autoRefreshIntervalMinutes || 15;
    const intervalMs = Math.max(5, intervalMinutes) * 60 * 1000;

    const timer = setInterval(() => {
      if (activeCity) {
        console.log(`[Weather Auto-Refresh] Updating weather for ${activeCity.name} (${intervalMinutes}m interval)...`);
        loadWeather(activeCity, false);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [activeCity, settings.autoRefreshIntervalMinutes, loadWeather]);

  // Manual refresh trigger
  const handleRefresh = useCallback(() => {
    if (activeCity) {
      loadWeather(activeCity, false);
    }
  }, [activeCity, loadWeather]);

  // Handle GPS location with ultra-precise reverse geocoding
  const handleGpsLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert(lang === 'zh' ? '您的瀏覽器不支援 GPS 地理定位' : 'Geolocation is not supported by your browser');
      return;
    }

    setIsLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const geo = await reverseGeocode(lat, lon, lang);

          const gpsCity: SavedCity = {
            id: `gps-${Math.round(lat * 1000)}-${Math.round(lon * 1000)}`,
            name: geo.name || (lang === 'zh' ? '我的目前位置' : 'Current Location'),
            district: geo.district,
            admin1: geo.admin1,
            country: geo.country,
            latitude: lat,
            longitude: lon,
            isGps: true,
          };

          // Add to saved cities if not exists, and set as active
          setSavedCities((prev) => {
            const filtered = prev.filter((c) => !c.isGps);
            return [gpsCity, ...filtered];
          });
          setCurrentCityId(gpsCity.id);
          setIsLocatingGps(false);
          loadWeather(gpsCity, true);
        } catch (e) {
          console.error('GPS reverse geocoding failed', e);
          setIsLocatingGps(false);
        }
      },
      (err) => {
        console.warn('Geolocation failed', err);
        setIsLocatingGps(false);
        alert(lang === 'zh' ? '無法取得您的精確定位，請確認已允許定位權限' : 'Unable to retrieve location, please ensure permission is granted');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [loadWeather, lang]);

  // Handlers for initial location permission prompt
  const handleAllowInitialLocation = () => {
    try {
      localStorage.setItem(STORAGE_KEY_PERMISSION_PROMPTED, 'granted');
    } catch (e) {
      console.warn(e);
    }
    setShowLocationPermissionDialog(false);
    // 立即觸發裝置 GPS 定位
    handleGpsLocation();
  };

  const handleDenyInitialLocation = () => {
    try {
      localStorage.setItem(STORAGE_KEY_PERMISSION_PROMPTED, 'denied');
    } catch (e) {
      console.warn(e);
    }
    setShowLocationPermissionDialog(false);
  };

  // Handle selecting city from Search or Drawer
  const handleSelectCity = (cityResult: GeocodingResult | SavedCity) => {
    const cityId = String(cityResult.id || Date.now());
    const existing = savedCities.find((c) => String(c.id) === cityId);

    if (existing) {
      setCurrentCityId(existing.id);
    } else {
      const newCity: SavedCity = {
        id: cityId,
        name: cityResult.name,
        district: cityResult.district,
        admin1: cityResult.admin1,
        country: cityResult.country,
        latitude: cityResult.latitude,
        longitude: cityResult.longitude,
      };
      setSavedCities((prev) => [newCity, ...prev]);
      setCurrentCityId(newCity.id);
    }
  };

  // Remove a city
  const handleRemoveCity = (id: string) => {
    setSavedCities((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      if (currentCityId === id && updated.length > 0) {
        setCurrentCityId(updated[0].id);
      }
      return updated;
    });
  };

  // 1-Click Language Switch Toggle
  const handleToggleLanguage = () => {
    const nextLang = lang === 'zh' ? 'en' : 'zh';
    setSettings((s) => ({ ...s, language: nextLang }));
  };

  // Tab click router
  const handleTabChange = (tab: 'weather' | 'cities' | 'search' | 'settings' | 'widget' | 'export') => {
    setCurrentTab(tab);
    if (tab === 'cities') {
      setIsCityDrawerOpen(true);
    } else if (tab === 'search') {
      setIsSearchOpen(true);
    } else if (tab === 'settings') {
      setIsSettingsOpen(true);
    } else if (tab === 'widget') {
      setIsWidgetModalOpen(true);
    } else if (tab === 'export') {
      setIsExportOpen(true);
    }
  };

  return (
    <div
      id="weather-app-root"
      className="min-h-screen w-full bg-zinc-950 flex items-center justify-center p-0 sm:p-4 md:p-6 select-none font-sans text-white overflow-x-hidden"
    >
      {/* Phone Frame Container or Full Screen Shell */}
      <div
        id="phone-frame-wrapper"
        className={`relative w-full transition-all duration-300 flex flex-col ${
          settings.phoneFrameMode
            ? 'max-w-md h-[100dvh] sm:h-[880px] sm:max-h-[92vh] sm:rounded-[44px] sm:border-[8px] sm:border-zinc-800 shadow-[0_25px_70px_rgba(0,0,0,0.8)] sm:ring-1 sm:ring-white/15 overflow-hidden'
            : 'max-w-3xl min-h-[100dvh] rounded-none sm:rounded-3xl border-0 sm:border sm:border-white/10 shadow-2xl overflow-hidden'
        }`}
      >
        {/* Android Status Bar */}
        <AndroidStatusBar />

        {/* Top Floating App Banner for Quick Actions */}
        <header className="px-4 py-2.5 flex items-center justify-between bg-black/25 backdrop-blur-md border-b border-white/10 z-20">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-white/90">
              {t.appTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Refresh Weather Button */}
            <button
              id="btn-header-refresh"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              title={lang === 'zh' ? '重新整理天氣' : 'Refresh Weather'}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
            </button>

            {/* Quick 1-Click Language Switch in header */}
            <button
              id="btn-header-lang-switch"
              onClick={handleToggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/90 text-xs font-medium transition-all active:scale-95 cursor-pointer"
              title={lang === 'zh' ? 'Switch to English' : '切換為繁體中文'}
            >
              <Languages className="w-3.5 h-3.5 text-sky-300" />
              <span>{lang === 'zh' ? 'EN' : '繁中'}</span>
            </button>

            {/* Frame mode quick toggle */}
            <button
              id="btn-toggle-frame-mode"
              onClick={() =>
                setSettings((s) => ({ ...s, phoneFrameMode: !s.phoneFrameMode }))
              }
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors cursor-pointer"
              title={settings.phoneFrameMode ? t.toggleWidescreen : t.togglePhoneFrame}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="relative flex-1 overflow-y-auto overflow-x-hidden no-scrollbar bg-slate-900">
          {isLoading && !weatherData ? (
            /* Loading State */
            <div
              id="weather-loading-view"
              className="h-full min-h-[500px] flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-sky-500/20 border border-sky-400/30 flex items-center justify-center animate-ping" />
                <Loader2 className="w-10 h-10 animate-spin text-sky-400 absolute inset-0 m-auto" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {t.connectingApi}
              </h3>
              <p className="text-xs text-white/60 max-w-xs">
                {t.loadingCityWeather(activeCity.name)}
              </p>
            </div>
          ) : error && !weatherData ? (
            /* Error State */
            <div
              id="weather-error-view"
              className="h-full min-h-[500px] flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="p-4 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 mb-4">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t.errorTitle}</h3>
              <p className="text-xs text-white/70 max-w-xs mb-6 leading-relaxed">
                {error}
              </p>
              <button
                id="btn-retry-weather"
                onClick={() => loadWeather(activeCity, true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-medium text-sm rounded-2xl shadow-lg transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{t.retryConnect}</span>
              </button>
            </div>
          ) : weatherData ? (
            /* Active Weather View with Atmosphere */
            <WeatherAtmosphere
              weatherCode={weatherData.current.weatherCode}
              isDay={weatherData.current.isDay}
            >
              <div className="px-3.5 sm:px-5 pb-6">
                {/* 1. Hero Current Weather */}
                <CurrentWeatherHero
                  data={weatherData}
                  settings={settings}
                  onOpenCityDrawer={() => setIsCityDrawerOpen(true)}
                  totalSavedCities={savedCities.length}
                  currentCityIndex={currentCityIndex >= 0 ? currentCityIndex : 0}
                />

                {/* 2. Google AdMob Banner Ad Slot (預留 Google 廣告橫幅版位) */}
                <div className="mb-4">
                  <GoogleAdSlot type="banner" lang={lang} />
                </div>

                {/* 3. 24-Hour Hourly Forecast Card */}
                <HourlyForecastCard
                  hourly={weatherData.hourly}
                  settings={settings}
                />

                {/* 4. 7-Day Forecast Trend Card */}
                <DailyForecastCard
                  daily={weatherData.daily}
                  settings={settings}
                />

                {/* 5. Weather Metrics (AQI, UV, Sun, Wind, Humidity, Visibility) */}
                <WeatherMetricsGrid
                  data={weatherData}
                  settings={settings}
                />

                {/* Secondary Google AdMob Native/Rectangle Slot */}
                <div className="mb-4">
                  <GoogleAdSlot type="medium-rectangle" lang={lang} />
                </div>
              </div>
            </WeatherAtmosphere>
          ) : null}
        </div>

        {/* Android Bottom Navigation Bar */}
        <AndroidNavBar
          currentTab={currentTab}
          onTabChange={handleTabChange}
          onOpenSearch={() => setIsSearchOpen(true)}
          lang={lang}
        />
      </div>

      {/* Modals & Drawers */}
      <CitySearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCity={handleSelectCity}
        onLocateGps={handleGpsLocation}
        isLocatingGps={isLocatingGps}
        currentCityId={currentCityId}
        settings={settings}
      />

      <CityManagerDrawer
        isOpen={isCityDrawerOpen}
        onClose={() => setIsCityDrawerOpen(false)}
        savedCities={savedCities}
        currentCityId={currentCityId}
        onSelectCity={(c) => {
          setCurrentCityId(c.id);
          setIsCityDrawerOpen(false);
        }}
        onRemoveCity={handleRemoveCity}
        onOpenSearch={() => setIsSearchOpen(true)}
        settings={settings}
      />

      <AndroidProjectExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <WeatherSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) =>
          setSettings((prev) => ({ ...prev, ...newSettings }))
        }
        onOpenWidgets={() => setIsWidgetModalOpen(true)}
      />

      {/* Home Screen Weather Widgets Modal */}
      <WeatherWidgetModal
        isOpen={isWidgetModalOpen}
        onClose={() => setIsWidgetModalOpen(false)}
        weatherData={weatherData}
        activeCity={activeCity}
        savedCities={savedCities}
        onSelectCity={(c) => {
          setCurrentCityId(c.id);
        }}
        settings={settings}
        onRefreshWeather={() => loadWeather(activeCity, false)}
      />

      {/* First-Install / Launch Android Location Permission Prompt */}
      <LocationPermissionDialog
        isOpen={showLocationPermissionDialog}
        onAllow={handleAllowInitialLocation}
        onDeny={handleDenyInitialLocation}
        lang={lang}
      />
    </div>
  );
}
