import type { Credentials } from '../domain/types';
import type {
  CheckAccountResponse,
  DeleteNotificationResponse,
  InstanceState,
  Notification,
  SendMessageResponse,
  StateInstanceResponse,
} from './greenApi.types';
import { ApiError, FetchHttpClient, type HttpClient } from './httpClient';
import type { MessengerApi } from './messengerApi';

export const RECEIVE_TIMEOUT_SEC = 20;

export class GreenApiClient implements MessengerApi {
  private readonly credentials: Credentials;
  private readonly http: HttpClient;

  constructor(credentials: Credentials, http: HttpClient = new FetchHttpClient()) {
    this.credentials = credentials;
    this.http = http;
  }

  async getState(signal?: AbortSignal): Promise<InstanceState> {
    const data = await this.http.request<StateInstanceResponse>({
      method: 'GET',
      url: this.url('getStateInstance'),
      signal,
    });
    return this.required(data).stateInstance;
  }

  async checkAccount(phone: string): Promise<CheckAccountResponse> {
    const data = await this.http.request<CheckAccountResponse>({
      method: 'POST',
      url: this.url('checkAccount'),
      body: { phoneNumber: Number(phone) },
    });
    return this.required(data);
  }

  async sendMessage(chatId: string, message: string): Promise<SendMessageResponse> {
    const data = await this.http.request<SendMessageResponse>({
      method: 'POST',
      url: this.url('sendMessage'),
      body: { chatId, message },
    });
    return this.required(data);
  }

  receiveNotification(signal?: AbortSignal): Promise<Notification | null> {
    return this.http.request<Notification>({
      method: 'GET',
      url: `${this.url('receiveNotification')}?receiveTimeout=${RECEIVE_TIMEOUT_SEC}`,
      signal,
    });
  }

  async deleteNotification(receiptId: number): Promise<void> {
    await this.http.request<DeleteNotificationResponse>({
      method: 'DELETE',
      url: `${this.url('deleteNotification')}/${receiptId}`,
    });
  }

  private url(method: string): string {
    const { apiUrl, idInstance, apiTokenInstance } = this.credentials;
    return `${apiUrl.replace(/\/+$/, '')}/waInstance${idInstance}/${method}/${apiTokenInstance}`;
  }

  private required<T>(data: T | null): T {
    if (data === null) throw new ApiError('Пустой ответ сервера', 0);
    return data;
  }
}
