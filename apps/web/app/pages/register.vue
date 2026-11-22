<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useHead({ title: 'Реєстрація' })
</script>

<template>
  <div class="page">
    <h1 class="page__title">Реєстрація</h1>
    <p class="page__text">Форма реєстрації з'явиться тут.</p>
    <p class="page__text">Вже є акаунт? <NuxtLink to="/login">Увійти</NuxtLink></p>
  </div>
</template>
