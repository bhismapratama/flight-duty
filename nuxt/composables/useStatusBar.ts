import { StatusBar, Style } from '@capacitor/status-bar';

const DARK_HEADER_PATHS = ['/home', '/login'];

function drawsBehindStatusBar(): boolean {
  const inset = getComputedStyle(document.documentElement).getPropertyValue(
    '--safe-area-inset-top',
  );
  return Number.parseFloat(inset) > 0;
}

export function useStatusBar(): void {
  const route = useRoute();

  const apply = () => {
    const lightIcons = !drawsBehindStatusBar() || DARK_HEADER_PATHS.includes(route.path);
    StatusBar.setStyle({ style: lightIcons ? Style.Dark : Style.Light }).catch(() => undefined);
  };

  watch(() => route.path, apply, { immediate: true });
  onMounted(() => {
    window.setTimeout(apply, 600);
  });
}
