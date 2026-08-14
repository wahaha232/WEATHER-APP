export type AppLanguage = 'zh' | 'en';

export interface TranslationDict {
  // Navigation & Header
  appTitle: string;
  appName: string;
  myCities: string;
  searchPlaceholder: string;
  searchCity: string;
  settings: string;
  switchCity: string;
  exportAndroidCode: string;
  androidSourceTitle: string;
  androidSourceBtn: string;
  toggleWidescreen: string;
  togglePhoneFrame: string;
  
  // Navigation Bar Tabs
  navLiveWeather: string;
  navSearch: string;
  navMyCities: string;
  navWidgets: string;
  navAndroidCode: string;
  navSettings: string;

  // Auto-refresh interval in Settings
  autoRefreshLabel: string;
  autoRefreshDesc: string;
  minuteUnit: string;
  widgetCenterTitle: string;
  openWidgetCenter: string;

  // Loading & Error States
  connectingApi: string;
  loadingCityWeather: (cityName: string) => string;
  errorTitle: string;
  retryConnect: string;

  // Android Project Banner
  androidProjectBannerTag: string;
  androidProjectBannerTitle: string;
  androidProjectBannerDesc: string;
  exploreAndroidCodeBtn: string;
  
  // Hero section
  currentTemp: string;
  feelsLike: string;
  high: string;
  low: string;
  rainProbability: string;
  windSpeed: string;
  humidity: string;
  uvIndex: string;
  updatedAt: string;
  liveOpenMeteo: string;
  refreshing: string;
  locateMeGps: string;
  currentLocationBadge: string;
  
  // Daily & Hourly Cards
  hourlyForecastTitle: string;
  hourlySwipeTip: string;
  now: string;
  dailyForecastTitle: string;
  tempRangeTrend: string;
  today: string;
  tomorrow: string;
  weekdays: string[];
  
  // Metric Cards
  aqiTitle: string;
  aqiStandard: string;
  uvTitle: string;
  uvTodayMax: string;
  sunriseSunsetTitle: string;
  totalDaylight: string;
  sunrise: string;
  sunset: string;
  windTitle: string;
  gustMax: string;
  windAngle: string;
  humidityPressureTitle: string;
  relativeHumidity: string;
  airPressure: string;
  cloudCover: string;
  visibilityTitle: string;
  viewClear: string;
  visibilityTip: string;
  stayHydratedTip: string;
  humidEnv: string;
  dryEnv: string;
  comfortableEnv: string;
  
  // Modals & Drawers
  settingsTitle: string;
  tempUnitLabel: string;
  celsius: string;
  fahrenheit: string;
  windUnitLabel: string;
  timeFormatLabel: string;
  timeFormat12h: string;
  timeFormat24h: string;
  dstAutoDetect: string;
  dstActiveBadge: string;
  secondaryClockTitle: string;
  secondaryClockDesc: string;
  secondaryClockNone: string;
  selectSecondaryCity: string;
  languageLabel: string;
  langZh: string;
  langEn: string;
  phoneFrameModeLabel: string;
  phoneFrameModeDesc: string;
  themeLabel: string;
  themeDark: string;
  themeLight: string;
  themeSystem: string;
  themeDesc: string;
  techInfoTitle: string;
  techInfoDesc: string;
  finishSettings: string;
  
  // Dual Clock & Local Time
  localTimeTitle: string;
  secondCityTimeTitle: string;
  timeDifference: (hours: string) => string;
  
  cityDrawerTitle: string;
  addNewCity: string;
  displayingBadge: string;
  locateGpsBadge: string;
  autoSavePreferenceTip: string;
  removeCityTooltip: string;
  
  searchModalTitle: string;
  searchResults: string;
  searchingDatabase: string;
  noCityFound: string;
  tryDifferentQuery: string;
  popularCitiesRecommend: string;
  currentSelected: string;
  select: string;
  
  // Location Permission Dialog
  locationPermissionTitle: string;
  locationPermissionDesc: string;
  permissionPreciseLocation: string;
  permissionWhileUsing: string;
  allowWhileUsing: string;
  denyPermission: string;
  preciseLocationText: string;
  onlyWhileUsingText: string;
  allowWhileUsingBtn: string;
  denyBtn: string;
  
