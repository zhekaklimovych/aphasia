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
        <span class="dialog-history__question">{{ entry.question.text }}</span>
        <strong class="dialog-history__answer">{{ answerLabels[entry.answer] }}</strong>
      </li>
    </ol>
  </section>
</template>
