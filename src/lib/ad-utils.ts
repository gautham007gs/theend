import type { AdSettings } from '@/types';
import { defaultAdSettings, DEFAULT_ADSTERRA_DIRECT_LINK, DEFAULT_MONETAG_DIRECT_LINK } from '@/config/ai';

const APP_ADS_DAILY_COUNT_KEY = 'app_ads_daily_count_kruthika_chat';
const APP_ADS_LAST_SHOWN_DATE_KEY = 'app_ads_last_shown_date_kruthika_chat';
const APP_ADS_SESSION_COUNT_KEY = 'app_ads_session_count_kruthika_chat';
const APP_ADS_LAST_SHOWN_NETWORK_KEY = 'app_ads_last_shown_network_kruthika_chat';

export const tryShowRotatedAd = (activeAdSettings: AdSettings | null): boolean => {
  if (typeof window === 'undefined' || !activeAdSettings || !activeAdSettings.adsEnabledGlobally) {
    return false;
  }

  const todayStr = new Date().toDateString();
  const lastShownDate = localStorage.getItem(APP_ADS_LAST_SHOWN_DATE_KEY);
  let currentDailyCount = parseInt(localStorage.getItem(APP_ADS_DAILY_COUNT_KEY) || '0', 10);
  let currentSessionCount = parseInt(sessionStorage.getItem(APP_ADS_SESSION_COUNT_KEY) || '0', 10);

  if (lastShownDate !== todayStr) {
    currentDailyCount = 0;
    localStorage.setItem(APP_ADS_LAST_SHOWN_DATE_KEY, todayStr);
    currentSessionCount = 0;
    sessionStorage.setItem(APP_ADS_SESSION_COUNT_KEY, '0');
  }
  localStorage.setItem(APP_ADS_DAILY_COUNT_KEY, currentDailyCount.toString());

  // Use limits from AdSettings
  const maxAdsPerDay = activeAdSettings.maxDirectLinkAdsPerDay ?? defaultAdSettings.maxDirectLinkAdsPerDay;
  const maxAdsPerSession = activeAdSettings.maxDirectLinkAdsPerSession ?? defaultAdSettings.maxDirectLinkAdsPerSession;

  // Check user engagement before showing ads
  const userEngagement = localStorage.getItem('user_engagement_score') || '0.5';
  const engagementScore = parseFloat(userEngagement);
  
  // Higher engagement users see more ads (they're more likely to click)
  const adjustedMaxSession = engagementScore > 0.7 ? maxAdsPerSession + 1 : maxAdsPerSession;
  const adjustedMaxDaily = engagementScore > 0.8 ? maxAdsPerDay + 2 : maxAdsPerDay;
  
  if (currentSessionCount >= adjustedMaxSession || currentDailyCount >= adjustedMaxDaily) {
    return false;
  }

  const lastShownNetwork = localStorage.getItem(APP_ADS_LAST_SHOWN_NETWORK_KEY);
  let networkToTry: 'adsterra' | 'monetag' | null = null;
  let adLinkToShow: string | null = null;

  const adsterraDirectEnabled = activeAdSettings.adsterraDirectLinkEnabled;
  const monetagDirectEnabled = activeAdSettings.monetagDirectLinkEnabled;

  const adsterraLink = activeAdSettings.adsterraDirectLink;
  const monetagLink = activeAdSettings.monetagDirectLink;

  if (!adsterraDirectEnabled && !monetagDirectEnabled) {
    console.warn("Ad display: No direct link networks enabled in settings.");
    return false;
  }

  if (adsterraDirectEnabled && monetagDirectEnabled) {
    networkToTry = lastShownNetwork === 'adsterra' ? 'monetag' : 'adsterra';
  } else if (adsterraDirectEnabled) {
    networkToTry = 'adsterra';
  } else if (monetagDirectEnabled) {
    networkToTry = 'monetag';
  }

  if (networkToTry === 'adsterra') {
    adLinkToShow = adsterraLink;
  } else if (networkToTry === 'monetag') {
    adLinkToShow = monetagLink;
  }

  const isValidLink = (link: string | null | undefined): boolean => !!link && (link.startsWith('http://') || link.startsWith('https://')) && link !== DEFAULT_ADSTERRA_DIRECT_LINK && link !== DEFAULT_MONETAG_DIRECT_LINK && !link.toLowerCase().includes("placeholder");

  if (!isValidLink(adLinkToShow)) {
    console.warn(`Ad display: ${networkToTry} direct link is not valid or is placeholder: ${adLinkToShow}`);
    return false;
  }

  try {
    if (adLinkToShow) {
      window.open(adLinkToShow, '_blank', 'noopener,noreferrer');
      console.log(`Ad display: Opened ${networkToTry} direct link: ${adLinkToShow}`);
    }
  } catch (error) {
    console.error(`Ad display: Error opening ${networkToTry} link:`, error);
    return false;
  }

  // Update counters only on successful ad display
  currentDailyCount++;
  localStorage.setItem(APP_ADS_DAILY_COUNT_KEY, currentDailyCount.toString());
  currentSessionCount++;
  sessionStorage.setItem(APP_ADS_SESSION_COUNT_KEY, currentSessionCount.toString());
  if (networkToTry) localStorage.setItem(APP_ADS_LAST_SHOWN_NETWORK_KEY, networkToTry);
  return true;
};