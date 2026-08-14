import {
  AirQualityData,
  CurrentWeatherData,
  DailyWeatherData,
  FullWeatherResponse,
  GeocodingResult,
  HourlyWeatherData,
  WeatherConditionInfo,
} from '../types';
import {
  AppLanguage,
  WEATHER_CONDITIONS_EN,
  WIND_DIRECTIONS_EN,
  WIND_DIRECTIONS_ZH,
} from './i18n';

/**
 * WMO Weather interpretation codes (WW)
 * Standard code definitions mapped to Traditional Chinese and visual properties
 */
export const WEATHER_CONDITIONS: Record<number, WeatherConditionInfo> = {
  0: {
    code: 0,
    label: '晴朗',
    description: '天空萬里無雲，陽光明媚',
    iconName: 'Sun',
    gradientDay: 'from-amber-400 via-sky-400 to-blue-600',
    gradientNight: 'from-indigo-950 via-slate-900 to-black',
    bgType: 'clear',
    themeColor: '#38bdf8',
  },
  1: {
    code: 1,
    label: '大致晴朗',
    description: '陽光充足，偶有微量浮雲',
    iconName: 'SunMedium',
    gradientDay: 'from-amber-300 via-sky-400 to-blue-500',
    gradientNight: 'from-indigo-900 via-slate-900 to-slate-950',
    bgType: 'clear',
    themeColor: '#60a5fa',
  },
  2: {
    code: 2,
    label: '多雲',
    description: '雲層局部覆蓋，微風和煦',
    iconName: 'CloudSun',
    gradientDay: 'from-sky-400 via-slate-400 to-slate-600',
    gradientNight: 'from-slate-800 via-slate-900 to-zinc-950',
    bgType: 'cloudy',
    themeColor: '#94a3b8',
  },
  3: {
    code: 3,
    label: '陰天',
    description: '全天陰雲密佈，光線偏弱',
    iconName: 'Cloud',
    gradientDay: 'from-slate-400 via-zinc-500 to-slate-700',
    gradientNight: 'from-zinc-900 via-neutral-900 to-black',
    bgType: 'cloudy',
    themeColor: '#64748b',
  },
  45: {
    code: 45,
    label: '有霧',
    description: '地面薄霧瀰漫，請注意行車視線',
    iconName: 'CloudFog',
    gradientDay: 'from-slate-400 via-stone-400 to-slate-600',
    gradientNight: 'from-stone-900 via-zinc-900 to-black',
    bgType: 'fog',
    themeColor: '#a1a1aa',
  },
  48: {
    code: 48,
    label: '沉積霧',
    description: '濃霧凝結，能見度較低',
    iconName: 'CloudFog',
    gradientDay: 'from-slate-500 via-stone-500 to-slate-700',
    gradientNight: 'from-stone-950 via-zinc-900 to-black',
    bgType: 'fog',
    themeColor: '#71717a',
  },
  51: {
    code: 51,
    label: '微量毛毛雨',
    description: '微弱細雨綿綿，建議備傘',
    iconName: 'CloudDrizzle',
    gradientDay: 'from-sky-500 via-blue-500 to-slate-700',
    gradientNight: 'from-slate-900 via-blue-950 to-black',
    bgType: 'rain',
    themeColor: '#38bdf8',
  },
  53: {
    code: 53,
    label: '毛毛雨',
    description: '持續細雨，路面微濕',
    iconName: 'CloudDrizzle',
    gradientDay: 'from-cyan-600 via-blue-600 to-slate-800',
    gradientNight: 'from-slate-900 via-cyan-950 to-black',
    bgType: 'rain',
    themeColor: '#06b6d4',
  },
  55: {
    code: 55,
    label: '密集毛毛雨',
    description: '較密集的細雨飄灑',
    iconName: 'CloudDrizzle',
    gradientDay: 'from-blue-600 via-indigo-600 to-slate-800',
    gradientNight: 'from-slate-900 via-indigo-950 to-black',
    bgType: 'rain',
    themeColor: '#2563eb',
  },
  61: {
    code: 61,
    label: '小雨',
    description: '輕度降雨，出門請攜帶雨具',
    iconName: 'CloudRain',
    gradientDay: 'from-blue-500 via-sky-600 to-slate-800',
    gradientNight: 'from-slate-900 via-blue-950 to-black',
    bgType: 'rain',
    themeColor: '#60a5fa',
  },
  63: {
    code: 63,
    label: '中雨',
    description: '明顯降雨，注意路面積水',
    iconName: 'CloudRain',
    gradientDay: 'from-blue-600 via-indigo-700 to-slate-900',
    gradientNight: 'from-blue-950 via-slate-950 to-black',
    bgType: 'rain',
    themeColor: '#3b82f6',
  },
  65: {
    code: 65,
    label: '大雨',
    description: '雨勢猛烈，請注意行車安全',
    iconName: 'CloudRain',
    gradientDay: 'from-indigo-600 via-blue-800 to-slate-950',
    gradientNight: 'from-slate-950 via-blue-950 to-black',
    bgType: 'rain',
    themeColor: '#1d4ed8',
  },
  71: {
    code: 71,
    label: '小雪',
    description: '輕微降雪，雪花飄舞',
    iconName: 'CloudSnow',
    gradientDay: 'from-sky-300 via-indigo-300 to-slate-500',
    gradientNight: 'from-slate-900 via-indigo-950 to-zinc-950',
    bgType: 'snow',
    themeColor: '#e0f2fe',
  },
  73: {
    code: 73,
    label: '中雪',
    description: '持續降雪，地面積雪漸增',
    iconName: 'CloudSnow',
    gradientDay: 'from-blue-200 via-sky-300 to-slate-600',
    gradientNight: 'from-slate-800 via-blue-950 to-black',
    bgType: 'snow',
    themeColor: '#bae6fd',
  },
  75: {
    code: 75,
    label: '大雪',
    description: '大雪紛飛，防寒保暖第一',
    iconName: 'CloudSnow',
    gradientDay: 'from-indigo-200 via-slate-300 to-slate-700',
    gradientNight: 'from-zinc-900 via-slate-950 to-black',
    bgType: 'snow',
    themeColor: '#7dd3fc',
  },
  77: {
    code: 77,
    label: '雪粒',
    description: '零星雪粒或冰霰飄落',
    iconName: 'Snowflake',
    gradientDay: 'from-sky-200 via-blue-300 to-slate-600',
    gradientNight: 'from-slate-900 via-slate-950 to-black',
    bgType: 'snow',
    themeColor: '#38bdf8',
  },
  80: {
    code: 80,
    label: '微弱陣雨',
    description: '短暫零星陣雨，偶有放晴',
    iconName: 'CloudDrizzle',
    gradientDay: 'from-sky-500 via-blue-600 to-slate-700',
    gradientNight: 'from-slate-900 via-blue-950 to-black',
    bgType: 'rain',
    themeColor: '#38bdf8',
  },
  81: {
    code: 81,
    label: '中度陣雨',
    description: '短時強陣雨，外出請備雨具',
    iconName: 'CloudRain',
    gradientDay: 'from-blue-600 via-cyan-700 to-slate-900',
    gradientNight: 'from-slate-950 via-cyan-950 to-black',
    bgType: 'rain',
    themeColor: '#0ea5e9',
  },
  82: {
    code: 82,
    label: '劇烈陣雨',
    description: '傾盆大陣雨，暫避室內為宜',
    iconName: 'CloudRain',
    gradientDay: 'from-indigo-700 via-blue-800 to-slate-950',
    gradientNight: 'from-black via-blue-950 to-slate-950',
    bgType: 'rain',
    themeColor: '#0284c7',
  },
  85: {
    code: 85,
    label: '微弱陣雪',
    description: '短暫陣雪飄落',
    iconName: 'CloudSnow',
    gradientDay: 'from-sky-300 via-blue-400 to-slate-600',
    gradientNight: 'from-slate-900 via-indigo-950 to-black',
    bgType: 'snow',
    themeColor: '#bae6fd',
  },
  86: {
    code: 86,
    label: '強烈陣雪',
    description: '短時強烈降雪',
    iconName: 'CloudSnow',
    gradientDay: 'from-indigo-300 via-blue-500 to-slate-700',
    gradientNight: 'from-slate-950 via-blue-950 to-black',
    bgType: 'snow',
    themeColor: '#7dd3fc',
  },
  95: {
    code: 95,
    label: '雷雨',
    description: '伴隨雷電與強降雨，注意安全',
    iconName: 'CloudLightning',
    gradientDay: 'from-purple-700 via-indigo-800 to-slate-950',
    gradientNight: 'from-purple-950 via-indigo-950 to-black',
    bgType: 'thunder',
    themeColor: '#a855f7',
  },
  96: {
    code: 96,
    label: '雷雨伴有微量冰雹',
    description: '雷電交加並夾帶小冰雹',
    iconName: 'CloudLightning',
    gradientDay: 'from-purple-800 via-blue-900 to-slate-950',
    gradientNight: 'from-purple-950 via-slate-950 to-black',
    bgType: 'thunder',
    themeColor: '#9333ea',
  },
  99: {
    code: 99,
    label: '劇烈雷雨伴有大冰雹',
    description: '強烈雷暴與大冰雹，嚴防災害',
    iconName: 'CloudLightning',
    gradientDay: 'from-violet-900 via-purple-950 to-black',
    gradientNight: 'from-black via-purple-950 to-slate-950',
    bgType: 'thunder',
    themeColor: '#7e22ce',
  },
};

