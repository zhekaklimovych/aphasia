<script setup lang="ts">
const model = defineModel<string>({ default: '' })

const props = defineProps<{
  label: string
  type?: string
  error?: string
  autocomplete?: string
}>()

const id = useId()
const errorId = `${id}-error`
</script>

<template>
  <div class="field">
    <label :for="id" class="field__label">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      class="field__input"
      :type="props.type ?? 'text'"
      :autocomplete="props.autocomplete"
      :aria-invalid="props.error ? 'true' : undefined"
      :aria-describedby="props.error ? errorId : undefined"
    />
    <p v-if="props.error" :id="errorId" class="field__error">{{ props.error }}</p>
  </div>
</template>