  // Google Ad Slot
  adMobBanner: string;
  adMobBannerTag: string;
  adMobTestReady: string;
  adMobUnitSlot: string;
  adUnitReserved: string;
  adMobContentTitle: string;
  adMobContentDesc: string;
  adLoadingPrompt: string;
  adMobViewBtn: string;
  view: string;
  adMobNative: string;
  adMobNativeTag: string;
  adMobNativeTitle: string;
  adMobNativeDesc: string;
  
  // Toast & Alerts
  locateSuccess: string;
  locateFail: string;
}

export const TRANSLATIONS: Record<AppLanguage, TranslationDict> = {
  zh: {
    appTitle: '極簡精準天氣',
    appName: '極簡精準天氣',
    myCities: '我的城市列表',
    searchPlaceholder: '輸入城市名稱（例如：台北、紐約市皇后區、東京、London...）',
    searchCity: '搜尋全球城市',
    settings: '偏好設定 (Settings)',
    switchCity: '管理或切換城市',
    exportAndroidCode: 'Android 原始碼',
    androidSourceTitle: 'Kotlin Jetpack Compose 原生專案代碼',
    androidSourceBtn: 'Android 原始碼 (Kotlin)',
    toggleWidescreen: '切換寬螢幕視窗',
    togglePhoneFrame: '切換手機外框視窗',

    navLiveWeather: '天氣',
    navSearch: '搜尋',
    navMyCities: '城市',
    navWidgets: '微件',
    navAndroidCode: '原始碼',
    navSettings: '設定',

    autoRefreshLabel: '天氣自動更新頻率 (Auto-Refresh)',
    autoRefreshDesc: '選擇在背景自動向氣象局獲取最新即時資料的間隔週期',
    minuteUnit: '分鐘',
    widgetCenterTitle: '桌面天氣小工具 (Home Widgets)',
    openWidgetCenter: '自訂桌面小工具樣式',

    connectingApi: '正在連線 Open-Meteo 氣象服務...',
    loadingCityWeather: (cityName: string) => `正在取得 ${cityName} 的高精度逐時預報、7天趨勢與空氣品質資料...`,
    errorTitle: '氣象連線發生問題',
    retryConnect: '重新連線氣象 API',

    androidProjectBannerTag: '原生 Android 開發套件',
    androidProjectBannerTitle: '包含完整的 Kotlin + Jetpack Compose 專案代碼',
    androidProjectBannerDesc: '已配置 Android 14 邊緣沉浸式全螢幕、GPS 執行期權限請求、Open-Meteo 氣象串接與 Google AdMob 正式廣告插槽。',
    exploreAndroidCodeBtn: '查看完整 Android 原始碼',
    
    currentTemp: '即時氣溫',
    feelsLike: '體感',
    high: '最高',
    low: '最低',
    rainProbability: '降雨機率',
    windSpeed: '風速',
    humidity: '相對濕度',
    uvIndex: '紫外線',
    updatedAt: '更新時間：',
    liveOpenMeteo: '免費即時連線 (Open-Meteo)',
    refreshing: '重新整理中...',
    locateMeGps: '使用 GPS 獲取我目前所在地的即時天氣',
    currentLocationBadge: '定位',
    
    hourlyForecastTitle: '24 小時逐時天氣預報',
    hourlySwipeTip: '滑動查看更多',
    now: '現在',
    dailyForecastTitle: '7 天天氣預測趨勢',
    tempRangeTrend: '溫度區間變化',
    today: '今天',
    tomorrow: '明天',
    weekdays: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
    
    aqiTitle: '空氣品質指標 (AQI)',
    aqiStandard: 'US AQI 標準指數',
    uvTitle: '紫外線指數 (UV Index)',
    uvTodayMax: '今日最大值 (Max)',
    sunriseSunsetTitle: '日出與日落時間',
    totalDaylight: '總日照',
    sunrise: '日出',
    sunset: '日落',
    windTitle: '風速與風向 (Wind)',
    gustMax: '陣風最高達：',
    windAngle: '風向方位角度：',
    humidityPressureTitle: '濕度與氣壓',
    relativeHumidity: '相對濕度',
    airPressure: '大氣氣壓',
    cloudCover: '雲量覆蓋率：',
    visibilityTitle: '能見度與外出建議',
    viewClear: '視線清晰',
    visibilityTip: '目前大氣透光度佳，遠處地標清晰可辨',
    stayHydratedTip: '外出注意適時補充水分，隨時掌握即時天氣變動。',
    humidEnv: '環境潮濕',
    dryEnv: '空氣乾燥',
    comfortableEnv: '舒適宜人',
    
    settingsTitle: '偏好設定 (Settings)',
    tempUnitLabel: '溫度單位',
    celsius: '攝氏 (°C)',
    fahrenheit: '華氏 (°F)',
    windUnitLabel: '風速單位',
    timeFormatLabel: '時間制式 (12/24 小時制)',
    timeFormat12h: '12 小時制 (上午/下午)',
    timeFormat24h: '24 小時制 (00:00 - 23:59)',
    dstAutoDetect: '自動識別日光節約時間 (DST)',
    dstActiveBadge: '日光節約時間 (夏令時間) 生效中',
    secondaryClockTitle: '第 2 地時間 (雙時區時鐘)',
    secondaryClockDesc: '在天氣卡片與小工具中同時顯示第二城市的即時當地時間',
    secondaryClockNone: '未設定 (僅顯示目前城市)',
    selectSecondaryCity: '選擇第 2 地城市',
    languageLabel: '語言選擇 (Language)',
    langZh: '繁體中文 (Chinese)',
    langEn: 'English (英文)',
    phoneFrameModeLabel: 'Android 手機外框模式',
    phoneFrameModeDesc: '模擬真實 Android 手機頂部狀態列與導航條',
    themeLabel: '佈景主題 (Theme)',
    themeDark: '黑 (深色模式)',
    themeLight: '白 (淺色模式)',
    themeSystem: '裝置 (跟隨系統)',
    themeDesc: '選擇深色、淺色或自動跟隨裝置系統外觀',
    techInfoTitle: '氣象資料與技術規格說明',
    techInfoDesc: '本天氣應用程式整合 Open-Meteo 開放氣象 API，完全免費且無需任何 API 金鑰。支援全球高精度逐時預報、7 天趨勢、AQI 空氣品質、精確時區與自動夏令時間 (DST) 轉換。',
    finishSettings: '完成設定',

    // Dual Clock & Local Time
    localTimeTitle: '當地時間',
    secondCityTimeTitle: '第 2 地時間',
    timeDifference: (hours: string) => `時差：${hours}`,
    
    cityDrawerTitle: '我的城市列表',
    addNewCity: '新增其他城市',
    displayingBadge: '顯示中',
    locateGpsBadge: '定位',
    autoSavePreferenceTip: '切換城市後將自動儲存偏好設定',
    removeCityTooltip: '從我的城市中移除',
    
    searchModalTitle: '搜尋或切換城市',
    searchResults: '搜尋結果',
    searchingDatabase: '正在從 Open-Meteo 地理資料庫搜尋...',
    noCityFound: '找不到符合條件的城市',
    tryDifferentQuery: '請嘗試輸入其他拼音或中英文城市名稱（例如：紐約市皇后區、台北、Tokyo）',
    popularCitiesRecommend: '熱門城市推薦',
    currentSelected: '目前選取',
    select: '選擇',
    
    locationPermissionTitle: '允許「天氣」存取此裝置的位置資訊？',
    locationPermissionDesc: '為了為您提供最準確的當地即時天氣、降雨雷達預警與空氣品質指數，我們需要存取您的裝置位置。',
    permissionPreciseLocation: '精確定位（GPS 與網路輔助）',
    permissionWhileUsing: '僅在應用程式使用期間存取',
    allowWhileUsing: '使用應用程式時允許',
    denyPermission: '拒絕（手動搜尋城市）',
    preciseLocationText: '精確定位（GPS 與網路輔助）',
    onlyWhileUsingText: '僅在應用程式使用期間存取',
    allowWhileUsingBtn: '使用應用程式時允許',
    denyBtn: '拒絕（手動搜尋城市）',
    
    adMobBanner: 'Google AdMob 橫幅廣告',
    adMobBannerTag: 'Google AdMob 橫幅廣告',
    adMobTestReady: '(正式版位已就緒)',
    adMobUnitSlot: 'Ad Unit 預留位置',
    adUnitReserved: '正式版位預留中',
    adMobContentTitle: 'Google AdMob 贊助廣告',
    adMobContentDesc: '上線時自動載入高收益贊助內容',
    adLoadingPrompt: '上線時將自動展示高收益贊助廣告',
    adMobViewBtn: '查看',
    view: '查看',
    adMobNative: 'Google AdMob 原生廣告插槽',
    adMobNativeTag: 'Google AdMob 原生 / 矩形廣告',
    adMobNativeTitle: 'Google AdMob 原生廣告插槽',
    adMobNativeDesc: '在 Android 原生端對應 AdView 與 AdSize.MEDIUM_RECTANGLE',
    
    locateSuccess: '已成功定位至您目前所在位置',
    locateFail: '無法取得目前 GPS 位置，請確認已開啟裝置定位權限',
  },
  en: {
    appTitle: 'Precision Weather',
    appName: 'Precision Weather',
    myCities: 'My Cities',
    searchPlaceholder: 'Enter city name (e.g. New York, Queens, Taipei, Tokyo, London...)',
    searchCity: 'Search Global Cities',
    settings: 'Settings',
    switchCity: 'Manage or Switch Cities',
    exportAndroidCode: 'Android Source Code',
    androidSourceTitle: 'Kotlin Jetpack Compose Android Project Code',
    androidSourceBtn: 'Android Code (Kotlin)',
    toggleWidescreen: 'Switch to Widescreen',
    togglePhoneFrame: 'Switch to Phone Frame',

    navLiveWeather: 'Weather',
    navSearch: 'Search',
    navMyCities: 'Cities',
    navWidgets: 'Widgets',
    navAndroidCode: 'Code',
    navSettings: 'Settings',

    autoRefreshLabel: 'Weather Auto-Refresh Interval',
    autoRefreshDesc: 'Choose how often weather data refreshes automatically in the background',
    minuteUnit: 'min',
    widgetCenterTitle: 'Home Screen Widgets',
    openWidgetCenter: 'Customize Home Widgets',

    connectingApi: 'Connecting to Open-Meteo weather API...',
    loadingCityWeather: (cityName: string) => `Fetching hourly forecast, 7-day trends, and AQI for ${cityName}...`,
    errorTitle: 'Weather Service Connection Error',
    retryConnect: 'Retry Weather API',

    androidProjectBannerTag: 'Native Android Toolkit',
    androidProjectBannerTitle: 'Complete Kotlin + Jetpack Compose Project Included',
    androidProjectBannerDesc: 'Configured with Android 14 edge-to-edge UI, GPS runtime permissions, Open-Meteo integration, and Google AdMob ad slots.',
    exploreAndroidCodeBtn: 'View Kotlin Source Code',
    
    currentTemp: 'Current Temp',
    feelsLike: 'Feels like',
    high: 'High',
    low: 'Low',
    rainProbability: 'Rain Chance',
    windSpeed: 'Wind',
    humidity: 'Humidity',
    uvIndex: 'UV Index',
    updatedAt: 'Updated at: ',
    liveOpenMeteo: 'Live Connection (Open-Meteo)',
    refreshing: 'Refreshing...',
    locateMeGps: 'Use GPS to get current location weather',
    currentLocationBadge: 'GPS',
    
    hourlyForecastTitle: '24-Hour Forecast',
    hourlySwipeTip: 'Swipe to view more',
    now: 'Now',
    dailyForecastTitle: '7-Day Forecast Trend',
    tempRangeTrend: 'Temperature Range',
    today: 'Today',
    tomorrow: 'Tomorrow',
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    
    aqiTitle: 'Air Quality Index (AQI)',
    aqiStandard: 'US AQI Standard',
    uvTitle: 'UV Index',
    uvTodayMax: 'Today Max',
    sunriseSunsetTitle: 'Sunrise & Sunset',
    totalDaylight: 'Total Daylight',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    windTitle: 'Wind & Direction',
    gustMax: 'Gusts up to: ',
    windAngle: 'Wind Angle: ',
    humidityPressureTitle: 'Humidity & Pressure',
    relativeHumidity: 'Relative Humidity',
    airPressure: 'Barometric Pressure',
    cloudCover: 'Cloud Cover: ',
    visibilityTitle: 'Visibility & Outdoor Tips',
    viewClear: 'Clear Visibility',
    visibilityTip: 'Great atmospheric clarity, distant landmarks clearly visible',
    stayHydratedTip: 'Remember to stay hydrated and monitor changing weather conditions.',
    humidEnv: 'Humid',
    dryEnv: 'Dry Air',
    comfortableEnv: 'Comfortable',
    
    settingsTitle: 'Settings',
    tempUnitLabel: 'Temperature Unit',
    celsius: 'Celsius (°C)',
    fahrenheit: 'Fahrenheit (°F)',
    windUnitLabel: 'Wind Speed Unit',
    timeFormatLabel: 'Time Format (12h / 24h)',
    timeFormat12h: '12-Hour (AM / PM)',
    timeFormat24h: '24-Hour (00:00 - 23:59)',
    dstAutoDetect: 'Auto-detect Daylight Saving Time (DST)',
    dstActiveBadge: 'Daylight Saving Time (DST) Active',
    secondaryClockTitle: 'Secondary Location Time (Dual Clock)',
    secondaryClockDesc: 'Display a second city\'s live local time on the weather hero card and widgets',
    secondaryClockNone: 'None (Primary city only)',
    selectSecondaryCity: 'Select 2nd Location',
    languageLabel: 'Language (語言)',
    langZh: '繁體中文 (Chinese)',
    langEn: 'English (英文)',
    phoneFrameModeLabel: 'Android Phone Frame Mode',
    phoneFrameModeDesc: 'Simulate Android status bar and navigation gestures',
    themeLabel: 'Theme (佈景主題)',
    themeDark: 'Dark (黑)',
    themeLight: 'Light (白)',
    themeSystem: 'System (裝置)',
    themeDesc: 'Choose Dark, Light, or follow your device system settings',
    techInfoTitle: 'Data & Technical Specifications',
    techInfoDesc: 'Powered by Open-Meteo open weather API, free with no API key required. Supports high-precision hourly forecast, 7-day trend, AQI, timezone offset, and automatic DST conversion.',
    finishSettings: 'Done',

    // Dual Clock & Local Time
    localTimeTitle: 'Local Time',
    secondCityTimeTitle: '2nd City Time',
    timeDifference: (hours: string) => `Diff: ${hours}`,
    
    cityDrawerTitle: 'My Cities',
    addNewCity: 'Add Another City',
    displayingBadge: 'Active',
    locateGpsBadge: 'GPS',
    autoSavePreferenceTip: 'Preferences are automatically saved upon switching',
    removeCityTooltip: 'Remove from my cities',
    
    searchModalTitle: 'Search or Switch City',
    searchResults: 'Search Results',
    searchingDatabase: 'Searching Open-Meteo global database...',
    noCityFound: 'No matching cities found',
    tryDifferentQuery: 'Try searching with another spelling or language (e.g. Queens, New York, Taipei, Tokyo)',
    popularCitiesRecommend: 'Recommended Cities',
    currentSelected: 'Selected',
    select: 'Select',
    
    locationPermissionTitle: 'Allow "Weather" to access this device\'s location?',
    locationPermissionDesc: 'To provide accurate local weather, precipitation radar alerts, and air quality indices, we require device location access.',
    permissionPreciseLocation: 'Precise Location (GPS & Network)',
    permissionWhileUsing: 'Only while using the app',
    allowWhileUsing: 'Allow while using app',
    denyPermission: 'Don\'t Allow (Manual Search)',
    preciseLocationText: 'Precise Location (GPS & Network)',
    onlyWhileUsingText: 'Only while using the app',
    allowWhileUsingBtn: 'Allow while using app',
    denyBtn: 'Don\'t Allow (Manual Search)',
    
    adMobBanner: 'Google AdMob Banner',
    adMobBannerTag: 'Google AdMob Banner',
    adMobTestReady: '(Ad Slot Ready)',
    adMobUnitSlot: 'Ad Unit Slot',
    adUnitReserved: 'Ad Slot Reserved',
    adMobContentTitle: 'Google AdMob Sponsored',
    adMobContentDesc: 'Auto-loads premium sponsored content upon live deployment',
    adLoadingPrompt: 'High-yield sponsored ads will display upon launch',
    adMobViewBtn: 'View',
    view: 'View',
    adMobNative: 'Google AdMob Native Slot',
    adMobNativeTag: 'Google AdMob Native / Rectangle',
    adMobNativeTitle: 'Google AdMob Native Slot',
    adMobNativeDesc: 'Mapped to AdView & AdSize.MEDIUM_RECTANGLE in Android Kotlin',
    
    locateSuccess: 'Successfully located your current position',
    locateFail: 'Unable to get GPS location. Please check location permissions.',
  },
};

