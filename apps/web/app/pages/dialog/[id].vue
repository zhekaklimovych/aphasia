<script setup lang="ts">
const route = useRoute('dialog-id')

useHead({ title: 'Діалог' })
</script>

<template>
  <div class="page">
    <h1 class="page__title">Діалог</h1>
    <p class="page__text">Деталі діалогу {{ route.params.id }} з'являться тут.</p>
    <NuxtLink to="/history">← До історії</NuxtLink>
  </div>
</template>
