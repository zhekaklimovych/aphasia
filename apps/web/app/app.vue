<script setup lang="ts">
const { status, currentQuestion, progress, result, start, answer, confirm, reset } = useDialog()
const text = ref('')
</script>

<template>
  <main>
    <p>status: {{ status }}</p>

    <form v-if="status === 'idle'" @submit.prevent="start(text)">
      <input v-model="text" placeholder="Що ви хочете сказати?" />
      <button type="submit">Почати</button>
    </form>

    <div v-else-if="status === 'asking'">
      <p>Питання {{ progress.current }} з {{ progress.total }}</p>
      <p>{{ currentQuestion?.text }}</p>
      <button @click="answer('YES')">Так</button>
      <button @click="answer('NO')">Ні</button>
      <button @click="answer('SKIP')">Пропустити</button>
    </div>

    <div v-else-if="status === 'result'">
      <p>{{ result?.interpretation }}</p>
      <button @click="confirm(true)">Так, я це мав на увазі</button>
      <button @click="confirm(false)">Ні</button>
    </div>

    <div v-else>
      <p>Дякую!</p>
      <button @click="reset">Новий діалог</button>
    </div>
  </main>
</template>
