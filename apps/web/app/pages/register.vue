<script setup lang="ts">
import { RegisterSchema } from '@aphasia/shared'

definePageMeta({ layout: 'auth', public: true })
useHead({ title: 'Реєстрація' })

const auth = useAuthStore()
const formEl = useTemplateRef<HTMLFormElement>('form')
const { values, errors, submitting, submit } = useZodForm(RegisterSchema, {
  email: '',
  password: '',
})

async function onSubmit() {
  const ok = await submit(async (data) => {
    await auth.register(data)
    await navigateTo('/profile')
  })
  if (!ok) await focusFirstInvalid(formEl.value)
}
</script>

<template>
  <div class="page">
    <h1 class="page__title">Реєстрація</h1>

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
        label="Пароль (щонайменше 8 символів)"
        type="password"
        autocomplete="new-password"
        :error="errors.password"
      />
      <button type="submit" class="btn" :disabled="submitting">Зареєструватися</button>
    </form>

    <p class="page__text">Вже є акаунт? <NuxtLink to="/login">Увійти</NuxtLink></p>
  </div>
</template>
