<script setup lang="ts">
const props = defineProps<{
  current: number
  total: number
}>()

const label = computed(() => `Питання ${props.current} з ${props.total}`)
// useId дає унікальний id, однаковий на сервері й у браузері (важливо для SSR)
const labelId = useId()
</script>

<template>
  <div class="progress-bar">
    <span :id="labelId" class="progress-bar__label">{{ label }}</span>
    <progress
      class="progress-bar__track"
      :value="current"
      :max="total"
      :aria-labelledby="labelId"
    />
  </div>
</template>

<style scoped>
.progress-bar {
  display: grid;
  gap: var(--space-1);
}

.progress-bar__label {
  color: var(--color-text-muted);
  font-weight: 600;
}

.progress-bar__track {
  appearance: none;
  width: 100%;
  height: 1rem;
  border: none;
  border-radius: 999px;
  background: var(--color-border);
  overflow: hidden;
}

.progress-bar__track::-webkit-progress-bar {
  background: var(--color-border);
}

.progress-bar__track::-webkit-progress-value {
  background: var(--color-primary);
}

.progress-bar__track::-moz-progress-bar {
  background: var(--color-primary);
}
</style>
