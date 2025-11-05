import OneSignal from 'react-onesignal';

export const initOneSignal = async () => {
  try {
    await OneSignal.init({ 
      appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || 'YOUR_ONESIGNAL_APP_ID',
      allowLocalhostAsSecureOrigin: true,
    });
    
    console.log('OneSignal initialized successfully');
  } catch (error) {
    console.error('OneSignal initialization error:', error);
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
