import { useState, type SubmitEvent } from 'react';
import { getErrorMessage } from '../../utils/getErrorMessage';
import styles from './Sidebar.module.css';

interface NewChatFormProps {
  onCreate: (phone: string) => Promise<void>;
}

export function NewChatForm({ onCreate }: NewChatFormProps) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!phone.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      await onCreate(phone);
      setPhone('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.newChat} onSubmit={(e) => void handleSubmit(e)}>
      <div className={styles.newChatRow}>
        <input
          className={styles.search}
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
          }}
          placeholder="Номер получателя, +7 999 123-45-67"
          aria-label="Номер телефона получателя"
        />
        <button className={styles.create} type="submit" disabled={!phone.trim() || loading}>
          {loading ? '…' : 'Создать'}
        </button>
      </div>
      {error && (
        <p className={styles.formError} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
