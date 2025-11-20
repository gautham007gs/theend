import OneSignal from 'react-onesignal';

export const initOneSignal = async () => {
  try {
    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    
    if (!appId || appId === 'YOUR_ONESIGNAL_APP_ID') {
      console.error('⚠️ OneSignal App ID not configured! Check your .env.local file');
      return;
    }
    
    console.log('🔄 Initializing OneSignal with App ID:', appId.substring(0, 8) + '...');
    
    await OneSignal.init({ 
      appId: appId,
      allowLocalhostAsSecureOrigin: true,
      serviceWorkerPath: '/OneSignalSDKWorker.js',
      serviceWorkerUpdaterPath: '/OneSignalSDKWorker.js',
    });
    
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
