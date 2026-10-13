import { useState, type SubmitEvent } from 'react';
import { useAuth } from '../../context/authContextValue';
import { getErrorMessage } from '../../utils/getErrorMessage';
import styles from './LoginPage.module.css';

const DEFAULT_API_URL = 'https://api.green-api.com';

export function LoginPage() {
  const { login } = useAuth();
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = apiUrl.trim() && idInstance.trim() && apiTokenInstance.trim() && !loading;

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      await login({
        apiUrl: apiUrl.trim(),
        idInstance: idInstance.trim(),
        apiTokenInstance: apiTokenInstance.trim(),
      });
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <form className={styles.card} onSubmit={(e) => void handleSubmit(e)}>
        <div className={styles.logo}>
          <img src="/favicon.svg" alt="" />
        </div>
        <h1 className={styles.title}>Вход в MAX Chat</h1>
        <p className={styles.subtitle}>
          Введите данные инстанса из{' '}
          <a href="https://console.green-api.com" target="_blank" rel="noreferrer">
            личного кабинета GREEN-API
          </a>
        </p>

        <label className={styles.field}>
          <span>apiUrl</span>
          <input
            value={apiUrl}
            onChange={(e) => {
              setApiUrl(e.target.value);
            }}
            placeholder={DEFAULT_API_URL}
            inputMode="url"
            autoComplete="off"
          />
        </label>

        <label className={styles.field}>
          <span>idInstance</span>
          <input
            value={idInstance}
            onChange={(e) => {
              setIdInstance(e.target.value);
            }}
            placeholder="1234567890"
            inputMode="numeric"
            autoComplete="off"
            autoFocus
          />
        </label>

        <label className={styles.field}>
          <span>apiTokenInstance</span>
          <input
            type="password"
            value={apiTokenInstance}
            onChange={(e) => {
              setApiTokenInstance(e.target.value);
            }}
            placeholder="••••••••••••"
            autoComplete="off"
          />
        </label>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button className={styles.submit} type="submit" disabled={!canSubmit}>
          {loading ? 'Проверяем…' : 'Войти'}
        </button>
      </form>
    </main>
  );
}
