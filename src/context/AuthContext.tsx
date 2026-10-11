import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { GreenApiClient } from '../api/GreenApiClient';
import type { MessengerApi } from '../api/messengerApi';
import type { Credentials } from '../domain/types';
import { CredentialsRepository } from '../services/credentialsRepository';
import { AuthContext, type AuthContextValue } from './authContextValue';

export type ApiFactory = (credentials: Credentials) => MessengerApi;

const defaultApiFactory: ApiFactory = (credentials) => new GreenApiClient(credentials);

interface AuthProviderProps {
  children: ReactNode;
  apiFactory?: ApiFactory;
  repository?: CredentialsRepository;
}

const defaultRepository = new CredentialsRepository();

export function AuthProvider({
  children,
  apiFactory = defaultApiFactory,
  repository = defaultRepository,
}: AuthProviderProps) {
  const [credentials, setCredentials] = useState<Credentials | null>(() => repository.load());

  const api = useMemo(
    () => (credentials ? apiFactory(credentials) : null),
    [credentials, apiFactory],
  );

  const login = useCallback(
    async (next: Credentials) => {
      const state = await apiFactory(next).getState();
      if (state !== 'authorized') {
        throw new Error(
          `Инстанс не авторизован (статус: ${state}). Привяжите аккаунт MAX в личном кабинете GREEN-API.`,
        );
      }
      repository.save(next);
      setCredentials(next);
    },
    [apiFactory, repository],
  );

  const logout = useCallback(() => {
    repository.clear();
    setCredentials(null);
  }, [repository]);

  const value = useMemo<AuthContextValue>(
    () => ({ credentials, api, login, logout }),
    [credentials, api, login, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
