import { useEffect, useRef, useState } from 'react';
import type { MessengerApi } from '../api/messengerApi';
import type { NotificationEvent } from '../domain/notificationParser';
import { NotificationPoller } from '../services/NotificationPoller';
import { getErrorMessage } from '../utils/getErrorMessage';

export function useNotifications(api: MessengerApi, onEvent: (event: NotificationEvent) => void) {
  const [error, setError] = useState<string | null>(null);
  const onEventRef = useRef(onEvent);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    const poller = new NotificationPoller(api);
    poller.start({
      onEvent: (event) => {
        setError(null);
        onEventRef.current(event);
      },
      onError: (e) => {
        setError(getErrorMessage(e));
      },
    });
    return () => {
      poller.stop();
    };
  }, [api]);

  return error;
}
