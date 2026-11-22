<script setup lang="ts">
import type { HistoryEntry } from '~/types/dialog'

defineProps<{
  // readonly, бо useDialog віддає історію лише для читання
  entries: readonly HistoryEntry[]
}>()
</script>

<template>
  <section v-if="entries.length" class="dialog-history" aria-label="Ваші попередні відповіді">
    <h3 class="dialog-history__title">Ваші відповіді</h3>
    <ol class="dialog-history__list">
      <li v-for="entry in entries" :key="entry.question.id" class="dialog-history__item">
        <span>{{ entry.question.text }}</span>
        <strong
          class="dialog-history__answer"
          :class="`dialog-history__answer--${entry.answer.toLowerCase()}`"
        >
          {{ answerLabels[entry.answer] }}
        </strong>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.dialog-history__title {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  margin-bottom: var(--space-1);
}

.dialog-history__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: var(--space-1);
}

.dialog-history__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
}

.dialog-history__answer {
  flex-shrink: 0;
  padding: 0.1rem 0.6rem;
  border-radius: 999px;
  color: var(--color-on-accent);
  font-size: 0.9rem;
}

.dialog-history__answer--yes {
  background: var(--color-yes);
}

.dialog-history__answer--no {
  background: var(--color-no);
}

.dialog-history__answer--skip {
  background: var(--color-skip);
}
</style>
