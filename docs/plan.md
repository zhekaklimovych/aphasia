# Aphasia Helper MVP: план розробки

Створено: 10.11.2026

## 1. Мета і обсяг MVP

MVP — це веб-застосунок (Nuxt + PWA), у якому користувач вводить слово чи фразу, AI ставить питання "так/ні", а потім показує інтерпретацію, яку користувач підтверджує або відхиляє. Строк: 7 тижнів у вільний час (~12–14 годин на тиждень). Головна мета — попрактикуватися з кожною технологією стеку.

**Основний сценарій (єдиний у MVP):**

1. Користувач логіниться.
2. На головній вводить текст, наприклад "чайник синій".
3. Застосунок створює сесію діалогу.
4. AI ставить питання, користувач відповідає "Так / Ні / Пропустити".
5. Після 5–10 питань AI показує інтерпретацію з рівнем впевненості.
6. Користувач підтверджує "Так, я це мав на увазі" або "Ні".
7. Сесія зберігається в історії.

**Входить у MVP:**

- Реєстрація і логін (email + пароль, JWT).
- Профіль: ім'я, мова, тип розладу, тяжкість, темп (одна форма).
- Словник слів: ручне додавання пар "кажу → маю на увазі".
- Діалогова сесія з AI і збереження всіх повідомлень.
- Історія сесій і проста статистика (кількість, % успішних).

**Відкладено на потім:** голосовий ввід, відновлення пароля, refresh-токени, автоматичне навчання словника, мобільний застосунок, мультимовність, аналітика прогресу в часі.

**Дані:** лише вигадані тестові профілі. Дані про здоров'я чутливі, а в MVP вони надсилаються сторонньому AI-сервісу.

## 2. Стек і структура репозиторію

Усе живе в одному монорепозиторії на pnpm workspaces: фронт, бекенд і спільні типи. Браузер ходить тільки в Nest API, а ключ AI-сервісу зберігається лише на бекенді.

| Шар              | Технологія                       | Роль у застосунку                         |
| ---------------- | -------------------------------- | ----------------------------------------- |
| Фронтенд         | Nuxt 4, Vue 3 (`<script setup>`) | Сторінки, компоненти діалогу, PWA         |
| Клієнтський стан | Pinia                            | Авторизація, поточна сесія діалогу        |
| Серверний стан   | TanStack Query (Vue)             | Профіль, словник, історія, мутації        |
| Таблиці          | TanStack Table                   | Словник слів і історія сесій              |
| Валідація        | Zod                              | Форми та відповідь AI, спільні схеми      |
| Бекенд           | Nest.js                          | Модулі auth, profile, words, sessions, ai |
| ORM і БД         | Prisma + PostgreSQL 16           | Схема, міграції, запити                   |
| AI               | Groq API (через Nest)            | Генерація питань та інтерпретації         |
| Тести            | Vitest, Supertest, Playwright    | Unit, API, E2E                            |
| Інфраструктура   | Docker Compose, GitHub Actions   | Локальна БД, CI                           |
| Інструменти      | Git, Claude Code                 | Гілки і PR, допомога з кодом              |

```
aphasia-helper/
├── apps/
│   ├── web/                 # Nuxt 4 (@aphasia/web)
│   │   ├── app/             # srcDir Nuxt 4
│   │   │   ├── pages/       # index, dialog/[id], history, profile, words, login, register
│   │   │   ├── layouts/     # default, auth
│   │   │   ├── components/  # dialog/, profile/, common/
│   │   │   ├── composables/ # useDialog, useAuthApi ...
│   │   │   ├── stores/      # auth.ts, dialog.ts
│   │   │   └── middleware/  # auth.ts
│   │   ├── public/
│   │   └── nuxt.config.ts
│   └── api/                 # Nest.js
│       ├── src/auth, profile, words, sessions, ai, prisma
│       └── prisma/schema.prisma
├── packages/shared/         # Zod-схеми і типи
├── e2e/                     # Playwright
├── docs/plan.md             # цей файл
├── CLAUDE.md
├── docker-compose.yml
├── .env.example
└── README.md
```

