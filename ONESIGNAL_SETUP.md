# OneSignal Push Notifications Setup Instructions

I've integrated OneSignal into your Next.js application. Follow these steps to complete the setup:

## Step 1: Create OneSignal Account
1. Go to [onesignal.com](https://onesignal.com) and create a free account
2. Click "New App/Website" and choose **Web** platform
3. Select "Typical Site" integration

## Step 2: Get Your App ID
1. Navigate to **Settings → Keys & IDs** in your OneSignal dashboard
2. Copy your **OneSignal App ID** (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)

## Step 3: Download Service Worker Files
1. In OneSignal dashboard, go to **Settings → Platforms → Web**
2. Download these two files:
   - `OneSignalSDKWorker.js`
   - `OneSignalSDKUpdaterWorker.js`
3. Place both files in your project's `/public` folder

## Step 4: Add Environment Variable
Create or update your `.env.local` file with:
```
NEXT_PUBLIC_ONESIGNAL_APP_ID=your-actual-app-id-here
```

## Step 5: Configure Site Settings in OneSignal
1. In OneSignal dashboard, go to **Settings → Platforms → Web**
2. Set your site URL:
   - For development: Use `http://localhost:3000` and enable "Local Testing"
   - For production: Use your actual domain (must be HTTPS)

## Step 6: Test the Integration
1. Restart your development server: `npm run dev`
2. Visit `http://localhost:3000`
3. You should see a notification permission prompt
4. Click "Allow" to subscribe
5. Verify in OneSignal dashboard under **Audience** - you should see 1 subscriber

## Step 7: Send Test Notification
1. Go to OneSignal dashboard → **Messages → New Push**
2. Create a test message
3. Send to all subscribers
4. Check your browser for the notification

## Troubleshooting

### Service Worker Files Not Found (404 Error)
- Make sure both files are in the `/public` folder (not `/public/static`)
- File names must match exactly
- Restart your development server

### "window is not defined" Error
The code is already wrapped in client-side checks, but if you see this:
- Clear browser cache
- Restart development server

### No Subscribers Showing Up
- Make sure you're not in Incognito/Private browsing mode
- Check browser console for errors
- Verify service worker files are accessible at:
  - `http://localhost:3000/OneSignalSDKWorker.js`
  - `http://localhost:3000/OneSignalSDKUpdaterWorker.js`

### Double Initialization in Development
This is normal with React Strict Mode in development. It won't happen in production.

## Advanced Features

### Set User Tags (for segmentation)
```javascript
import { setUserTag } from '@/lib/onesignal';

// Example: Tag users based on their activity
setUserTag('user_type', 'premium');
setUserTag('language', 'en');
```

### Set User ID (link to your backend)
```javascript
import { setUserId } from '@/lib/onesignal';

// After user logs in
setUserId('user_123');
```

### Trigger Subscription Prompt Manually
```javascript
import { subscribeUser } from '@/lib/onesignal';

// Call this when user clicks a "Enable Notifications" button
subscribeUser();
```

## Production Deployment

Before deploying to production:
1. Update OneSignal site URL to your production domain
2. Disable "Local Testing" in OneSignal settings
3. Ensure your site uses HTTPS (required for web push)
4. Test notifications on production URL before going live

## Resources
- [OneSignal Documentation](https://documentation.onesignal.com/)
- [OneSignal Web SDK Reference](https://documentation.onesignal.com/docs/web-push-sdk)
- [OneSignal React Guide](https://documentation.onesignal.com/docs/react-js-setup)

## Need Help?
- Check OneSignal Dashboard → **Settings → Debugging**
- Visit OneSignal support at [onesignal.com/support](https://onesignal.com/support)
- Check browser console for error messages
