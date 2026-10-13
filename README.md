# MAX Chat

Веб-интерфейс для отправки и получения текстовых сообщений в мессенджере **MAX** через [GREEN-API](https://green-api.com/max). Внешний вид взят с [web.max.ru](https://web.max.ru/).

**Демо:** <ссылка на Vercel>

## Возможности

- Вход по данным инстанса GREEN-API (`apiUrl`, `idInstance`, `apiTokenInstance`) с проверкой авторизации.
- Создание чата по номеру телефона получателя (РФ `+7`, РБ `+375`).
- Отправка сообщений методом [SendMessage](https://green-api.com/v3/docs/api/sending/SendMessage/).
- Получение сообщений по технологии [HTTP API](https://green-api.com/v3/docs/api/receiving/technology-http-api/): `receiveNotification` → обработка → `deleteNotification`.
- Статусы доставки, сохранение истории между перезагрузками, мобильная вёрстка и тёмная тема.

## Локальный запуск

Нужен Node.js 20 или новее.

```bash
git clone <ссылка на репозиторий>
cd max-chat
npm install
npm run dev
```

Откройте http://localhost:5175.

## Настройка GREEN-API

1. Создайте инстанс MAX в [личном кабинете](https://console.green-api.com) и авторизуйте аккаунт MAX по QR-коду.
2. В настройках инстанса оставьте `webhookUrl` пустым и включите получение входящих уведомлений. Для статусов доставки включите ещё уведомления об исходящих сообщениях.
3. Введите `apiUrl`, `idInstance` и `apiTokenInstance` из карточки инстанса на странице входа.

## Скрипты

| Команда         | Описание                   |
| --------------- | -------------------------- |
| `npm run dev`   | запуск в режиме разработки |
| `npm run build` | продакшн-сборка            |
| `npm run lint`  | проверка ESLint            |
| `npm test`      | unit-тесты                 |
| `npm run check` | типы, линтер и тесты       |

## Стек

React 19, TypeScript, Vite, CSS Modules, ESLint, Prettier, Vitest, husky, lint-staged.
