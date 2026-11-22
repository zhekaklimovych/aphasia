<script setup lang="ts">
import type { Answer } from '~/types/dialog'

const emit = defineEmits<{
  answer: [value: Answer]
}>()

const answers: readonly Answer[] = ['YES', 'NO', 'SKIP']
</script>

<template>
  <div class="answer-buttons" role="group" aria-label="Ваша відповідь">
    <button
      v-for="value in answers"
      :key="value"
      type="button"
      class="answer-buttons__button"
      :class="`answer-buttons__button--${value.toLowerCase()}`"
      @click="emit('answer', value)"
    >
      {{ answerLabels[value] }}
    </button>
  </div>
</template>