export function getWeatherCondition(code: number, lang: AppLanguage = 'zh'): WeatherConditionInfo {
  const base = WEATHER_CONDITIONS[code] || {
    code,
    label: lang === 'zh' ? '多雲' : 'Cloudy',
    description: lang === 'zh' ? '雲層局部覆蓋' : 'Partly cloudy sky',
    iconName: 'Cloud',
    gradientDay: 'from-sky-400 via-slate-400 to-slate-600',
    gradientNight: 'from-slate-800 via-slate-900 to-zinc-950',
    bgType: 'cloudy',
    themeColor: '#94a3b8',
  };

  if (lang === 'en' && WEATHER_CONDITIONS_EN[code]) {
    return {
      ...base,
      label: WEATHER_CONDITIONS_EN[code].label,
      description: WEATHER_CONDITIONS_EN[code].description,
    };
  }

  return base;
}

export const POPULAR_CITIES: GeocodingResult[] = [
  {
    id: 1668341,
    name: '台北市信義區',
    district: '信義區',
    admin1: '台灣',
    country: '台灣',
    country_code: 'TW',
    latitude: 25.033,
    longitude: 121.5654,
    timezone: 'Asia/Taipei',
  },
  {
    id: 5128581,
    name: '紐約市皇后區',
    district: '皇后區 (Queens)',
    admin1: 'New York',
    country: '美國',
    country_code: 'US',
    latitude: 40.7282,
    longitude: -73.7949,
    timezone: 'America/New_York',
  },
  {
    id: 1850147,
    name: '東京新宿區',
    district: '新宿區 (Shinjuku)',
    admin1: '東京都',
    country: '日本',
    country_code: 'JP',
    latitude: 35.6938,
    longitude: 139.7034,
    timezone: 'Asia/Tokyo',
  },
  {
    id: 1673820,
    name: '高雄市左營區',
    district: '左營區',
    admin1: '台灣',
    country: '台灣',
    country_code: 'TW',
    latitude: 22.6888,
    longitude: 120.2944,
    timezone: 'Asia/Taipei',
  },
  {
    id: 1668399,
    name: '台中市西屯區',
    district: '西屯區',
    admin1: '台灣',
    country: '台灣',
    country_code: 'TW',
    latitude: 24.1627,
    longitude: 120.6474,
    timezone: 'Asia/Taipei',
  },
  {
    id: 1668284,
    name: '新北市板橋區',
    district: '板橋區',
    admin1: '台灣',
    country: '台灣',
    country_code: 'TW',
    latitude: 25.0117,
    longitude: 121.4658,
    timezone: 'Asia/Taipei',
  },
  {
    id: 1819729,
    name: '香港中環',
    district: '中環 (Central)',
    admin1: '香港特別行政區',
    country: '香港',
    country_code: 'HK',
    latitude: 22.2819,
    longitude: 114.1582,
    timezone: 'Asia/Hong_Kong',
  },
  {
    id: 1835848,
    name: '首爾江南區',
    district: '江南區 (Gangnam)',
    admin1: '首爾特別市',
    country: '韓國',
    country_code: 'KR',
    latitude: 37.5172,
    longitude: 127.0473,
    timezone: 'Asia/Seoul',
  },
  {
    id: 2643743,
    name: '倫敦西敏區',
    district: '西敏 (Westminster)',
    admin1: 'England',
    country: '英國',
    country_code: 'GB',
    latitude: 51.4975,
    longitude: -0.1357,
    timezone: 'Europe/London',
  },
  {
    id: 5368361,
    name: '洛杉磯好萊塢',
    district: '好萊塢 (Hollywood)',
    admin1: 'California',
    country: '美國',
    country_code: 'US',
    latitude: 34.0928,
    longitude: -118.3287,
    timezone: 'America/Los_Angeles',
  },
];

