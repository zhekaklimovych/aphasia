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
    <p v-else-if="!words.length" class="page__text">Словник поки порожній.</p>
    <ul v-else class="words__list" aria-label="Слова у словнику">
      <li v-for="word in words" :key="word.id" class="words__item">
        <div>
          <strong>{{ word.usedWord }}</strong> → {{ word.correctWord }}
          <span v-if="word.context" class="words__context">{{ word.context }}</span>
        </div>
        <div class="words__item-actions">
          <button type="button" class="words__link" @click="startEdit(word)">Редагувати</button>
          <button type="button" class="words__link words__link--danger" @click="remove(word)">
            Видалити
          </button>
        </div>
      </li>
    </ul>
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

.words__list {
  display: grid;
  gap: var(--space-1);
  margin: 0;
  padding: 0;
  list-style: none;
}

.words__item {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-1) var(--space-2);
  padding: var(--space-2);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.words__context {
  display: block;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.words__item-actions {
  display: flex;
  gap: var(--space-2);
}

.words__link {
  min-height: 2.75rem;
  padding: 0 var(--space-1);
  border: none;
  background: none;
  color: var(--color-link);
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}

.words__link--danger {
  color: var(--color-error-text);
}
</style>
