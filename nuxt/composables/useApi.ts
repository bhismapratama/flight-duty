import type { FetchOptions } from 'ofetch';
import type { ApiResponse } from '~/types/api';

export function useApi() {
  const { $api } = useNuxtApp();

  return async <T>(path: string, options?: FetchOptions<'json'>): Promise<T> => {
    const response = await $api<ApiResponse<T>>(path, options);
    return response.data;
  };
}
