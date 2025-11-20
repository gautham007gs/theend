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

    // Skip OneSignal on non-production domains to avoid domain mismatch
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    const isProduction = hostname === 'kruthika.fun' || hostname === 'www.kruthika.fun';
    const isReplit = hostname.includes('replit.dev') || hostname.includes('replit.app');
    
    if (!isProduction && !isReplit) {
      console.warn('⚠️ OneSignal skipped: Only works on kruthika.fun or Replit domains');
      return;
    }

    // For Replit, only init if explicitly enabled
    if (isReplit && !process.env.NEXT_PUBLIC_ENABLE_ONESIGNAL_ON_REPLIT) {
      console.log('ℹ️ OneSignal disabled on Replit. Set NEXT_PUBLIC_ENABLE_ONESIGNAL_ON_REPLIT=true to enable.');
      return;
    }
    
    console.log('🔄 Initializing OneSignal with App ID:', appId.substring(0, 8) + '...');
    
    await OneSignal.init({ 
      appId: appId,
      allowLocalhostAsSecureOrigin: true,
      serviceWorkerPath: '/OneSignalSDKWorker.js',
      serviceWorkerUpdaterPath: '/OneSignalSDKWorker.js',
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
    await OneSignal.Slidedown.promptPush();
  } catch (error) {
    console.error('OneSignal subscription error:', error);
  }
};

export const setUserTag = async (key: string, value: string) => {
  try {
    await OneSignal.User.addTag(key, value);
  } catch (error) {
    console.error('OneSignal tag error:', error);
  }
};

export const setUserId = async (userId: string) => {
  try {
    await OneSignal.login(userId);
  } catch (error) {
    console.error('OneSignal login error:', error);
  }
};
