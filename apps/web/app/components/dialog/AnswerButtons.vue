<script setup lang="ts">
import type { Answer } from '~/types/dialog'

const emit = defineEmits<{
  answer: [value: Answer]
}>()

const answers: readonly Answer[] = ['YES', 'NO', 'SKIP']

useHotkeys(
  Object.fromEntries(
    answers.map((value) => [answerHotkeys[value].code, () => emit('answer', value)]),
  ),
)
</script>

<template>
  <div class="answer-buttons" role="group" aria-label="Ваша відповідь">
    <button
      v-for="value in answers"
      :key="value"
      type="button"
      class="btn"
      :class="`btn--${value.toLowerCase()}`"
      :aria-keyshortcuts="answerHotkeys[value].key"
      @click="emit('answer', value)"
    >
      {{ answerLabels[value] }}
      <kbd aria-hidden="true">{{ answerHotkeys[value].key }}</kbd>
    </button>
  </div>
</template>

<style scoped>
.answer-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
  gap: var(--space-2);
}
</style>
