import type { MessengerApi } from '../../api/messengerApi';
import { ChatWindow } from '../../components/ChatWindow/ChatWindow';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { useChatActions } from '../../hooks/useChatActions';
import { useChatStore } from '../../hooks/useChatStore';
import { useNotifications } from '../../hooks/useNotifications';
import styles from './ChatPage.module.css';

interface ChatPageProps {
  api: MessengerApi;
  idInstance: string;
}

export function ChatPage({ api, idInstance }: ChatPageProps) {
  const [state, dispatch] = useChatStore(idInstance);
  const { openChatByPhone, sendMessage, handleNotification, selectChat } = useChatActions(
    api,
    dispatch,
  );
  const connectionError = useNotifications(api, handleNotification);

  const activeChat = state.chats.find((c) => c.id === state.activeChatId) ?? null;

  return (
    <div className={styles.layout} data-chat-open={activeChat !== null}>
      <Sidebar
        idInstance={idInstance}
        chats={state.chats}
        messages={state.messages}
        activeChatId={state.activeChatId}
        connectionError={connectionError}
        onSelectChat={selectChat}
        onCreateChat={openChatByPhone}
      />
      {activeChat ? (
        <ChatWindow
          chat={activeChat}
          messages={state.messages[activeChat.id] ?? []}
          onSend={(text) => sendMessage(activeChat.id, text)}
          onBack={() => {
            selectChat(null);
          }}
        />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
