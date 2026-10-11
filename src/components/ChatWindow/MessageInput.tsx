import { useState, type SubmitEvent, type KeyboardEvent } from 'react';
import { getErrorMessage } from '../../utils/getErrorMessage';
import styles from './ChatWindow.module.css';

export const MAX_MESSAGE_LENGTH = 4000;

interface MessageInputProps {
  onSend: (text: string) => Promise<void>;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const trimmed = text.trim();
  const canSend = trimmed.length > 0 && trimmed.length <= MAX_MESSAGE_LENGTH;

  const submit = async () => {
    if (!canSend) return;
    setText('');
    setError(null);
    try {
      await onSend(trimmed);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    void submit();
  };

  // Enter — отправить, Shift+Enter — перенос строки.
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void submit();
    }
  };

  return (
    <form className={styles.composer} onSubmit={handleSubmit}>
      {error && (
        <p className={styles.sendError} role="alert">
          {error}
        </p>
      )}
      <div className={styles.composerRow}>
        <textarea
          className={styles.input}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Сообщение"
          aria-label="Текст сообщения"
          rows={1}
          maxLength={MAX_MESSAGE_LENGTH}
          autoFocus
        />
        <button className={styles.send} type="submit" disabled={!canSend} aria-label="Отправить">
          ➤
        </button>
      </div>
    </form>
  );
}
