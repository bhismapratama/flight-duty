import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const allowLocalHttpApi = process.env.CAP_LOCAL_HTTP_API === 'true';

const config: CapacitorConfig = {
  appId: 'com.susiair.pilot',
  appName: 'Susi Air Pilot',
  webDir: '.output/public',
  backgroundColor: '#0E2138',
  android: {
    allowMixedContent: allowLocalHttpApi,
  },
  plugins: {
    SystemBars: {
      insetsHandling: 'css',
      initialViewportFitValueHint: 'cover',
    },
    Keyboard: {
      resize: KeyboardResize.Native,
      resizeOnFullScreen: true,
    },
  },
};

export default config;
