import { ofetch } from 'ofetch';

const REQUEST_TIMEOUT_MS = 15_000;

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const auth = useAuthStore();

  const api = ofetch.create({
    baseURL: config.public.apiBase,
    retry: 0,
    timeout: REQUEST_TIMEOUT_MS,
    onRequest({ options }) {
      if (auth.token) {
        options.headers.set('Authorization', `Bearer ${auth.token}`);
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401 && auth.token) {
        await auth.logout();
        await navigateTo('/login', { replace: true });
      }
    },
  });

  return {
    provide: { api },
  };
});
