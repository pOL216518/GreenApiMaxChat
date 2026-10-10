// DTO ответов green api (https://green-api.com/v3/docs/).

export type InstanceState =
  | 'notAuthorized'
  | 'authorized'
  | 'blocked'
  | 'starting'
  | 'yellowCard'
  | 'pendingPassword'
  | (string & {});

export interface StateInstanceResponse {
  stateInstance: InstanceState;
}

export interface CheckAccountResponse {
  exist: boolean;
  chatId: string;
  fromCache?: boolean;
}

export interface SendMessageResponse {
  idMessage: string;
}

export interface DeleteNotificationResponse {
  result: boolean;
  reason?: string;
}

export interface SenderData {
  chatId: string;
  chatName?: string;
  chatType?: string;
  sender?: string;
  senderName?: string;
  senderContactName?: string;
  senderPhoneNumber?: number;
}

export interface MessageData {
  typeMessage: string;
  textMessageData?: { textMessage: string };
  extendedTextMessageData?: { text: string };
}

export interface MessageWebhook {
  typeWebhook: 'incomingMessageReceived' | 'outgoingMessageReceived' | 'outgoingAPIMessageReceived';
  timestamp: number;
  idMessage: string;
  senderData: SenderData;
  messageData: MessageData;
}

export interface StatusWebhook {
  typeWebhook: 'outgoingMessageStatus';
  timestamp: number;
  idMessage: string;
  chatId: string;
  status: string;
}

export interface UnknownWebhook {
  typeWebhook: string;
}

export type WebhookBody = MessageWebhook | StatusWebhook | UnknownWebhook;

export interface Notification {
  receiptId: number;
  body: WebhookBody;
}
