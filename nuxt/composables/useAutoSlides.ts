export function useAutoSlides(sources: string[], interval: number) {
  const active = ref(0);
  const ready = ref<number[]>([0]);
  let timer: ReturnType<typeof setInterval> | undefined;
  let advancing = false;
  let reducedMotion: MediaQueryList | undefined;

  function preload(index: number): Promise<void> {
    const image = new Image();
    image.src = sources[index]!;
    return image.decode().catch(() => undefined);
  }

  async function advance(): Promise<void> {
    if (advancing) {
      return;
    }
    advancing = true;
    const next = (active.value + 1) % sources.length;
    if (!ready.value.includes(next)) {
      await preload(next);
      ready.value = [...ready.value, next];
    }
    active.value = next;
    advancing = false;
  }

  function stop(): void {
    clearInterval(timer);
    timer = undefined;
  }

  function sync(): void {
    stop();
    if (sources.length > 1 && !document.hidden && !reducedMotion?.matches) {
      timer = setInterval(advance, interval);
    }
  }

  onMounted(() => {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    sync();
  });

  onBeforeUnmount(() => {
    stop();
    reducedMotion?.removeEventListener('change', sync);
    document.removeEventListener('visibilitychange', sync);
  });

  return { active, isReady: (index: number) => ready.value.includes(index) };
}
