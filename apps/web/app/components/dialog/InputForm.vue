<script setup lang="ts">
const emit = defineEmits<{
  submit: [text: string]
}>()

// Текст поля — локальний стан форми, діалогу він не потрібен до натискання "Почати"
const text = ref('')
const canSubmit = computed(() => text.value.trim().length > 0)
const inputId = useId()

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
      v-model="text"
      class="input-form__input"
      type="text"
      autocomplete="off"
      placeholder="Наприклад: чайник синій"
    />
    <button type="submit" class="input-form__submit" :disabled="!canSubmit">Почати</button>
  </form>
</template>