## 3. Модель даних і API

У MVP п'ять таблиць замість восьми з початкового документа: діагностика злита з профілем, результат сесії зберігається в самій сесії, а статистика рахується запитом, а не окремою таблицею.

```prisma
enum Severity { MILD MODERATE SEVERE }
enum SessionStatus { ACTIVE COMPLETED ABANDONED }
enum MessageRole { USER_INPUT AI_QUESTION USER_ANSWER AI_RESULT }
enum Answer { YES NO SKIP }

model User {
  id           String          @id @default(uuid())
  email        String          @unique
  passwordHash String
  createdAt    DateTime        @default(now())
  profile      Profile?
  words        WordMapping[]
  sessions     DialogSession[]
}

model Profile {
  id            String    @id @default(uuid())
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  firstName     String
  birthDate     DateTime?
  language      String    @default("uk")
  disorderType  String?
  severity      Severity?
  preferredPace String    @default("normal")
  occupation    String?
  hobbies       String[]
  updatedAt     DateTime  @updatedAt
}

model WordMapping {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  usedWord    String
  correctWord String
  context     String?
  createdAt   DateTime @default(now())
  @@unique([userId, usedWord])
}

model DialogSession {
  id             String          @id @default(uuid())
  userId         String
  user           User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  initialInput   String
  status         SessionStatus   @default(ACTIVE)
  interpretation String?
  confidence     Float?
  wasCorrect     Boolean?
  feedback       String?
  createdAt      DateTime        @default(now())
  completedAt    DateTime?
  messages       DialogMessage[]
  @@index([userId, createdAt])
}

model DialogMessage {
  id        String        @id @default(uuid())
  sessionId String
  session   DialogSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  role      MessageRole
  content   String
  answer    Answer?
  sequence  Int
  createdAt DateTime      @default(now())
  @@unique([sessionId, sequence])
}
```

Відповідь "так/ні" зберігається окремим повідомленням з роллю `USER_ANSWER`. Так AI бачить повну історію діалогу, і проблема з початкового документа зникає.

**API** (префікс `/api`, усі маршрути, крім auth, потребують JWT):

| Метод          | Шлях                     | Що робить                                                      |
| -------------- | ------------------------ | -------------------------------------------------------------- |
| POST           | `/auth/register`         | Реєстрація                                                     |
| POST           | `/auth/login`            | Логін, токен у httpOnly cookie                                 |
| POST           | `/auth/logout`           | Очищення cookie                                                |
| GET            | `/auth/me`               | Поточний користувач                                            |
| GET / PUT      | `/profile`               | Отримати або зберегти профіль                                  |
| GET / POST     | `/words`                 | Список і додавання пари слів                                   |
| PATCH / DELETE | `/words/:id`             | Редагування і видалення                                        |
| POST           | `/sessions`              | Нова сесія з `initialInput`, повертає перше питання            |
| POST           | `/sessions/:id/answer`   | Відповідь YES/NO/SKIP, повертає наступне питання або результат |
| POST           | `/sessions/:id/feedback` | "Правильно / неправильно" + коментар                           |
| GET            | `/sessions`              | Історія з пагінацією                                           |
| GET            | `/sessions/:id`          | Сесія з усіма повідомленнями                                   |
| GET            | `/sessions/stats`        | Кількість сесій і % успішних (SQL-агрегація)                   |

## 4. Етапи 0–2: фронтенд без бекенду

Перші три тижні ви будуєте весь інтерфейс на мок-даних. Так Vue вивчається на реальних екранах, а бекенд і AI не заважають.

### Етап 0. Підготовка (2–3 дні)

**Вивчаєте:** Git, pnpm, структура монорепозиторію.

- [x] Створити репозиторій на GitHub, гілка `main` захищена, робота через PR.
- [x] Ініціалізувати pnpm workspaces, створити `apps/web` через `pnpm create nuxt@latest` (шаблон `minimal`, Nuxt 4). Шляхи фронтенду нижче (`pages/`, `stores/`, `mocks/` …) рахуються від `apps/web/app/`.
- [x] Налаштувати TypeScript strict, ESLint, Prettier.
- [x] README з командами запуску.

