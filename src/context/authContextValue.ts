import { createContext, useContext } from 'react';
import type { MessengerApi } from '../api/messengerApi';
import type { Credentials } from '../domain/types';

export interface AuthContextValue {
  credentials: Credentials | null;
  api: MessengerApi | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth должен использоваться внутри AuthProvider');
  return ctx;
}
