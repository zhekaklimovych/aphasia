<script setup lang="ts">
import type { Question } from '~/types/dialog'

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