**Готово, коли:** `pnpm dev` відкриває стартову сторінку Nuxt, перший PR змерджено.

### Етап 1. Vue: екран діалогу на моках (тиждень 1–2)

**Вивчаєте:** шаблони, `ref`, `computed`, `watch`, props/emits, слоти, `v-for`, composables.

Компоненти в `components/dialog/`:

| Компонент           | Що робить                                        | Тема Vue          |
| ------------------- | ------------------------------------------------ | ----------------- |
| `InputForm.vue`     | Поле вводу фрази, кнопка "Почати"                | `v-model`, `emit` |
| `QuestionCard.vue`  | Показує поточне питання                          | props             |
| `AnswerButtons.vue` | Кнопки Так / Ні / Пропустити                     | `emit` з payload  |
| `DialogHistory.vue` | Список питань і відповідей                       | `v-for`, `:key`   |
| `ResultCard.vue`    | Інтерпретація, впевненість, кнопки підтвердження | `computed`, слоти |
| `ProgressBar.vue`   | Номер питання з N                                | `computed`        |

- [ ] Файл `mocks/questions.ts` з 6–8 питаннями і готовим результатом.
- [ ] Composable `useDialog()` зі станами `idle → asking → result → done`, функціями `start(text)`, `answer(value)`, `reset()`.
- [ ] Сторінка `pages/index.vue` збирає всі компоненти.
- [ ] Великі кнопки, контрастні кольори, клавіші `Y` / `N` для відповіді (доступність важлива для цільових користувачів).
- [ ] Перші тести Vitest для `useDialog()`: старт, відповідь, перехід до результату, скидання.

**Готово, коли:** можна пройти діалог від вводу до результату на моках, тести `useDialog()` проходять.

### Етап 2. Nuxt + Pinia: сторінки і стан (тиждень 3)

**Вивчаєте:** file-based routing, layouts, middleware, Pinia, Zod для форм.

- [ ] Сторінки: `/login`, `/register`, `/` (новий діалог), `/dialog/[id]`, `/history`, `/profile`, `/words`.
- [ ] `layouts/default.vue` з нижньою навігацією, `layouts/auth.vue` для логіну.
- [ ] Store `stores/dialog.ts`: перенести стан з `useDialog()` у Pinia, щоб діалог не губився при переході між сторінками.
- [ ] Store `stores/auth.ts` з мок-логіном, `middleware/auth.ts` закриває сторінки для гостей.
- [ ] Форми профілю і словника з валідацією через Zod (схеми в `packages/shared`).
- [ ] Сторінка `/words` з TanStack Table на мок-даних: сортування і пошук.

**Готово, коли:** усі сторінки відкриваються, без "логіну" перекидає на `/login`, діалог зберігається при навігації.

## 5. Етапи 3–4: бекенд і з'єднання з фронтом

У тижні 4–5 моки замінюються справжнім API. Після цього етапу застосунок працює повністю, тільки питання ще генеруються не AI, а заглушкою на бекенді.

### Етап 3. Nest + Prisma + PostgreSQL + Docker (тиждень 4)

**Вивчаєте:** модулі, контролери, сервіси, DI, DTO, Prisma, SQL, Docker Compose.

- [ ] `docker-compose.yml` з PostgreSQL 16 і volume для даних; `docker compose up -d`.
- [ ] `apps/api` через `nest new`, підключити Prisma, `PrismaService` як глобальний модуль.
- [ ] Схема з розділу 3, перша міграція `prisma migrate dev`, seed з 2 тестовими користувачами і 10 словами.
- [ ] Модулі `profile` і `words`: CRUD, DTO з `class-validator`, глобальний `ValidationPipe`.
- [ ] Модуль `sessions` з `MockQuestionService`: віддає питання зі списку. Так увесь цикл сесії працює ще до AI.
- [ ] `GET /sessions/stats` через `prisma.$queryRaw` або `groupBy`. Оголосіть цей маршрут у контролері вище за `GET /sessions/:id`, інакше `stats` сприйметься як id.
- [ ] Swagger на `/api/docs`.
- [ ] Відкрийте БД у psql або DBeaver і напишіть руками 3 запити: сесії користувача, JOIN з повідомленнями, % успішних.

