import { useAuth } from './context/authContextValue';
import { LoginPage } from './pages/LoginPage/LoginPage';

export function App() {
  const { credentials, logout } = useAuth();

  if (!credentials) return <LoginPage />;

  return (
    <main style={{ padding: 24 }}>
      <p>Вы вошли, инстанс {credentials.idInstance}</p>
      <button type="button" onClick={logout}>
        Выйти
      </button>
    </main>
  );
}
