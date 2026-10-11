import type { Chat, ChatMessage } from '../../domain/types';
import { formatTime } from '../../utils/formatTime';
import { Avatar } from '../Avatar/Avatar';
import styles from './Sidebar.module.css';

interface ChatListProps {
  chats: Chat[];
  messages: Record<string, ChatMessage[] | undefined>;
  activeChatId: string | null;
  onSelect: (chatId: string) => void;
}

export function ChatList({ chats, messages, activeChatId, onSelect }: ChatListProps) {
  if (chats.length === 0) {
    return <p className={styles.placeholder}>Чатов пока нет</p>;
  }

  return (
    <ul className={styles.list}>
      {chats.map((chat) => {
        const last = messages[chat.id]?.at(-1);
        return (
          <li key={chat.id}>
            <button
              type="button"
              className={styles.item}
              aria-current={chat.id === activeChatId}
              onClick={() => {
                onSelect(chat.id);
              }}
            >
              <Avatar title={chat.title} />
              <span className={styles.itemBody}>
                <span className={styles.itemTop}>
                  <span className={styles.itemTitle}>{chat.title}</span>
                  {last && <time className={styles.itemTime}>{formatTime(last.timestamp)}</time>}
                </span>
                <span className={styles.itemPreview}>
                  {last
                    ? `${last.direction === 'outgoing' ? 'Вы: ' : ''}${last.text}`
                    : 'Нет сообщений'}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
