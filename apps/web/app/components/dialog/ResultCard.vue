<script setup lang="ts">
import type { DialogResult } from '@aphasia/shared'

const props = defineProps<{
  result: DialogResult
}>()

// Слот для кнопок: що робити з результатом, вирішує сторінка, а не картка
defineSlots<{
  actions?: () => unknown
}>()

const confidencePercent = computed(() => Math.round(props.result.confidence * 100))
</script>

<template>
  <section class="result-card" aria-live="polite">
    <p class="result-card__label">Можливо, ви мали на увазі:</p>
    <h2 class="result-card__interpretation">{{ result.interpretation }}</h2>
    <p class="result-card__confidence">Впевненість: {{ confidencePercent }}%</p>
    <div v-if="$slots.actions" class="result-card__actions">
      <slot name="actions" />
    </div>
  </section>
</template>

<style scoped>
.result-card {
  display: grid;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-3);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
}

.result-card__label,
.result-card__confidence {
  margin: 0;
  color: var(--color-text-muted);
}

.result-card__interpretation {
  font-size: 1.6rem;
}
</style>
