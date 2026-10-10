/** Учётные данные инстанса GREEN-API. */
export interface Credentials {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
}

export type MessageDirection = 'incoming' | 'outgoing';

export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface ChatMessage {
  id: string;
  chatId: string;
  text: string;
  direction: MessageDirection;
  timestamp: number;
  status?: MessageStatus;
}

export interface Chat {
  id: string;
  title: string;
  phone?: string;
}
