export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export interface HttpRequest {
  method: 'GET' | 'POST' | 'DELETE';
  url: string;
  body?: unknown;
  signal?: AbortSignal;
}

/** Абстракция транспорта(позволяет подменить fetch в тестах) */
export interface HttpClient {
  request<T>(req: HttpRequest): Promise<T | null>;
}

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Некорректный запрос',
  401: 'Неверный idInstance или apiTokenInstance',
  403: 'Доступ запрещён',
  429: 'Слишком много запросов, попробуйте позже',
  466: 'Превышен лимит запросов по тарифу',
  469: 'MAX ограничил частые проверки номеров, попробуйте позже',
};

export class FetchHttpClient implements HttpClient {
  async request<T>({ method, url, body, signal }: HttpRequest): Promise<T | null> {
    const response = await fetch(url, {
      method,
      signal,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (!response.ok) {
      const message = STATUS_MESSAGES[response.status] ?? `Ошибка сервера (${response.status})`;
      throw new ApiError(message, response.status);
    }

    const text = await response.text();
    if (!text || text === 'null') return null;
    return JSON.parse(text) as T;
  }
}
