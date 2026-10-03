export function useResponseCache() {
  const entries = useState<Record<string, unknown>>('response-cache', () => ({}));

  function read<T>(key: string): T | undefined {
    return entries.value[key] as T | undefined;
  }

  async function store<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const value = await fetcher();
    entries.value[key] = value;
    return value;
  }

  function load<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const hit = read<T>(key);
    return hit === undefined ? store(key, fetcher) : Promise.resolve(hit);
  }

  function prefetch<T>(key: string, fetcher: () => Promise<T>): void {
    if (read(key) === undefined) {
      store(key, fetcher).catch(() => undefined);
    }
  }

  return { read, store, load, prefetch };
}