**Готово, коли:** у Swagger можна створити сесію, відповісти на всі питання і побачити результат, дані видно в БД.

### Етап 4. Авторизація + TanStack Query (тиждень 5)

**Вивчаєте:** JWT, bcrypt, guards, cookie, CORS, TanStack Query.

Бекенд:

- [ ] Модуль `auth`: реєстрація з хешем пароля через bcrypt, логін, `/me`, logout.
- [ ] JWT у httpOnly cookie (`sameSite: 'lax'`), `JwtAuthGuard` глобально, декоратор `@Public()` для auth-маршрутів.
- [ ] Декоратор `@CurrentUser()`; кожен запит до сесій і слів фільтрується за `userId` (чужі дані → 404).
- [ ] CORS з `credentials: true` для домену фронту, `@nestjs/throttler` на `/auth/*`.
- [ ] Supertest: реєстрація, логін, 401 без токена, 404 на чужу сесію.

Фронтенд:

- [ ] `$fetch` з `credentials: 'include'`, базовий URL з `runtimeConfig`.
- [ ] Pinia `auth` викликає реальні `/auth/login` і `/auth/me`; middleware перевіряє користувача.
- [ ] TanStack Query: `useQuery` для профілю, слів, історії, статистики; `useMutation` для збереження профілю, додавання слова, відповідей у сесії; `invalidateQueries` після мутацій.
- [ ] Стан діалогу тепер приходить з API, а Pinia тримає тільки id активної сесії і UI-стан.

**Готово, коли:** реєстрація → профіль → словник → діалог → історія працюють з реальною БД, після перезавантаження сторінки користувач лишається в системі.

## 6. Етапи 5–6: AI, тести, Docker і CI

У тижні 6–7 заглушка питань замінюється на AI, а застосунок отримує тести на всіх рівнях і автоматичну перевірку в CI.

### Етап 5. Інтеграція AI (тиждень 6)

**Вивчаєте:** робота з зовнішнім API, змінні середовища, Zod на бекенді, обробка помилок, інтерфейси і DI в Nest.

- [ ] Інтерфейс `QuestionGenerator` з методом `next(context)`; дві реалізації: `MockQuestionService` (вже є) і `GroqQuestionService`. Вибір через змінну `AI_PROVIDER`. Тести і E2E завжди працюють з моком.
- [ ] `PromptBuilder`: збирає system prompt з профілю, словника і правил (одне питання за раз, максимум 10 питань, відповідь українською). Історія діалогу йде тільки в `messages`, без дублювання.
- [ ] Відповідь AI — строго JSON: `{ type: "question" | "result", text, confidence? }`. Перевірка через Zod; невалідна відповідь → одна повторна спроба, потім помилка 502 з повідомленням для користувача.
- [ ] Ключ `GROQ_API_KEY` тільки в `.env` бекенду; модель вказується змінною `AI_MODEL` (перевірте актуальний список моделей Groq).
- [ ] Таймаут 15 с і rate limit на `/sessions/*`, щоб не витратити ліміт API.
- [ ] На фронті: стан "AI думає...", повідомлення про помилку з кнопкою "Спробувати ще".
- [ ] Unit-тести `PromptBuilder` і парсингу відповіді AI (валідний JSON, невалідний, порожня відповідь).

**Готово, коли:** з `AI_PROVIDER=groq` діалог веде реальний AI, з `AI_PROVIDER=mock` усе працює без мережі.

### Етап 6. Тести, Docker, CI (тиждень 7)

**Вивчаєте:** Vitest + `@vue/test-utils`, Playwright, Dockerfile, GitHub Actions.

