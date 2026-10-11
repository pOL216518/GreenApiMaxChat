import { useEffect, useReducer } from 'react';
import { ChatRepository } from '../services/chatRepository';
import { chatReducer, initialChatState } from '../store/chatReducer';

const defaultRepository = new ChatRepository();

export function useChatStore(idInstance: string, repository: ChatRepository = defaultRepository) {
  const [state, dispatch] = useReducer(
    chatReducer,
    idInstance,
    (id) => repository.load(id) ?? initialChatState,
  );

  useEffect(() => {
    repository.save(idInstance, state);
  }, [idInstance, repository, state]);

  return [state, dispatch] as const;
}
