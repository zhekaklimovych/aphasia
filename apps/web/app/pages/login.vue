<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useHead({ title: 'Вхід' })
</script>

<template>
  <div class="page">
    <h1 class="page__title">Вхід</h1>
    <p class="page__text">Форма входу з'явиться тут.</p>
    <p class="page__text">Немає акаунта? <NuxtLink to="/register">Зареєструватися</NuxtLink></p>
  </div>
</template>