/**
 * Fetch forecast and air quality data from Open-Meteo free API (No API key required)
 */
export async function fetchFullWeatherData(
  city: GeocodingResult,
  lang: AppLanguage = 'zh'
): Promise<FullWeatherResponse> {
  const { latitude, longitude } = city;

  // 1. Weather Forecast Request
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,surface_pressure,visibility,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

  // 2. Air Quality Request
  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`;

  const [weatherRes, aqiRes] = await Promise.allSettled([
    fetch(weatherUrl),
    fetch(aqiUrl),
  ]);

  if (weatherRes.status !== 'fulfilled' || !weatherRes.value.ok) {
    throw new Error(lang === 'zh' ? '無法取得天氣預報資料，請稍後再試' : 'Failed to fetch weather forecast data');
  }

  const weatherData = await weatherRes.value.json();
  let airQualityData: AirQualityData | undefined = undefined;

  if (aqiRes.status === 'fulfilled' && aqiRes.value.ok) {
    try {
      const aqiJson = await aqiRes.value.json();
      if (aqiJson.current) {
        airQualityData = {
          time: aqiJson.current.time,
          europeanAqi: aqiJson.current.european_aqi,
          usAqi: aqiJson.current.us_aqi,
          pm10: aqiJson.current.pm10,
          pm2_5: aqiJson.current.pm2_5,
          carbonMonoxide: aqiJson.current.carbon_monoxide,
          nitrogenDioxide: aqiJson.current.nitrogen_dioxide,
          sulphurDioxide: aqiJson.current.sulphur_dioxide,
          ozone: aqiJson.current.ozone,
        };
      }
    } catch (e) {
      console.warn('Air quality data parsing failed', e);
    }
  }

  const current: CurrentWeatherData = {
    time: weatherData.current.time,
    temperature: weatherData.current.temperature_2m,
    relativeHumidity: weatherData.current.relative_humidity_2m,
    apparentTemperature: weatherData.current.apparent_temperature,
    isDay: weatherData.current.is_day,
    precipitation: weatherData.current.precipitation,
    rain: weatherData.current.rain,
    showers: weatherData.current.showers,
    snowfall: weatherData.current.snowfall,
    weatherCode: weatherData.current.weather_code,
    cloudCover: weatherData.current.cloud_cover,
    pressureMsl: weatherData.current.pressure_msl,
    surfacePressure: weatherData.current.surface_pressure,
    windSpeed: weatherData.current.wind_speed_10m,
    windDirection: weatherData.current.wind_direction_10m,
    windGusts: weatherData.current.wind_gusts_10m,
  };

  const hourly: HourlyWeatherData = {
    time: weatherData.hourly.time || [],
    temperature: weatherData.hourly.temperature_2m || [],
    relativeHumidity: weatherData.hourly.relative_humidity_2m || [],
    apparentTemperature: weatherData.hourly.apparent_temperature || [],
    precipitationProbability: weatherData.hourly.precipitation_probability || [],
    precipitation: weatherData.hourly.precipitation || [],
    weatherCode: weatherData.hourly.weather_code || [],
    surfacePressure: weatherData.hourly.surface_pressure || [],
    visibility: weatherData.hourly.visibility || [],
    windSpeed: weatherData.hourly.wind_speed_10m || [],
    uvIndex: weatherData.hourly.uv_index || [],
  };

  const daily: DailyWeatherData = {
    time: weatherData.daily.time || [],
    weatherCode: weatherData.daily.weather_code || [],
    temperatureMax: weatherData.daily.temperature_2m_max || [],
    temperatureMin: weatherData.daily.temperature_2m_min || [],
    apparentTemperatureMax: weatherData.daily.apparent_temperature_max || [],
    apparentTemperatureMin: weatherData.daily.apparent_temperature_min || [],
    sunrise: weatherData.daily.sunrise || [],
    sunset: weatherData.daily.sunset || [],
    uvIndexMax: weatherData.daily.uv_index_max || [],
    precipitationSum: weatherData.daily.precipitation_sum || [],
    precipitationProbabilityMax: weatherData.daily.precipitation_probability_max || [],
    windSpeedMax: weatherData.daily.wind_speed_10m_max || [],
  };

  return {
    city,
    current,
    hourly,
    daily,
    airQuality: airQualityData,
    lastUpdated: new Date().toLocaleTimeString(lang === 'zh' ? 'zh-TW' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  };
}

/**
 * Free geocoding search using Open-Meteo Geocoding API with multi-lingual support
 */
export async function searchCities(
  query: string,
  lang: AppLanguage = 'zh'
): Promise<GeocodingResult[]> {
  if (!query || query.trim().length === 0) return [];
  const cleanQuery = query.trim();
  const langParam = lang === 'zh' ? 'zh' : 'en';
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    cleanQuery
  )}&count=12&language=${langParam}&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results) return [];
    return data.results.map((item: any) => {
      // Build clean granular display name
      const admin2 = item.admin2 || '';
      const admin1 = item.admin1 || '';
      const baseName = item.name;
      let finalName = baseName;
      let district = admin2 || undefined;

      if (admin2 && admin2 !== baseName) {
        if (lang === 'zh') {
          finalName = `${baseName}${admin2}`;
        } else {
          finalName = `${admin2}, ${baseName}`;
        }
      }

      return {
        id: item.id,
        name: finalName,
        district,
        latitude: item.latitude,
        longitude: item.longitude,
        elevation: item.elevation,
        country_code: item.country_code,
        country: item.country,
        admin1,
        admin2,
        timezone: item.timezone,
      };
    });
  } catch (err) {
    console.error('Error searching cities:', err);
    return [];
  }
}

/**
 * Ultra-precise Reverse geocoding to find granular city + district/borough from coordinates
 * (e.g. 紐約市皇后區 / Queens, New York / 台北市信義區 / 東京都新宿區)
 */
export async function reverseGeocode(
  lat: number,
  lon: number,
  lang: AppLanguage = 'zh'
): Promise<GeocodingResult> {
  try {
    const acceptLang = lang === 'zh' ? 'zh-TW,zh;q=0.9,en;q=0.5' : 'en-US,en;q=0.9';
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&accept-language=${acceptLang}`,
      {
        headers: {
          'User-Agent': 'PrecisionWeatherAndroidApp/2.0',
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};

      // 1. Identify District / Borough / Suburb / Quarter / Neighborhood
      const rawDistrict =
        addr.borough ||
        addr.suburb ||
        addr.quarter ||
        addr.city_district ||
        addr.district ||
        addr.neighbourhood ||
        addr.town ||
        '';

      // 2. Identify City / County / State / Municipality
      const rawCity =
        addr.city ||
        addr.county ||
        addr.municipality ||
        addr.state_district ||
        addr.state ||
        addr.village ||
        '';

      const country = addr.country || '';
      const countryCode = addr.country_code?.toUpperCase() || '';
      const admin1 = addr.state || addr.county || country || '';

      let displayName = '';
      let districtName = rawDistrict;

      if (lang === 'zh') {
        if (rawCity && rawDistrict && rawCity !== rawDistrict) {
          // Normalize city name (e.g., if New York is called 紐約, add 市 for natural rhythm: 紐約市皇后區)
          let normalizedCity = rawCity;
          if (
            !normalizedCity.endsWith('市') &&
            !normalizedCity.endsWith('縣') &&
            !normalizedCity.endsWith('區') &&
            !normalizedCity.endsWith('省')
          ) {
            if (normalizedCity === '紐約' || normalizedCity === 'New York') {
              normalizedCity = '紐約市';
            } else if (normalizedCity === '東京' || normalizedCity === 'Tokyo') {
              normalizedCity = '東京';
            } else if (normalizedCity === '台北' || normalizedCity === 'Taipei') {
              normalizedCity = '台北市';
            } else if (normalizedCity === '高雄' || normalizedCity === 'Kaohsiung') {
              normalizedCity = '高雄市';
            } else if (normalizedCity === '台中' || normalizedCity === 'Taichung') {
              normalizedCity = '台中市';
            }
          }

          if (normalizedCity.includes(rawDistrict)) {
            displayName = normalizedCity;
          } else if (rawDistrict.includes(normalizedCity)) {
            displayName = rawDistrict;
          } else {
            displayName = `${normalizedCity}${rawDistrict}`;
          }
        } else {
          displayName = rawDistrict || rawCity || '當前位置';
        }
      } else {
        // English formatting
        if (rawCity && rawDistrict && rawCity !== rawDistrict) {
          displayName = `${rawDistrict}, ${rawCity}`;
        } else {
          displayName = rawDistrict || rawCity || 'Current Location';
        }
      }

      return {
        id: Math.round(lat * 1000 + lon * 1000),
        name: displayName,
        district: districtName || undefined,
        admin1,
        country,
        country_code: countryCode,
        latitude: lat,
        longitude: lon,
      };
    }
  } catch (e) {
    console.warn('Reverse geocoding with nominatim failed', e);
  }

  return {
    id: Math.round(lat * 1000 + lon * 1000),
    name: lang === 'zh' ? '當前定位位置' : 'Current Location',
    latitude: lat,
    longitude: lon,
  };
}

