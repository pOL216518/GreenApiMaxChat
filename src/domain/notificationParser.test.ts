import { describe, expect, it } from 'vitest';
import { parseNotification } from './notificationParser';

describe('parseNotification', () => {
  it('превращает входящее текстовое уведомление в сообщение', () => {
    const event = parseNotification({
      typeWebhook: 'incomingMessageReceived',
      timestamp: 1_700_000_000,
      idMessage: 'm1',
      senderData: { chatId: '10000000', chatName: 'Иван' },
      messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'Привет' } },
    });

    expect(event).toEqual({
      kind: 'message',
      chatTitle: 'Иван',
      message: {
        id: 'm1',
        chatId: '10000000',
        text: 'Привет',
        direction: 'incoming',
        timestamp: 1_700_000_000_000, // секунды - миллисекунды
        status: undefined,
      },
    });
  });

  it('игнорирует нетекстовые и служебные уведомления', () => {
    expect(
      parseNotification({
        typeWebhook: 'incomingMessageReceived',
        timestamp: 1,
        idMessage: 'm2',
        senderData: { chatId: '1' },
        messageData: { typeMessage: 'imageMessage' },
      }),
    ).toBeNull();
    expect(parseNotification({ typeWebhook: 'stateInstanceChanged' })).toBeNull();
  });
});
