<script setup lang="ts">
import type { Question } from '@aphasia/shared'

defineProps<{
  question: Question
}>()
</script>

<template>
  <!-- aria-live: екранний диктор зачитує нове питання, коли воно змінюється -->
  <section class="question-card" aria-live="polite">
    <h2 class="question-card__text">{{ question.text }}</h2>
  </section>
</template>

<style scoped>
.question-card {
  padding: var(--space-4) var(--space-3);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
}

.question-card__text {
  font-size: 1.6rem;
}
</style>
