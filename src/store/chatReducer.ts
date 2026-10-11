import type { Chat, ChatMessage, MessageStatus } from '../domain/types';

export interface ChatState {
  chats: Chat[];
  messages: Record<string, ChatMessage[] | undefined>;
  activeChatId: string | null;
}

export const initialChatState: ChatState = { chats: [], messages: {}, activeChatId: null };

export type ChatAction =
  | { type: 'chatOpened'; chat: Chat }
  | { type: 'chatSelected'; chatId: string | null }
  | { type: 'messageAdded'; message: ChatMessage; chatTitle?: string }
  | { type: 'messageSent'; chatId: string; tempId: string; id: string }
  | { type: 'statusChanged'; chatId: string; messageId: string; status: MessageStatus };

/** Статус не должен откатываться назад, если уведомления пришли не по порядку. */
const statusRank: Record<MessageStatus, number> = {
  pending: 0,
  sent: 1,
  delivered: 2,
  read: 3,
  failed: 4,
};

function upsertChat(chats: Chat[], chat: Chat): Chat[] {
  return chats.some((c) => c.id === chat.id) ? chats : [chat, ...chats];
}

/** Поднимает чат с новым сообщением наверх списка, как в мессенджерах. */
function moveChatToTop(chats: Chat[], chatId: string): Chat[] {
  const chat = chats.find((c) => c.id === chatId);
  if (!chat || chats[0]?.id === chatId) return chats;
  return [chat, ...chats.filter((c) => c.id !== chatId)];
}

function updateMessages(
  state: ChatState,
  chatId: string,
  updater: (messages: ChatMessage[]) => ChatMessage[],
): ChatState {
  return {
    ...state,
    messages: { ...state.messages, [chatId]: updater(state.messages[chatId] ?? []) },
  };
}

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'chatOpened':
      return {
        ...state,
        chats: moveChatToTop(upsertChat(state.chats, action.chat), action.chat.id),
        activeChatId: action.chat.id,
      };

    case 'chatSelected':
      return { ...state, activeChatId: action.chatId };

    case 'messageAdded': {
      const { message } = action;
      const existing = state.messages[message.chatId] ?? [];
      if (existing.some((m) => m.id === message.id)) return state;

      const chats = upsertChat(state.chats, {
        id: message.chatId,
        title: action.chatTitle ?? message.chatId,
      });
      const withMessage = updateMessages(state, message.chatId, (list) =>
        [...list, message].sort((a, b) => a.timestamp - b.timestamp),
      );
      return { ...withMessage, chats: moveChatToTop(chats, message.chatId) };
    }

    case 'messageSent':
      return updateMessages(state, action.chatId, (list) => {
        if (list.some((m) => m.id === action.id)) return list.filter((m) => m.id !== action.tempId);
        return list.map((m) =>
          m.id === action.tempId ? { ...m, id: action.id, status: 'sent' as const } : m,
        );
      });

    case 'statusChanged':
      return updateMessages(state, action.chatId, (list) =>
        list.map((m) =>
          m.id === action.messageId && statusRank[action.status] > statusRank[m.status ?? 'pending']
            ? { ...m, status: action.status }
            : m,
        ),
      );
  }
}
