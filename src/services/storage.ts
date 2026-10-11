export interface KeyValueStorage {
  get(key: string): unknown;
  set(key: string, value: unknown): void;
  remove(key: string): void;
}

export class LocalStorageAdapter implements KeyValueStorage {
  get(key: string): unknown {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? null : (JSON.parse(raw) as unknown);
    } catch {
      return null;
    }
  }

  set(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Не удалось сохранить данные в localStorage', error);
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // хранилище недоступно
    }
  }
}

export const defaultStorage: KeyValueStorage = new LocalStorageAdapter();
