export function getErrorMessage(error: unknown): string {
  if (error instanceof TypeError) return 'Нет соединения с сервером GREEN-API. Проверьте apiUrl.';
  if (error instanceof Error) return error.message;
  return 'Неизвестная ошибка';
}
