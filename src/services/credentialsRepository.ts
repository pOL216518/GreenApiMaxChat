import type { Credentials } from '../domain/types';
import { defaultStorage, type KeyValueStorage } from './storage';

const KEY = 'max-chat:credentials';

function isCredentials(value: unknown): value is Credentials {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.apiUrl === 'string' &&
    typeof v.idInstance === 'string' &&
    typeof v.apiTokenInstance === 'string'
  );
}

export class CredentialsRepository {
  private readonly storage: KeyValueStorage;

  constructor(storage: KeyValueStorage = defaultStorage) {
    this.storage = storage;
  }

  load(): Credentials | null {
    const value = this.storage.get(KEY);
    return isCredentials(value) ? value : null;
  }

  save(credentials: Credentials): void {
    this.storage.set(KEY, credentials);
  }

  clear(): void {
    this.storage.remove(KEY);
  }
}
