# Aphasia Helper (MVP)

## Про проєкт

Веб-застосунок для людей з порушеннями мовлення (афазія тощо). Користувач вводить слово чи фразу, AI ставить уточнювальні питання "так / ні / пропустити", а потім показує інтерпретацію, яку користувач підтверджує або відхиляє.

Це MVP застосунку. Застосунок будує Claude за планом з етапами і чеклистами: `docs/plan.md`.

**Дані тільки тестові.** Не використовувати дані реальних людей у seed, тестах чи прикладах.

## Як зі мною працювати

- Відповідай українською, коротко.
- Код пише Claude, крок за кроком за `docs/plan.md`. Детально пояснювати не потрібно: лише що зроблено і що перевірити.
- Кожен крок завершується комітом, а я перевіряю результат локально. Скажи, що саме перевірити (команди, що має бути в браузері).
- Питай лише тоді, коли рішення відходить від плану або домовленостей нижче.

## Стек

| Шар               | Технологія                                        |
| ----------------- | ------------------------------------------------- |
| Мова              | TypeScript (strict)                               |
| Фронтенд          | Nuxt 4, Vue 3 (Composition API, `<script setup>`) |
| Клієнтський стан  | Pinia (auth, UI-стан активного діалогу)           |
| Серверний стан    | TanStack Query (Vue)                              |
| Таблиці           | TanStack Table                                    |
| Валідація         | Zod (спільні схеми в `packages/shared`)           |
| Бекенд            | Nest.js                                           |
| ORM і БД          | Prisma + PostgreSQL 16                            |
| AI                | Groq API, лише через бекенд                       |
| Тести             | Vitest, @vue/test-utils, Supertest, Playwright    |
| Інфраструктура    | Docker Compose, GitHub Actions                    |
| Пакетний менеджер | pnpm workspaces                                   |

## Структура

```
apps/web/              # Nuxt 4, пакет @aphasia/web
  app/                 # srcDir Nuxt 4: увесь код застосунку тут
    app.vue
    pages/             # index, dialog/[id], history, profile, words, login, register
    layouts/           # default, auth
    components/dialog/ # InputForm, QuestionCard, AnswerButtons, DialogHistory, ResultCard, ProgressBar
    composables/       # useDialog та інші
    stores/            # auth.ts, dialog.ts
    middleware/        # auth.ts
  public/              # статичні файли
  nuxt.config.ts
apps/api/              # Nest.js
  src/                 # auth, profile, words, sessions, ai, prisma
  prisma/schema.prisma
packages/shared/       # Zod-схеми і типи
e2e/                   # Playwright
docs/plan.md           # план розробки
```

## Модель даних (коротко)

`User` → `Profile` (1:1), `WordMapping` (1:N), `DialogSession` (1:N) → `DialogMessage` (1:N).
Ролі повідомлень: `USER_INPUT`, `AI_QUESTION`, `USER_ANSWER`, `AI_RESULT`. Відповіді: `YES`, `NO`, `SKIP`.
Статистика рахується SQL-запитом, окремої таблиці аналітики немає.

## Домовленості

- **Стан:** дані з API — тільки через TanStack Query; Pinia — тільки клієнтський стан. Не дублювати серверні дані в Pinia.
- **Безпека:** JWT у httpOnly cookie; кожен запит до сесій і слів фільтрується за `userId` (чужі дані → 404). Секрети тільки в `.env`, нові змінні додавати в `.env.example`.
- **AI:** інтерфейс `QuestionGenerator` з реалізаціями `MockQuestionService` і `GroqQuestionService`, вибір через `AI_PROVIDER`. Тести і E2E завжди з моком. Відповідь AI — JSON, перевірений Zod.
- **Маршрути Nest:** `GET /sessions/stats` оголошувати вище за `GET /sessions/:id`.
- **Доступність:** великі кнопки, контраст, керування з клавіатури (`Y` / `N`) — цільові користувачі мають особливі потреби.
- **Код:** без `any` без коментаря; імена composables починаються з `use`.

## Git

- Поточна робота йде комітами в гілці `dev`, один крок — один коміт. PR не створюємо.
- `main` захищена (лише через PR). Оновлюємо її одним PR з `dev`, коли я про це попрошу.
- Коміти короткі, з префіксом (`feat:`, `fix:`, `test:`, `chore:`, `docs:`): що змінено і навіщо.

## Definition of Done

- `pnpm lint` і `pnpm typecheck` без помилок.
- Нова логіка має хоча б один тест.
- `pnpm test` і `pnpm format:check` проходять.
- Немає секретів у коді.

## Поточний етап

Етап 2: сторінки, Pinia, форми (на моках) (оновлюй цей рядок, коли переходимо до наступного етапу).
