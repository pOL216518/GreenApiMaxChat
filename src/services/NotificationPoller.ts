import type { MessengerApi } from '../api/messengerApi';
import { parseNotification, type NotificationEvent } from '../domain/notificationParser';

export interface PollerHandlers {
  onEvent: (event: NotificationEvent) => void;
  onError?: (error: unknown) => void;
}

const RETRY_DELAY_MS = 3000;

function delay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });
}

export class NotificationPoller {
  private readonly api: MessengerApi;
  private controller: AbortController | null = null;

  constructor(api: MessengerApi) {
    this.api = api;
  }

  get isRunning(): boolean {
    return this.controller !== null;
  }

  start(handlers: PollerHandlers): void {
    if (this.controller) return;
    const controller = new AbortController();
    this.controller = controller;
    void this.loop(controller.signal, handlers);
  }

  stop(): void {
    this.controller?.abort();
    this.controller = null;
  }

  private async loop(signal: AbortSignal, { onEvent, onError }: PollerHandlers): Promise<void> {
    while (!signal.aborted) {
      try {
        const notification = await this.api.receiveNotification(signal);
        if (!notification) continue;

        try {
          const event = parseNotification(notification.body);
          if (event) onEvent(event);
        } finally {
          await this.api.deleteNotification(notification.receiptId);
        }
      } catch (error) {
        // stop() мог быть вызван во время await — TS не видит изменения signal.aborted.
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (signal.aborted) return;
        onError?.(error);
        await delay(RETRY_DELAY_MS, signal);
      }
    }
  }
}
