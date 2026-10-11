import type { ChatState } from '../store/chatReducer';
import { defaultStorage, type KeyValueStorage } from './storage';

function isChatState(value: unknown): value is ChatState {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return Array.isArray(v.chats) && typeof v.messages === 'object' && v.messages !== null;
}

/** Хранит историю чатов отдельно для каждого инстанса. */
export class ChatRepository {
  private readonly storage: KeyValueStorage;

  constructor(storage: KeyValueStorage = defaultStorage) {
    this.storage = storage;
  }

  load(idInstance: string): ChatState | null {
    const value = this.storage.get(this.key(idInstance));
    return isChatState(value) ? value : null;
  }

  save(idInstance: string, state: ChatState): void {
    this.storage.set(this.key(idInstance), state);
  }

  private key(idInstance: string): string {
    return `max-chat:chats:${idInstance}`;
  }
}
