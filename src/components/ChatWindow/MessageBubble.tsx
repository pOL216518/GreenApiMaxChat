import { memo } from 'react';
import type { ChatMessage, MessageStatus } from '../../domain/types';
import { formatTime } from '../../utils/formatTime';
import styles from './ChatWindow.module.css';

const statusView: Record<MessageStatus, { icon: string; label: string }> = {
  pending: { icon: '🕓', label: 'Отправляется' },
  sent: { icon: '✓', label: 'Отправлено' },
  delivered: { icon: '✓✓', label: 'Доставлено' },
  read: { icon: '✓✓', label: 'Прочитано' },
  failed: { icon: '!', label: 'Не отправлено' },
};

export const MessageBubble = memo(function MessageBubble({ message }: { message: ChatMessage }) {
  const status = message.direction === 'outgoing' && message.status ? message.status : null;

  return (
    <div className={styles.bubble} data-direction={message.direction}>
      <span className={styles.text}>{message.text}</span>
      <span className={styles.meta}>
        <time>{formatTime(message.timestamp)}</time>
        {status && (
          <span
            className={styles.status}
            data-status={status}
            title={statusView[status].label}
            aria-label={statusView[status].label}
          >
            {statusView[status].icon}
          </span>
        )}
      </span>
    </div>
  );
});
