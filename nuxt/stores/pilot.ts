import { defineStore } from 'pinia';
import type { AsyncStatus } from '~/types/api';
import type { PilotProfile } from '~/types/entities/pilot';

export const usePilotStore = defineStore('pilot', () => {
  const profile = ref<PilotProfile | null>(null);
  const status = ref<AsyncStatus>('idle');
  const errorMessage = ref<string | null>(null);
  let inFlight: Promise<PilotProfile | null> | null = null;

  const today = computed(() => profile.value?.today ?? null);

  async function fetchProfile(force = false): Promise<PilotProfile | null> {
    if (profile.value && !force) {
      return profile.value;
    }
    if (inFlight) {
      return inFlight;
    }

    const api = useApi();
    status.value = 'pending';
    errorMessage.value = null;

    inFlight = api<PilotProfile>('/pilot/me')
      .then(result => {
        profile.value = result;
        status.value = 'success';
        return result;
      })
      .catch((error: unknown) => {
        status.value = 'error';
        errorMessage.value = getErrorMessage(error);
        return null;
      })
      .finally(() => {
        inFlight = null;
      });

    return inFlight;
  }

  function clear(): void {
    profile.value = null;
    status.value = 'idle';
    errorMessage.value = null;
  }

  return { profile, status, errorMessage, today, fetchProfile, clear };
});
