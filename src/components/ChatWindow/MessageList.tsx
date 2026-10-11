import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../../domain/types';
import styles from './ChatWindow.module.css';
import { MessageBubble } from './MessageBubble';

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  return (
    <div className={styles.messages} role="log" aria-live="polite">
      {messages.length === 0 && <p className={styles.noMessages}>Напишите первое сообщение</p>}
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
