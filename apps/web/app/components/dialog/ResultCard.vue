<script setup lang="ts">
import type { DialogResult } from '~/types/dialog'

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
