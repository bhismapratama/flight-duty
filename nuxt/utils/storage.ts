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
    return readLocal(TOKEN_KEY);
  },
  async set(token: string): Promise<void> {
    writeLocal(TOKEN_KEY, token);
  },
  async remove(): Promise<void> {
    writeLocal(TOKEN_KEY, null);
  },
};