export function formatTemp(celsius: number, unit: 'celsius' | 'fahrenheit'): string {
  if (unit === 'fahrenheit') {
    return `${Math.round((celsius * 9) / 5 + 32)}°`;
  }
  return `${Math.round(celsius)}°`;
}

export function formatWindSpeed(
  kmh: number,
  unit: 'kmh' | 'ms' | 'mph'
): { value: number; label: string } {
  if (unit === 'ms') {
    return { value: Number((kmh / 3.6).toFixed(1)), label: 'm/s' };
  }
  if (unit === 'mph') {
    return { value: Number((kmh * 0.621371).toFixed(1)), label: 'mph' };
  }
  return { value: Number(kmh.toFixed(1)), label: 'km/h' };
}

export function getWindDirectionText(degrees: number, lang: AppLanguage = 'zh'): string {
  const directions = lang === 'zh' ? WIND_DIRECTIONS_ZH : WIND_DIRECTIONS_EN;
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function getAqiCategory(
  usAqi?: number,
  lang: AppLanguage = 'zh'
): {
  label: string;
  color: string;
  bgColor: string;
  advice: string;
} {
  if (usAqi === undefined || usAqi === null) {
    return {
      label: lang === 'zh' ? '無資料' : 'No Data',
      color: 'text-zinc-400',
      bgColor: 'bg-zinc-800/60',
      advice: lang === 'zh' ? '暫無空氣品質數值' : 'No air quality data available',
    };
  }
  if (usAqi <= 50) {
    return {
      label: lang === 'zh' ? '良好 (Good)' : 'Good (0-50)',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20 border-emerald-500/30',
      advice:
        lang === 'zh'
          ? '空氣品質極佳，非常適合各項戶外活動與開窗通風。'
          : 'Air quality is excellent. Ideal for outdoor activities and open ventilation.',
    };
  }
  if (usAqi <= 100) {
    return {
      label: lang === 'zh' ? '普通 (Moderate)' : 'Moderate (51-100)',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20 border-yellow-500/30',
      advice:
        lang === 'zh'
          ? '空氣品質尚可，極少數極度敏感體質者應斟酌戶外活動。'
          : 'Air quality is acceptable. Unusually sensitive people should consider limiting outdoor exertion.',
    };
  }
  if (usAqi <= 150) {
    return {
      label: lang === 'zh' ? '對敏感族群不健康' : 'Unhealthy for Sensitive Groups',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20 border-orange-500/30',
      advice:
        lang === 'zh'
          ? '老人、小孩及心肺疾病患者宜減少長時間劇烈戶外運動。'
          : 'Members of sensitive groups may experience health effects. Limit prolonged outdoor exertion.',
    };
  }
  if (usAqi <= 200) {
    return {
      label: lang === 'zh' ? '不健康 (Unhealthy)' : 'Unhealthy (151-200)',
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/20 border-rose-500/30',
      advice:
        lang === 'zh'
          ? '所有人健康皆可能受影響，外出建議配戴防護口罩。'
          : 'Everyone may begin to experience health effects. Wear a protective mask outdoors.',
    };
  }
  if (usAqi <= 300) {
    return {
      label: lang === 'zh' ? '非常不健康 (Very Unhealthy)' : 'Very Unhealthy (201-300)',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20 border-purple-500/30',
      advice:
        lang === 'zh'
          ? '健康警報，應盡量留在室內並關閉門窗開啟清淨機。'
          : 'Health alert: stay indoors, close windows, and run an air purifier.',
    };
  }
  return {
    label: lang === 'zh' ? '危害 (Hazardous)' : 'Hazardous (301+)',
    color: 'text-red-500',
    bgColor: 'bg-red-500/30 border-red-500/40',
    advice:
      lang === 'zh'
        ? '緊急健康風險，所有人應完全避免任何戶外活動。'
        : 'Health warnings of emergency conditions. Entire population is likely affected.',
  };
}

export function getUvCategory(
  uvIndex: number,
  lang: AppLanguage = 'zh'
): {
  label: string;
  color: string;
  advice: string;
} {
  if (uvIndex < 3) {
    return {
      label: lang === 'zh' ? '低量級 (Low)' : 'Low (0-2)',
      color: 'text-emerald-400',
      advice:
        lang === 'zh'
          ? '紫外線強度弱，外出無需特殊防護措施。'
          : 'Minimal sun protection required. Safe to stay outside.',
    };
  }
  if (uvIndex < 6) {
    return {
      label: lang === 'zh' ? '中量級 (Moderate)' : 'Moderate (3-5)',
      color: 'text-amber-400',
      advice:
        lang === 'zh'
          ? '建議塗抹防曬乳、配戴帽子或太陽眼鏡。'
          : 'Wear sunscreen, hat, and sunglasses during midday hours.',
    };
  }
  if (uvIndex < 8) {
    return {
      label: lang === 'zh' ? '高量級 (High)' : 'High (6-7)',
      color: 'text-orange-400',
      advice:
        lang === 'zh'
          ? '中午時段盡量尋找遮蔭處，外出防曬備齊。'
          : 'Seek shade during midday. Generously apply SPF sunscreen.',
    };
  }
  if (uvIndex < 11) {
    return {
      label: lang === 'zh' ? '過量級 (Very High)' : 'Very High (8-10)',
      color: 'text-rose-400',
      advice:
        lang === 'zh'
          ? '紫外線強烈，上午10時至下午2時盡量避免曝曬。'
          : 'Extra protection needed. Avoid sun exposure between 10am and 4pm.',
    };
  }
  return {
    label: lang === 'zh' ? '危險級 (Extreme)' : 'Extreme (11+)',
    color: 'text-purple-400',
    advice:
      lang === 'zh'
        ? '紫外線極度危險，在戶外幾分鐘內即可灼傷皮膚。'
        : 'Extreme danger! Unprotected skin and eyes will burn in minutes.',
  };
}
