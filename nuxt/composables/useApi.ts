import type { ApiResponse } from '~/types/api';

export function useApi() {
  const { $api } = useNuxtApp();

  return async <T>(path: string, options?: Parameters<typeof $api>[1]): Promise<T> => {
    const response = await $api<ApiResponse<T>>(path, options);
    return response.data;
  };
}
