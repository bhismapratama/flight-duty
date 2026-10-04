import { StatusBar, Style } from '@capacitor/status-bar';

function drawsBehindStatusBar(): boolean {
  const inset = getComputedStyle(document.documentElement).getPropertyValue(
    '--safe-area-inset-top',
  );
  return Number.parseFloat(inset) > 0;
}

export function useStatusBar(): void {
  const route = useRoute();

  const apply = () => {
    const lightIcons = !drawsBehindStatusBar() || route.meta.darkHeader === true;
    StatusBar.setStyle({ style: lightIcons ? Style.Dark : Style.Light }).catch(() => undefined);
  };

  watch(() => route.path, apply, { immediate: true });
  onMounted(() => {
    window.setTimeout(apply, 600);
  });
}
