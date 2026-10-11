import { useAuth } from './context/authContextValue';
import { ChatPage } from './pages/ChatPage/ChatPage';
import { LoginPage } from './pages/LoginPage/LoginPage';

export function App() {
  const { credentials, api } = useAuth();

  if (!credentials || !api) return <LoginPage />;
  return <ChatPage key={credentials.idInstance} api={api} idInstance={credentials.idInstance} />;
}
