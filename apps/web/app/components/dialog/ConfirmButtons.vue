<script setup lang="ts">
const emit = defineEmits<{
  confirm: [correct: boolean]
}>()

useHotkeys({
  KeyY: () => emit('confirm', true),
  KeyN: () => emit('confirm', false),
})
</script>

<template>
  <div class="confirm-buttons" role="group" aria-label="Чи правильно ми вас зрозуміли?">
    <button type="button" class="btn btn--yes" aria-keyshortcuts="Y" @click="emit('confirm', true)">
      Так, я це мав на увазі
      <kbd aria-hidden="true">Y</kbd>
    </button>
    <button type="button" class="btn btn--no" aria-keyshortcuts="N" @click="emit('confirm', false)">
      Ні
      <kbd aria-hidden="true">N</kbd>
    </button>
  </div>
</template>

<style scoped>
.confirm-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: var(--space-2);
}
</style>