- [ ] Component-тести: `AnswerButtons` (емітить правильне значення), `ResultCard` (показує впевненість), форма словника (помилки валідації).
- [ ] Unit-тести Nest-сервісів: `SessionsService`, `AuthService`, з замоканим Prisma.
- [ ] Playwright, 3 сценарії: реєстрація і логін; додавання слова у словник; повний діалог від вводу до підтвердження результату (бекенд з `AI_PROVIDER=mock`).
- [ ] `Dockerfile` для `api` (multi-stage), `docker compose up` піднімає БД і API разом.
- [ ] GitHub Actions: install → lint → typecheck → Vitest → Supertest з Postgres-сервісом → Playwright.
- [ ] Попросіть Claude Code зробити рев'ю одного модуля і порівняйте з власним баченням; виправте те, з чим згодні.
- [ ] README: архітектура, запуск, змінні середовища, демо-акаунт.

**Готово, коли:** PR у `main` проходить увесь пайплайн, новий розробник запускає проєкт за README без питань.

Деплой (Vercel для фронту, Render або Railway для API і БД) — опційний крок після MVP.

## 7. Розклад, Definition of Done і ресурси

Кожна технологія стеку отримує щонайменше один етап практики, а Git і Claude Code використовуються щотижня.

| Тиждень | Етап          | Основні технології                         |
| ------- | ------------- | ------------------------------------------ |
| 1       | 0 + початок 1 | Git, pnpm, TypeScript, Vue                 |
| 2       | 1             | Vue, composables, Vitest                   |
| 3       | 2             | Nuxt, Pinia, Zod, TanStack Table           |
| 4       | 3             | Nest.js, Prisma, PostgreSQL, Docker        |
| 5       | 4             | JWT, guards, TanStack Query, Supertest     |
| 6       | 5             | Інтеграція AI, Zod на бекенді              |
| 7       | 6             | Vitest, Playwright, Docker, GitHub Actions |

**Ритм тижня:** 1,5–2 години в будні (тема з документації + одна задача з чеклиста), субота — довести етап до "Готово, коли", неділя — повторення і нотатки про те, що було незрозуміло.

**Якщо відстаєте:** спочатку скорочуйте етап 5 (залиште мок-питання), потім кількість E2E-сценаріїв. Етапи 1, 3 і 4 не скорочуйте — це ядро full stack.

**Definition of Done для кожної задачі:**

- Окрема гілка і PR з коротким описом, що і навіщо.
- `pnpm lint` і `pnpm typecheck` без помилок, жодного `any` без коментаря.
- Нова логіка має хоча б один тест.
- Немає секретів у коді, нові змінні додані в `.env.example`.
- Ви можете пояснити кожен рядок, навіть якщо його запропонував Claude Code.

**Ресурси:**

- [Vue 3 — офіційна документація](https://vuejs.org/guide/introduction.html) (Essentials, Components, Reusability)
- [Nuxt](https://nuxt.com/docs/getting-started/introduction)
- [Pinia](https://pinia.vuejs.org/)
- [TanStack Query для Vue](https://tanstack.com/query/latest/docs/framework/vue/overview) і [TanStack Table](https://tanstack.com/table/latest)
- [Zod](https://zod.dev/)
- [Nest.js](https://docs.nestjs.com/) (First steps, Controllers, Providers, Guards, OpenAPI)
- [Prisma з Nest](https://docs.nestjs.com/recipes/prisma) і [Prisma](https://www.prisma.io/docs)
- [Vitest](https://vitest.dev/guide/), [Vue Test Utils](https://test-utils.vuejs.org/), [Playwright](https://playwright.dev/docs/intro)
- [Docker Get Started](https://docs.docker.com/get-started/), [GitHub Actions Quickstart](https://docs.github.com/en/actions/writing-workflows/quickstart)
- [Pro Git](https://git-scm.com/book/uk/v2) (є українською)
- [Groq API](https://console.groq.com/docs/overview) (список моделей перевіряйте тут)
