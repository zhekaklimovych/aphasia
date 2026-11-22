<script setup lang="ts">
const emit = defineEmits<{
  submit: [text: string]
}>()

// Текст поля — локальний стан форми, діалогу він не потрібен до натискання "Почати"
const text = ref('')
const canSubmit = computed(() => text.value.trim().length > 0)
const inputId = useId()
const input = useTemplateRef<HTMLInputElement>('input')

// Фокус одразу в полі: користувач може почати друкувати без миші
onMounted(() => input.value?.focus())

function onSubmit() {
  if (!canSubmit.value) return
  emit('submit', text.value)
}
</script>

<template>
  <form class="input-form" @submit.prevent="onSubmit">
    <label :for="inputId" class="input-form__label">Що ви хочете сказати?</label>
    <input
      :id="inputId"
      ref="input"
      v-model="text"
      class="input-form__input"
      type="text"
      autocomplete="off"
      placeholder="Наприклад: чайник синій"
    />
    <button type="submit" class="btn" :disabled="!canSubmit">Почати</button>
  </form>
</template>

<style scoped>
.input-form {
  display: grid;
  gap: var(--space-2);
}

.input-form__label {
  font-size: 1.4rem;
  font-weight: 600;
}

.input-form__input {
  min-height: var(--button-min-height);
  padding: var(--space-1) var(--space-2);
  border: 2px solid var(--color-text-muted);
  border-radius: var(--radius);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 1.4rem;
}

.input-form__input::placeholder {
  color: var(--color-text-muted);
}
</style>
