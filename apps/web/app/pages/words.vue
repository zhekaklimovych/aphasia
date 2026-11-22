<script setup lang="ts">
import { WordInputSchema, type WordInput, type WordMapping } from '@aphasia/shared'
import type { z } from 'zod'
import { MockApiError, mockApi } from '~/mocks/api'

useHead({ title: 'Словник' })

const {
  data: words,
  status,
  refresh,
} = useAsyncData('words', () => mockApi.listWords(), { server: false, default: () => [] })

const emptyWord: z.input<typeof WordInputSchema> = { usedWord: '', correctWord: '', context: '' }

const formEl = useTemplateRef<HTMLFormElement>('form')
const { values, errors, submitting, submit } = useZodForm(WordInputSchema, emptyWord)
const editingId = ref<string | null>(null)
const message = ref('')

function resetForm() {
  editingId.value = null
  values.value = { ...emptyWord }
  errors.value = {}
}

async function save(data: WordInput) {
  if (editingId.value) {
    await mockApi.updateWord(editingId.value, data)
    message.value = `Слово «${data.usedWord}» оновлено`
  } else {
    await mockApi.addWord(data)
    message.value = `Слово «${data.usedWord}» додано`
  }
  resetForm()
  await refresh()
}

async function onSubmit() {
  message.value = ''
  try {
    const ok = await submit(save)
    if (!ok) await focusFirstInvalid(formEl.value)
  } catch (error) {
    if (!(error instanceof MockApiError)) throw error
    if (error.field) errors.value = { [error.field]: error.message }
    else message.value = error.message
    await focusFirstInvalid(formEl.value)
  }
}

async function startEdit(word: WordMapping) {
  editingId.value = word.id
  values.value = {
    usedWord: word.usedWord,
    correctWord: word.correctWord,
    context: word.context ?? '',
  }
  errors.value = {}
  message.value = ''
  await nextTick()
  formEl.value?.querySelector('input')?.focus()
}

async function remove(word: WordMapping) {
  if (!window.confirm(`Видалити «${word.usedWord}» зі словника?`)) return
  await mockApi.deleteWord(word.id)
  if (editingId.value === word.id) resetForm()
  message.value = `Слово «${word.usedWord}» видалено`
  await refresh()
}
</script>

<template>
  <div class="page">
    <h1 class="page__title">Мій словник</h1>
    <p class="page__text">Пари «кажу → маю на увазі» допомагають краще вас розуміти.</p>

    <form ref="form" class="form" novalidate @submit.prevent="onSubmit">
      <h2 class="words__subtitle">{{ editingId ? 'Редагувати слово' : 'Додати слово' }}</h2>
      <FormTextField v-model="values.usedWord" label="Я кажу" :error="errors.usedWord" />
      <FormTextField
        v-model="values.correctWord"
        label="Я маю на увазі"
        :error="errors.correctWord"
      />
      <FormTextField
        v-model="values.context"
        label="Коли так кажу (необовʼязково)"
        :error="errors.context"
      />
      <div class="words__actions">
        <button type="submit" class="btn" :disabled="submitting">
          {{ editingId ? 'Зберегти' : 'Додати' }}
        </button>
        <button v-if="editingId" type="button" class="btn btn--skip" @click="resetForm">
          Скасувати
        </button>
      </div>
    </form>

    <p role="status" class="page__text">{{ message }}</p>

    <!-- idle: на сервері дані ще не запитувались (мок працює лише в браузері) -->
    <p v-if="status === 'idle' || status === 'pending'" class="page__text">Завантаження…</p>
    <WordsTable v-else :words="words" @edit="startEdit" @remove="remove" />
  </div>
</template>

<style scoped>
.words__subtitle {
  font-size: 1.2rem;
}

.words__actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: var(--space-2);
}
</style>
