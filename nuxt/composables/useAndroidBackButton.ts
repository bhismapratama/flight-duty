import { App } from '@capacitor/app';
import type { PluginListenerHandle } from '@capacitor/core';

const EXIT_PATHS = ['/home', '/login'];

export function useAndroidBackButton(): void {
  const router = useRouter();
  const route = useRoute();
  let handle: PluginListenerHandle | null = null;

  onMounted(async () => {
    handle = await App.addListener('backButton', ({ canGoBack }) => {
      if (EXIT_PATHS.includes(route.path)) {
        App.exitApp();
      } else if (canGoBack) {
        router.back();
      } else {
        router.replace('/home');
      }
    });
  });

  onBeforeUnmount(() => {
    handle?.remove();
  });
}
