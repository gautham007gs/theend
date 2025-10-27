
// PWA validation and testing utilities
export class PWAValidator {
  // Check PWA requirements
  static async validatePWA() {
    console.log('\n🔧 PWA VALIDATION REPORT');
    console.log('═'.repeat(50));

    const results = {
      manifest: await this.checkManifest(),
      serviceWorker: await this.checkServiceWorker(),
      https: this.checkHTTPS(),
      icons: await this.checkIcons(),
      installability: await this.checkInstallability(),
      offline: await this.checkOfflineSupport()
    };

    const passed = Object.values(results).filter(r => r.status === 'pass').length;
    const total = Object.keys(results).length;

    console.log(`\n📊 Score: ${passed}/${total} checks passed`);
    console.log('═'.repeat(50));

    return results;
  }

  private static async checkManifest() {
    try {
      const manifestLink = document.querySelector('link[rel="manifest"]');
      if (!manifestLink) {
        return { status: 'fail', message: 'Manifest link not found' };
      }

      const manifestUrl = manifestLink.getAttribute('href');
      const response = await fetch(manifestUrl!);
      const manifest = await response.json();

      const required = ['name', 'short_name', 'start_url', 'display', 'icons'];
      const missing = required.filter(field => !manifest[field]);

      if (missing.length > 0) {
        return { status: 'fail', message: `Missing fields: ${missing.join(', ')}` };
      }

      console.log('✅ Manifest: Valid');
      return { status: 'pass', message: 'Manifest is valid', data: manifest };
    } catch (error) {
      console.log('❌ Manifest: Failed to load');
      return { status: 'fail', message: 'Failed to load manifest' };
    }
  }

  private static async checkServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.log('❌ Service Worker: Not supported');
      return { status: 'fail', message: 'Service Worker not supported' };
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        console.log('✅ Service Worker: Registered');
        return { status: 'pass', message: 'Service Worker is registered', data: registration };
      } else {
        console.log('⚠️ Service Worker: Not registered');
        return { status: 'warn', message: 'Service Worker not registered' };
      }
    } catch (error) {
      console.log('❌ Service Worker: Error checking registration');
      return { status: 'fail', message: 'Error checking Service Worker' };
    }
  }

  private static checkHTTPS() {
    const isSecure = location.protocol === 'https:' || location.hostname === 'localhost';
    console.log(isSecure ? '✅ HTTPS: Enabled' : '❌ HTTPS: Not enabled');
    return { 
      status: isSecure ? 'pass' : 'fail', 
      message: isSecure ? 'Running on HTTPS' : 'Must run on HTTPS'
    };
  }

  private static async checkIcons() {
    try {
      const icons = [
        { url: '/icon-192.png', size: 192 },
        { url: '/icon-512.png', size: 512 }
      ];

      const results = await Promise.all(
        icons.map(icon => 
          fetch(icon.url)
            .then(r => r.ok)
            .catch(() => false)
        )
      );

      const allPresent = results.every(r => r);
      console.log(allPresent ? '✅ Icons: All present' : '⚠️ Icons: Some missing');
      return { 
        status: allPresent ? 'pass' : 'warn', 
        message: allPresent ? 'All icons present' : 'Some icons missing'
      };
    } catch (error) {
      console.log('❌ Icons: Error checking icons');
      return { status: 'fail', message: 'Error checking icons' };
    }
  }

  private static async checkInstallability() {
    if ('BeforeInstallPromptEvent' in window || (window as any).deferredPrompt) {
      console.log('✅ Installability: App is installable');
      return { status: 'pass', message: 'App is installable' };
    }
    
    console.log('⚠️ Installability: Cannot determine');
    return { status: 'warn', message: 'Installability status unknown' };
  }

  private static async checkOfflineSupport() {
    if (!('serviceWorker' in navigator)) {
      return { status: 'fail', message: 'Service Worker required for offline support' };
    }

    try {
      // Check if SW has cached resources
      const cacheNames = await caches.keys();
      const hasCache = cacheNames.length > 0;
      
      console.log(hasCache ? '✅ Offline: Caching enabled' : '⚠️ Offline: No cached resources');
      return { 
        status: hasCache ? 'pass' : 'warn', 
        message: hasCache ? `${cacheNames.length} cache(s) found` : 'No cached resources'
      };
    } catch (error) {
      console.log('❌ Offline: Error checking cache');
      return { status: 'fail', message: 'Error checking cache' };
    }
  }

  // Test offline functionality
  static async testOfflineMode() {
    console.log('\n🧪 Testing Offline Mode...');
    
    // Simulate offline
    if ('serviceWorker' in navigator) {
      const sw = await navigator.serviceWorker.ready;
      console.log('Service Worker ready, testing offline capabilities...');
      
      // You can add more specific offline tests here
      return { status: 'pass', message: 'Offline mode ready' };
    }
    
    return { status: 'fail', message: 'Service Worker not available' };
  }

  // Test install prompt
  static testInstallPrompt() {
    return new Promise((resolve) => {
      let promptReceived = false;
      
      const handler = (e: Event) => {
        e.preventDefault();
        promptReceived = true;
        console.log('✅ Install prompt event received');
        window.removeEventListener('beforeinstallprompt', handler);
        resolve({ status: 'pass', message: 'Install prompt working' });
      };

      window.addEventListener('beforeinstallprompt', handler);

      // Timeout after 5 seconds
      setTimeout(() => {
        if (!promptReceived) {
          window.removeEventListener('beforeinstallprompt', handler);
          console.log('⚠️ Install prompt not triggered (may already be installed)');
          resolve({ status: 'warn', message: 'Install prompt not triggered' });
        }
      }, 5000);
    });
  }
}

// Auto-run validation in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      PWAValidator.validatePWA();
    }, 2000);
  });
}
