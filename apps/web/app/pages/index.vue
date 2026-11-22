<script setup lang="ts">
useHead({ title: 'Новий діалог' })

const dialog = useDialogStore()
const { status, currentQuestion, progress, history, result, wasCorrect } = storeToRefs(dialog)
const { start, answer, confirm, reset } = dialog
</script>

<template>
  <div class="page">
    <h1 class="page__title">Новий діалог</h1>

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

    <section v-else-if="status === 'done'" class="done" aria-live="polite">
      <p v-if="wasCorrect">Чудово, ми зрозуміли вас правильно!</p>
      <p v-else>Шкода, що не вийшло. Спробуйте сформулювати інакше.</p>
      <button type="button" class="btn" @click="reset">Новий діалог</button>
    </section>
  </div>
</template>

<style scoped>
.done {
  display: grid;
  gap: var(--space-2);
  font-size: 1.4rem;
}

.done p {
  margin: 0;
}
</style>
