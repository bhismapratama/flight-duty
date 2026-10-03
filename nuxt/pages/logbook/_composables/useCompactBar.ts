const BAR_SPACE = 60;

export function useCompactBar(target: Readonly<Ref<HTMLElement | null>>) {
  const visible = ref(false);
  const offset = ref(0);
  let observer: IntersectionObserver | undefined;

  function observe(element: HTMLElement | null): void {
    observer?.disconnect();
    visible.value = false;
    if (!element) {
      return;
    }
    const headerBottom =
      document.querySelector('.page-header')?.getBoundingClientRect().bottom ?? 0;
    offset.value = headerBottom;
    const edge = Math.round(headerBottom + BAR_SPACE);
    observer = new IntersectionObserver(
      ([entry]) => {
        visible.value = Boolean(
          entry && !entry.isIntersecting && entry.boundingClientRect.top < edge,
        );
      },
      { rootMargin: `-${edge}px 0px 0px 0px` },
    );
    observer.observe(element);
  }

  onMounted(() => {
    watch(target, observe, { immediate: true });
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
  });

  return { visible, offset };
}
