<script setup lang="ts">
import { mockApi } from '~/mocks/api'

useHead({ title: 'Історія' })

const { data: sessions, status } = useAsyncData('sessions', () => mockApi.listSessions(), {
  server: false,
  default: () => [],
})

const stats = computed(() => computeStats(sessions.value))
const successPercent = computed(() => Math.round(stats.value.successRate * 100))
</script>

<template>
  <div class="page">
    <h1 class="page__title">Історія діалогів</h1>

    <!-- idle: на сервері дані ще не запитувались (мок працює лише в браузері) -->
    <p v-if="status === 'idle' || status === 'pending'" class="page__text">Завантаження…</p>

    <template v-else>
      <section class="stats" aria-label="Статистика">
        <div class="stats__item">
          <span class="stats__value">{{ stats.total }}</span>
          <span class="stats__label">усього діалогів</span>
        </div>
        <div class="stats__item">
          <span class="stats__value">{{ successPercent }}%</span>
          <span class="stats__label">зрозуміли правильно</span>
        </div>
      </section>

      <p v-if="!sessions.length" class="page__text">
        Діалогів ще немає. <NuxtLink to="/">Почати новий</NuxtLink>
      </p>

      <ul v-else class="sessions" aria-label="Попередні діалоги">
        <li v-for="session in sessions" :key="session.id">
          <NuxtLink :to="`/dialog/${session.id}`" class="sessions__card">
            <span class="sessions__date">{{ formatDate(session.createdAt) }}</span>
            <strong class="sessions__input">«{{ session.initialInput }}»</strong>
            <span v-if="session.interpretation" class="sessions__result">
              {{ session.interpretation }}
            </span>
            <span
              class="sessions__badge"
              :class="`sessions__badge--${sessionOutcome(session).tone}`"
            >
              {{ sessionOutcome(session).label }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-2);
}

.stats__item {
  display: grid;
  padding: var(--space-2);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
}

.stats__value {
  font-size: 1.8rem;
  font-weight: 700;
}

.stats__label {
  color: var(--color-text-muted);
}

.sessions {
  display: grid;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.sessions__card {
  display: grid;
  gap: 0.25rem;
  padding: var(--space-2);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text);
  text-decoration: none;
}

.sessions__card:hover {
  border-color: var(--color-link);
}

.sessions__date,
.sessions__result {
  color: var(--color-text-muted);
}

.sessions__date {
  font-size: 0.9rem;
}

.sessions__badge {
  justify-self: start;
  padding: 0.1rem 0.6rem;
  border-radius: 999px;
  color: var(--color-on-accent);
  font-size: 0.9rem;
  font-weight: 600;
}

.sessions__badge--yes {
  background: var(--color-yes);
}

.sessions__badge--no {
  background: var(--color-no);
}

.sessions__badge--skip {
  background: var(--color-skip);
}
</style>
