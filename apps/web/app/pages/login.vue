<script setup lang="ts">
import { LoginSchema } from '@aphasia/shared'

definePageMeta({ layout: 'auth', public: true })
useHead({ title: 'Вхід' })

const auth = useAuthStore()
const route = useRoute()
const formEl = useTemplateRef<HTMLFormElement>('form')
const { values, errors, submitting, submit } = useZodForm(LoginSchema, { email: '', password: '' })

async function onSubmit() {
  const ok = await submit(async (data) => {
    await auth.login(data)
    await navigateTo(safeRedirect(route.query.redirect))
  })
  if (!ok) await focusFirstInvalid(formEl.value)
}
</script>

<template>
  <div class="page">
    <h1 class="page__title">Вхід</h1>

    <form ref="form" class="form" novalidate @submit.prevent="onSubmit">
      <FormTextField
        v-model="values.email"
        label="Email"
        type="email"
        autocomplete="email"
        :error="errors.email"
      />
      <FormTextField
        v-model="values.password"
        label="Пароль"
        type="password"
        autocomplete="current-password"
        :error="errors.password"
      />
      <button type="submit" class="btn" :disabled="submitting">Увійти</button>
    </form>

    <p class="page__text">Немає акаунта? <NuxtLink to="/register">Зареєструватися</NuxtLink></p>
  </div>
</template>
