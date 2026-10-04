import { App } from '@capacitor/app';
import type { PluginListenerHandle } from '@capacitor/core';
import { ROUTES } from '~/constants/routes';

export function useAndroidBackButton(): void {
  const router = useRouter();
  const route = useRoute();
  let handle: PluginListenerHandle | null = null;

  onMounted(async () => {
    handle = await App.addListener('backButton', ({ canGoBack }) => {
      if (route.meta.exitOnBack) {
        App.exitApp();
      } else if (canGoBack) {
        router.back();
      } else {
        router.replace(ROUTES.home);
      }
    });
  });

  onBeforeUnmount(() => {
    handle?.remove();
  });
}
