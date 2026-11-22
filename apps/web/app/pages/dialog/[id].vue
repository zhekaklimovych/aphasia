<script setup lang="ts">
import { mockApi } from '~/mocks/api'

const route = useRoute()
const id = computed(() => String(route.params.id))

useHead({ title: 'Діалог' })

const { data: session, status } = useAsyncData(
  () => `session-${id.value}`,
  () => mockApi.getSession(id.value),
  { server: false },
)

const history = computed(() => (session.value ? messagesToHistory(session.value.messages) : []))
const result = computed(() =>
  session.value?.interpretation != null && session.value.confidence != null
    ? { interpretation: session.value.interpretation, confidence: session.value.confidence }
    : null,
)
</script>

<template>
  <div class="page">
    <NuxtLink to="/history">← До історії</NuxtLink>

    <!-- idle: на сервері дані ще не запитувались (мок працює лише в браузері) -->
    <p v-if="status === 'idle' || status === 'pending'" class="page__text">Завантаження…</p>

    <template v-else-if="session">
      <h1 class="page__title">«{{ session.initialInput }}»</h1>
      <p class="page__text">
        {{ formatDate(session.createdAt) }} · {{ sessionOutcome(session).label }}
      </p>

      <DialogResultCard v-if="result" :result="result" />
      <DialogHistory :entries="history" />
    </template>

    <template v-else>
      <h1 class="page__title">Діалог не знайдено</h1>
      <p class="page__text">Можливо, його видалили або посилання неправильне.</p>
    </template>
  </div>
</template>
