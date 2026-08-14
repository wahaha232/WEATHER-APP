export interface GeocodingResult {
  id: number;
  name: string;
  district?: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
}

export interface CurrentWeatherData {
  time: string;
  temperature: number;
  relativeHumidity: number;
  apparentTemperature: number;
  dewPoint?: number;
  isDay: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weatherCode: number;
  cloudCover: number;
  pressureMsl: number;
  surfacePressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
}

export interface HourlyWeatherData {
  time: string[];
  temperature: number[];
  relativeHumidity: number[];
  dewPoint?: number[];
  apparentTemperature: number[];
  precipitationProbability: number[];
  precipitation: number[];
  snowfallProbability?: number[];
  weatherCode: number[];
  surfacePressure: number[];
  visibility: number[];
  windSpeed: number[];
  windDirection?: number[];
  uvIndex: number[];
}

export interface DailyWeatherData {
  time: string[];
  weatherCode: number[];
  temperatureMax: number[];
  temperatureMin: number[];
  apparentTemperatureMax: number[];
  apparentTemperatureMin: number[];
  sunrise: string[];
  sunset: string[];
  uvIndexMax: number[];
  precipitationSum: number[];
  precipitationProbabilityMax: number[];
  precipitationProbabilityNight?: number[];
  windSpeedMax: number[];
  windDirectionDominant?: number[];
}

export interface AirQualityData {
  time: string;
  europeanAqi?: number;
  usAqi?: number;
  pm10?: number;
  pm2_5?: number;
  carbonMonoxide?: number;
  nitrogenDioxide?: number;
  sulphurDioxide?: number;
  ozone?: number;
}

export interface FullWeatherResponse {
  city: GeocodingResult;
  current: CurrentWeatherData;
  hourly: HourlyWeatherData;
  daily: DailyWeatherData;
  airQuality?: AirQualityData;
  lastUpdated: string;
}

export interface WeatherConditionInfo {
  code: number;
  label: string;
  description: string;
  iconName: string;
  gradientDay: string;
  gradientNight: string;
  bgType: 'clear' | 'cloudy' | 'rain' | 'thunder' | 'snow' | 'fog';
  themeColor: string;
}

export interface SavedCity {
  id: string;
  name: string;
  district?: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
  isGps?: boolean;
  timezone?: string;
}

export type AppTheme = 'dark' | 'light' | 'system';

export interface WeatherSettings {
  tempUnit: 'celsius' | 'fahrenheit';
  windSpeedUnit: 'kmh' | 'ms' | 'mph';
  pressureUnit: 'hPa' | 'mmHg' | 'inHg';
  phoneFrameMode: boolean;
  autoRefreshIntervalMinutes: number;
  language: 'zh' | 'en';
  timeFormat: '12h' | '24h';
  secondaryCityId?: string; // ID of optional 2nd location for dual-clock
  theme?: AppTheme; // 'dark' | 'light' | 'system'
}
