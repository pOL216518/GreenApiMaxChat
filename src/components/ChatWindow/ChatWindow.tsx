import type { Chat, ChatMessage } from '../../domain/types';
import { Avatar } from '../Avatar/Avatar';
import styles from './ChatWindow.module.css';
import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';

interface ChatWindowProps {
  chat: Chat;
  messages: ChatMessage[];
  onSend: (text: string) => Promise<void>;
  onBack: () => void;
}

export function ChatWindow({ chat, messages, onSend, onBack }: ChatWindowProps) {
  return (
    <section className={styles.window}>
      <header className={styles.header}>
        <button className={styles.back} type="button" onClick={onBack} aria-label="Назад к чатам">
          ←
        </button>
        <Avatar title={chat.title} />
        <div className={styles.headerText}>
          <h2 className={styles.title}>{chat.title}</h2>
          <span className={styles.subtitle}>MAX · chatId {chat.id}</span>
        </div>
      </header>
      <MessageList messages={messages} />
      <MessageInput key={chat.id} onSend={onSend} />
    </section>
  );
}
