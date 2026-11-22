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
