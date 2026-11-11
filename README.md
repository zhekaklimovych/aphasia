# Aphasia Helper

Проєкт для допомоги людям з афазією. Основна ідея — щоб застосунок допомагав людям вільно спілкуватися.

Користувач вводить слово чи фразу так, як може її сказати. AI ставить уточнювальні питання з відповідями «Так / Ні / Пропустити», а потім пропонує інтерпретацію, яку користувач підтверджує або відхиляє.

> Навчальний проєкт (MVP). У проєкті використовуються лише вигадані тестові дані. План розробки: [docs/plan.md](docs/plan.md).

## Стек

| Шар            | Технології                                       |
| -------------- | ------------------------------------------------ |
| Фронтенд       | Nuxt 4, Vue 3, TypeScript, Pinia, TanStack Query |
| Бекенд         | Nest.js, Prisma, PostgreSQL 16 _(у розробці)_    |
| AI             | Groq API, лише через бекенд _(у розробці)_       |
| Тести          | Vitest, Supertest, Playwright _(у розробці)_     |
| Інфраструктура | pnpm workspaces, Docker Compose, GitHub Actions  |

## Вимоги

- [Node.js](https://nodejs.org/) 24
- pnpm через Corepack (версія закріплена в полі `packageManager` у `package.json`):

  ```bash
  corepack enable pnpm
  ```

  На Windows команду може знадобитися виконати в терміналі від адміністратора.

## Запуск

```bash
git clone https://github.com/zhekaklimovych/aphasia.git
cd aphasia
pnpm install
pnpm dev
```

Застосунок відкриється на http://localhost:3000.

## Скрипти

Усі команди запускаються з кореня репозиторію.

| Команда             | Що робить                                  |
| ------------------- | ------------------------------------------ |
| `pnpm dev`          | Запускає фронтенд (Nuxt) у режимі розробки |
| `pnpm lint`         | ESLint в усіх пакетах                      |
| `pnpm typecheck`    | Перевірка типів (vue-tsc) в усіх пакетах   |
| `pnpm test`         | Тести Vitest в усіх пакетах                |
| `pnpm format`       | Форматує код через Prettier                |
| `pnpm format:check` | Перевіряє форматування без змін (для CI)   |

Перед PR мають проходити `pnpm lint`, `pnpm typecheck` і `pnpm format:check`.

## Структура

```
apps/
  web/            # Nuxt 4 (@aphasia/web), код у apps/web/app/
  api/            # Nest.js (з'явиться на етапі 3)
packages/
  shared/         # Спільні Zod-схеми і типи (з'явиться на етапі 2)
docs/plan.md      # План розробки з етапами
```

## Як працювати з репозиторієм

- Гілка на кожну задачу: `feature/...`, `fix/...`, `chore/...`, `docs/...`.
- Зміни потрапляють у `main` лише через Pull Request.

## Відомі нюанси

- **TypeScript 6, а не 7.** `vue-tsc` і `typescript-eslint` поки не підтримують TypeScript 7, тому версія закріплена на `^6`.
- **Дивні помилки після зміни залежностей?** Запустіть `pnpm --filter @aphasia/web exec nuxt prepare`: він перегенерує папку `.nuxt`.
