import { Preferences } from '@capacitor/preferences';
import { isNativePlatform } from './platform';

const TOKEN_KEY = 'susi-air.access-token';

function readLocal(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocal(key: string, value: string | null): void {
  try {
    if (value === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, value);
    }
  } catch {
    return;
  }
}

export const tokenStorage = {
  async get(): Promise<string | null> {
    if (isNativePlatform()) {
      const { value } = await Preferences.get({ key: TOKEN_KEY });
      return value;
    }
    return readLocal(TOKEN_KEY);
  },
  async set(token: string): Promise<void> {
    if (isNativePlatform()) {
      await Preferences.set({ key: TOKEN_KEY, value: token });
      return;
    }
    writeLocal(TOKEN_KEY, token);
  },
  async remove(): Promise<void> {
    if (isNativePlatform()) {
      await Preferences.remove({ key: TOKEN_KEY });
      return;
    }
    writeLocal(TOKEN_KEY, null);
  },
};
