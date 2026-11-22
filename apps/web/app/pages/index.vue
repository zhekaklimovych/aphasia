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
        <button type="button" @click="confirm(true)">Так, я це мав на увазі</button>
        <button type="button" @click="confirm(false)">Ні</button>
      </template>
    </DialogResultCard>

    <section v-else-if="status === 'done'" class="dialog-page__done">
      <p v-if="wasCorrect">Чудово, ми зрозуміли вас правильно!</p>
      <p v-else>Шкода, що не вийшло. Спробуйте сформулювати інакше.</p>
      <button type="button" @click="reset">Новий діалог</button>
    </section>
  </main>
</template>
