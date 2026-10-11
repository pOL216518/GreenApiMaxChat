import { useCallback, type Dispatch } from 'react';
import type { MessengerApi } from '../api/messengerApi';
import type { NotificationEvent } from '../domain/notificationParser';
import type { ChatAction } from '../store/chatReducer';
import { formatPhone, isValidPhone, normalizePhone } from '../utils/phone';

let tempCounter = 0;
const createTempId = () => `temp-${Date.now()}-${++tempCounter}`;

export function useChatActions(api: MessengerApi, dispatch: Dispatch<ChatAction>) {
  const openChatByPhone = useCallback(
    async (rawPhone: string) => {
      const phone = normalizePhone(rawPhone);
      if (!isValidPhone(phone)) {
        throw new Error('Введите номер РФ (+7…) или РБ (+375…)');
      }
      const account = await api.checkAccount(phone);
      if (!account.exist || !account.chatId) {
        throw new Error('Этот номер не зарегистрирован в MAX');
      }
      dispatch({
        type: 'chatOpened',
        chat: { id: account.chatId, title: formatPhone(phone), phone },
      });
    },
    [api, dispatch],
  );

  const sendMessage = useCallback(
    async (chatId: string, text: string) => {
      const tempId = createTempId();
      dispatch({
        type: 'messageAdded',
        message: {
          id: tempId,
          chatId,
          text,
          direction: 'outgoing',
          timestamp: Date.now(),
          status: 'pending',
        },
      });
      try {
        const { idMessage } = await api.sendMessage(chatId, text);
        dispatch({ type: 'messageSent', chatId, tempId, id: idMessage });
      } catch (error) {
        dispatch({ type: 'statusChanged', chatId, messageId: tempId, status: 'failed' });
        throw error;
      }
    },
    [api, dispatch],
  );

  const handleNotification = useCallback(
    (event: NotificationEvent) => {
      if (event.kind === 'message') {
        dispatch({ type: 'messageAdded', message: event.message, chatTitle: event.chatTitle });
      } else {
        dispatch({
          type: 'statusChanged',
          chatId: event.chatId,
          messageId: event.messageId,
          status: event.status,
        });
      }
    },
    [dispatch],
  );

  const selectChat = useCallback(
    (chatId: string | null) => {
      dispatch({ type: 'chatSelected', chatId });
    },
    [dispatch],
  );

  return { openChatByPhone, sendMessage, handleNotification, selectChat };
}
