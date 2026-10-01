import { defineStore } from 'pinia';
import type { ApiResponse } from '~/types/api';
import type { LoginRequest, LoginResult } from '~/types/entities/auth';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null);
  const restored = ref(false);

  const isAuthenticated = computed(() => Boolean(token.value));

  async function restore(): Promise<void> {
    if (restored.value) {
      return;
    }
    token.value = await tokenStorage.get();
    restored.value = true;
  }

  async function login(credentials: LoginRequest): Promise<void> {
    const { $api } = useNuxtApp();
    const response = await $api<ApiResponse<LoginResult>>('/auth/login', {
      method: 'POST',
      body: credentials,
    });
    token.value = response.data.accessToken;
    await tokenStorage.set(response.data.accessToken);
  }

  async function logout(): Promise<void> {
    token.value = null;
    await tokenStorage.remove();
    usePilotStore().clear();
    clearNuxtData();
  }

  return { token, restored, isAuthenticated, restore, login, logout };
});