/**
 * Weather condition i18n mapping
 */
export const WEATHER_CONDITIONS_EN: Record<number, { label: string; description: string }> = {
  0: { label: 'Clear Sky', description: 'Cloudless sky with bright sunshine' },
  1: { label: 'Mainly Clear', description: 'Mainly sunny with occasional light clouds' },
  2: { label: 'Partly Cloudy', description: 'Partly cloudy with pleasant breezes' },
  3: { label: 'Overcast', description: 'Overcast skies throughout the day' },
  45: { label: 'Fog', description: 'Ground fog, drive carefully' },
  48: { label: 'Depositing Fog', description: 'Dense fog with low visibility' },
  51: { label: 'Light Drizzle', description: 'Gentle drizzle, carrying an umbrella is advised' },
  53: { label: 'Moderate Drizzle', description: 'Continuous fine rain' },
  55: { label: 'Dense Drizzle', description: 'Heavy drizzle falling' },
  61: { label: 'Slight Rain', description: 'Light rainfall, bring an umbrella' },
  63: { label: 'Moderate Rain', description: 'Steady rainfall, watch for puddles' },
  65: { label: 'Heavy Rain', description: 'Heavy downpour, drive with caution' },
  71: { label: 'Slight Snow', description: 'Gentle snowflakes falling' },
  73: { label: 'Moderate Snow', description: 'Continuous snowfall accumulating' },
  75: { label: 'Heavy Snow', description: 'Heavy snowfall, keep warm' },
  77: { label: 'Snow Grains', description: 'Scattered snow grains or graupel' },
  80: { label: 'Slight Rain Showers', description: 'Brief passing showers' },
  81: { label: 'Moderate Showers', description: 'Moderate rain showers' },
  82: { label: 'Violent Showers', description: 'Heavy torrential downpour' },
  85: { label: 'Slight Snow Showers', description: 'Occasional snow flurries' },
  86: { label: 'Heavy Snow Showers', description: 'Intense snow showers' },
  95: { label: 'Thunderstorm', description: 'Thunderstorm with heavy precipitation' },
  96: { label: 'Thunderstorm with Hail', description: 'Thunderstorm accompanied by small hail' },
  99: { label: 'Severe Thunderstorm with Hail', description: 'Severe thunderstorm with large hail' },
};

/**
 * Wind directions i18n
 */
export const WIND_DIRECTIONS_EN = [
  'North (N)',
  'North-Northeast (NNE)',
  'Northeast (NE)',
  'East-Northeast (ENE)',
  'East (E)',
  'East-Southeast (ESE)',
  'Southeast (SE)',
  'South-Southeast (SSE)',
  'South (S)',
  'South-Southwest (SSW)',
  'Southwest (SW)',
  'West-Southwest (WSW)',
  'West (W)',
  'West-Northwest (WNW)',
  'Northwest (NW)',
  'North-Northwest (NNW)',
];

export const WIND_DIRECTIONS_ZH = [
  '北風 (N)',
  '東北北 (NNE)',
  '東北 (NE)',
  '東北東 (ENE)',
  '東風 (E)',
  '東南東 (ESE)',
  '東南 (SE)',
  '東南南 (SSE)',
  '南風 (S)',
  '西南南 (SSW)',
  '西南 (SW)',
  '西南西 (WSW)',
  '西風 (W)',
  '西北西 (WNW)',
  '西北 (NW)',
  '西北北 (NNW)',
];
