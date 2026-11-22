<script setup lang="ts">
useHead({ title: 'Профіль' })

const auth = useAuthStore()
const dialog = useDialogStore()

async function logout() {
  auth.logout()
  dialog.reset()
  await navigateTo('/login')
}
</script>

<template>
  <div class="page">
    <h1 class="page__title">Профіль</h1>
    <p v-if="auth.user" class="page__text">Ви увійшли як {{ auth.user.email }}</p>
    <p class="page__text">Тут буде форма з вашими даними: ім'я, мова, темп діалогу.</p>
    <button type="button" class="btn btn--skip" @click="logout">Вийти</button>
  </div>
</template>
