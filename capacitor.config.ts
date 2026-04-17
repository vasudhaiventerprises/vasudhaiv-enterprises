import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vasudhaiv.solar',
  appName: 'Vasudhaiv Solar',
  webDir: 'public', // Unused dynamically since we point to a server URL
  server: {
    url: 'https://vasudhaiv-enterprises.vercel.app',
    cleartext: true
  },
  android: {
    backgroundColor: '#020617'
  }
};

export default config;
