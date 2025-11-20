
import OneSignal from 'react-onesignal';

let isOneSignalInitialized = false;

export const initOneSignal = async () => {
  try {
    // Prevent double initialization
    if (isOneSignalInitialized) {
      console.log('ℹ️ OneSignal already initialized, skipping...');
      return;
    }

    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    
    if (!appId || appId === 'YOUR_ONESIGNAL_APP_ID') {
      console.warn('⚠️ OneSignal App ID not configured! Check your .env.local file');
      return;
    }

    // Allow OneSignal on production domain and Replit dev domains
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    const isProduction = hostname === 'kruthika.fun' || hostname === 'www.kruthika.fun';
    const isReplit = hostname.includes('replit.dev') || hostname.includes('replit.app') || hostname.includes('picard.replit.dev');
    
    // Allow on production OR Replit dev domains for testing
    if (!isProduction && !isReplit) {
      console.log('ℹ️ OneSignal disabled on this domain. Will only work on kruthika.fun or Replit dev domains');
      return;
    }
    
    console.log('🌍 Running on:', isProduction ? 'Production' : 'Replit Dev Environment');
    
    console.log('🔄 Initializing OneSignal with App ID:', appId.substring(0, 8) + '...');
    
    await OneSignal.init({ 
      appId: appId,
      allowLocalhostAsSecureOrigin: true, // Allow testing on dev environments
      serviceWorkerPath: '/OneSignalSDKWorker.js',
      serviceWorkerUpdaterPath: '/OneSignalSDKUpdaterWorker.js',
    });
    
    isOneSignalInitialized = true;
    
    console.log('✅ OneSignal initialized successfully');
    console.log('📱 Notification permission status:', Notification.permission);
    
    // Check if permission is already granted
    if (Notification.permission === 'granted') {
      console.log('✅ Notifications already enabled');
    } else if (Notification.permission === 'default') {
      console.log('ℹ️ User can be prompted for notification permission');
    } else {
      console.log('❌ Notification permission denied');
    }
  } catch (error) {
    console.error('❌ OneSignal initialization error:', error);
    isOneSignalInitialized = false;
  }
};

export const subscribeUser = async () => {
  try {
    if (!isOneSignalInitialized) {
      console.warn('⚠️ OneSignal not initialized. Cannot subscribe user.');
      return;
    }
    await OneSignal.Slidedown.promptPush();
  } catch (error) {
    console.error('OneSignal subscription error:', error);
  }
};

export const setUserTag = async (key: string, value: string) => {
  try {
    if (!isOneSignalInitialized) {
      console.warn('⚠️ OneSignal not initialized. Cannot set user tag.');
      return;
    }
    await OneSignal.User.addTag(key, value);
  } catch (error) {
    console.error('OneSignal tag error:', error);
  }
};

export const setUserId = async (userId: string) => {
  try {
    if (!isOneSignalInitialized) {
      console.warn('⚠️ OneSignal not initialized. Cannot set user ID.');
      return;
    }
    await OneSignal.login(userId);
  } catch (error) {
    console.error('OneSignal login error:', error);
  }
};
