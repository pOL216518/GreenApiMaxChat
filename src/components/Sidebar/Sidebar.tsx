import type { Chat, ChatMessage } from '../../domain/types';
import { useAuth } from '../../context/authContextValue';
import { ChatList } from './ChatList';
import { NewChatForm } from './NewChatForm';
import styles from './Sidebar.module.css';

interface SidebarProps {
  idInstance: string;
  chats: Chat[];
  messages: Record<string, ChatMessage[] | undefined>;
  activeChatId: string | null;
  connectionError: string | null;
  onSelectChat: (chatId: string) => void;
  onCreateChat: (phone: string) => Promise<void>;
}

export function Sidebar({
  idInstance,
  chats,
  messages,
  activeChatId,
  connectionError,
  onSelectChat,
  onCreateChat,
}: SidebarProps) {
  const { logout } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Чаты</h1>
          <span className={styles.instance}>Инстанс {idInstance}</span>
        </div>
        <button className={styles.logout} type="button" onClick={logout}>
          Выйти
        </button>
      </header>

      {connectionError && (
        <p className={styles.error} role="status">
          {connectionError}
        </p>
      )}

      <NewChatForm onCreate={onCreateChat} />
      <ChatList
        chats={chats}
        messages={messages}
        activeChatId={activeChatId}
        onSelect={onSelectChat}
      />
    </aside>
  );
}
