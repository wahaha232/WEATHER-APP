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
  apparentTemperature: number[];
  precipitationProbability: number[];
  precipitation: number[];
  weatherCode: number[];
  surfacePressure: number[];
  visibility: number[];
  windSpeed: number[];
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
  windSpeedMax: number[];
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
}

export interface WeatherSettings {
  tempUnit: 'celsius' | 'fahrenheit';
  windSpeedUnit: 'kmh' | 'ms' | 'mph';
  pressureUnit: 'hPa' | 'mmHg' | 'inHg';
  phoneFrameMode: boolean;
  autoRefreshIntervalMinutes: number;
  language: 'zh' | 'en';
}
