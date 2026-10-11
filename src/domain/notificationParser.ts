import type {
  MessageData,
  MessageWebhook,
  StatusWebhook,
  WebhookBody,
} from '../api/greenApi.types';
import type { ChatMessage, MessageDirection, MessageStatus } from './types';

export type NotificationEvent =
  | { kind: 'message'; message: ChatMessage; chatTitle: string }
  | { kind: 'status'; messageId: string; chatId: string; status: MessageStatus };

/** Чтобы поддержать новый текстовый тип, достаточно добавить запись, парсер менять не нужно . */
const textExtractors: Record<string, (data: MessageData) => string | undefined> = {
  textMessage: (data) => data.textMessageData?.textMessage,
  extendedTextMessage: (data) => data.extendedTextMessageData?.text,
};

const directionByWebhook: Record<MessageWebhook['typeWebhook'], MessageDirection> = {
  incomingMessageReceived: 'incoming',
  outgoingMessageReceived: 'outgoing',
  outgoingAPIMessageReceived: 'outgoing',
};

const statusMap: Record<string, MessageStatus> = {
  sent: 'sent',
  delivered: 'delivered',
  read: 'read',
  failed: 'failed',
  noAccount: 'failed',
  notInGroup: 'failed',
  yellowCard: 'failed',
};

function isMessageWebhook(body: WebhookBody): body is MessageWebhook {
  return body.typeWebhook in directionByWebhook;
}

function isStatusWebhook(body: WebhookBody): body is StatusWebhook {
  return body.typeWebhook === 'outgoingMessageStatus';
}

function parseMessage(body: MessageWebhook): NotificationEvent | null {
  const extract = textExtractors[body.messageData.typeMessage];
  const text = extract?.(body.messageData);
  if (!text) return null; // нетекстовые сообщения по ТЗ не поддерживаются

  const { senderData } = body;
  return {
    kind: 'message',
    chatTitle: [senderData.chatName, senderData.senderName].find(Boolean) ?? senderData.chatId,
    message: {
      id: body.idMessage,
      chatId: senderData.chatId,
      text,
      direction: directionByWebhook[body.typeWebhook],
      timestamp: body.timestamp * 1000,
      status: body.typeWebhook === 'incomingMessageReceived' ? undefined : 'sent',
    },
  };
}

function parseStatus(body: StatusWebhook): NotificationEvent | null {
  const status = statusMap[body.status];
  if (!status) return null;
  return { kind: 'status', messageId: body.idMessage, chatId: body.chatId, status };
}

export function parseNotification(body: WebhookBody): NotificationEvent | null {
  if (isMessageWebhook(body)) return parseMessage(body);
  if (isStatusWebhook(body)) return parseStatus(body);
  return null;
}
