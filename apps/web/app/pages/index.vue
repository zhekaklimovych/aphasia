<script setup lang="ts">
const {
  status,
  currentQuestion,
  progress,
  history,
  result,
  wasCorrect,
  start,
  answer,
  confirm,
  reset,
} = useDialog()
</script>

<template>
  <main class="dialog-page">
    <h1 class="dialog-page__title">Aphasia Helper</h1>

    <DialogInputForm v-if="status === 'idle'" @submit="start" />

    <template v-else-if="status === 'asking' && currentQuestion">
      <DialogProgressBar :current="progress.current" :total="progress.total" />
      <DialogQuestionCard :question="currentQuestion" />
      <DialogAnswerButtons @answer="answer" />
      <DialogHistory :entries="history" />
    </template>

    <DialogResultCard v-else-if="status === 'result' && result" :result="result">
      <template #actions>
        <DialogConfirmButtons @confirm="confirm" />
      </template>
    </DialogResultCard>

    <section v-else-if="status === 'done'" class="dialog-page__done" aria-live="polite">
      <p v-if="wasCorrect">Чудово, ми зрозуміли вас правильно!</p>
      <p v-else>Шкода, що не вийшло. Спробуйте сформулювати інакше.</p>
      <button type="button" class="btn" @click="reset">Новий діалог</button>
    </section>
  </main>
</template>

<style scoped>
.dialog-page {
  display: grid;
  gap: var(--space-3);
  max-width: 40rem;
  margin: 0 auto;
  padding: var(--space-3) var(--space-2) var(--space-4);
}

.dialog-page__title {
  font-size: 1.3rem;
  color: var(--color-text-muted);
}

.dialog-page__done {
  display: grid;
  gap: var(--space-2);
  font-size: 1.4rem;
}

.dialog-page__done p {
  margin: 0;
}
</style>
