import { SplashScreen } from '@capacitor/splash-screen';

export function useSplashScreen(): void {
  useNuxtApp().hooks.hookOnce('page:finish', () => {
    SplashScreen.hide().catch(() => undefined);
  });
}
