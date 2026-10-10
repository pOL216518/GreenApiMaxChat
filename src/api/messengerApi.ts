import type {
  CheckAccountResponse,
  InstanceState,
  Notification,
  SendMessageResponse,
} from './greenApi.types';

/**Контракт мессенджер-API, от которого зависит приложение.*/
export interface MessengerApi {
  getState(signal?: AbortSignal): Promise<InstanceState>;
  checkAccount(phone: string): Promise<CheckAccountResponse>;
  sendMessage(chatId: string, message: string): Promise<SendMessageResponse>;
  receiveNotification(signal?: AbortSignal): Promise<Notification | null>;
  deleteNotification(receiptId: number): Promise<void>;
}
