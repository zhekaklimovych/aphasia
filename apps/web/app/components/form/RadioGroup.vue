<script setup lang="ts" generic="T extends string">
const model = defineModel<T>()

const props = defineProps<{
  legend: string
  options: readonly { value: T; label: string }[]
  error?: string
}>()

const name = useId()
const errorId = `${name}-error`
</script>

<template>
  <fieldset
    class="radio-group"
    :aria-invalid="props.error ? 'true' : undefined"
    :aria-describedby="props.error ? errorId : undefined"
  >
    <legend class="field__label">{{ props.legend }}</legend>
    <div class="radio-group__options">
      <label v-for="option in props.options" :key="option.value" class="radio-group__option">
        <input v-model="model" type="radio" :name="name" :value="option.value" />
        {{ option.label }}
      </label>
    </div>
    <p v-if="props.error" :id="errorId" class="field__error">{{ props.error }}</p>
  </fieldset>
</template>

<style scoped>
.radio-group {
  margin: 0;
  padding: 0;
  border: none;
  display: grid;
  gap: var(--space-1);
}

.radio-group__options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  gap: var(--space-1);
}

.radio-group__option {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  min-height: 3.5rem;
  padding: var(--space-1) var(--space-2);
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  cursor: pointer;
}

.radio-group__option:has(input:checked) {
  border-color: var(--color-primary);
  font-weight: 600;
}

.radio-group__option input {
  width: 1.25rem;
  height: 1.25rem;
  accent-color: var(--color-primary);
}
</style>
