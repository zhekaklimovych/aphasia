<script setup lang="ts">
import { ProfileInputSchema } from '@aphasia/shared'
import { mockApi } from '~/mocks/api'

useHead({ title: 'Профіль' })

const auth = useAuthStore()
const dialog = useDialogStore()

const { data: profile, status } = useAsyncData('profile', () => mockApi.getProfile(), {
  server: false,
})

const formEl = useTemplateRef<HTMLFormElement>('form')
const { values, errors, submitting, submit } = useZodForm(ProfileInputSchema, emptyProfileForm)
// Захоплення вводяться одним рядком через кому
const hobbiesText = ref('')
const saved = ref(false)

watch(
  profile,
  (loaded) => {
    if (!loaded) return
    values.value = profileToForm(loaded)
    hobbiesText.value = loaded.hobbies.join(', ')
  },
  { immediate: true },
)

watch([values, hobbiesText], () => (saved.value = false), { deep: true })

async function onSubmit() {
  values.value.hobbies = parseList(hobbiesText.value)
  const ok = await submit(async (data) => {
    profile.value = await mockApi.saveProfile(data)
  })
  if (ok) saved.value = true
  else await focusFirstInvalid(formEl.value)
}

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

    <!-- idle: на сервері дані ще не запитувались (мок працює лише в браузері) -->
    <p v-if="status === 'idle' || status === 'pending'" class="page__text">Завантаження…</p>

    <form v-else ref="form" class="form" novalidate @submit.prevent="onSubmit">
      <FormTextField
        v-model="values.firstName"
        label="Ім'я"
        autocomplete="given-name"
        :error="errors.firstName"
      />
      <FormTextField
        v-model="values.birthDate"
        label="Дата народження"
        type="date"
        autocomplete="bday"
        :error="errors.birthDate"
      />
      <FormTextField
        v-model="values.disorderType"
        label="Тип порушення мовлення"
        :error="errors.disorderType"
      />
      <FormRadioGroup
        v-model="values.severity"
        legend="Тяжкість"
        :options="severityOptions"
        :error="errors.severity"
      />
      <FormRadioGroup
        v-model="values.preferredPace"
        legend="Темп діалогу"
        :options="paceOptions"
        :error="errors.preferredPace"
      />
      <FormTextField
        v-model="values.occupation"
        label="Заняття"
        autocomplete="organization-title"
        :error="errors.occupation"
      />
      <FormTextField
        v-model="hobbiesText"
        label="Захоплення (через кому)"
        :error="errors.hobbies"
      />

      <button type="submit" class="btn" :disabled="submitting">Зберегти</button>
      <p role="status" class="page__text">{{ saved ? 'Профіль збережено' : '' }}</p>
    </form>

    <button type="button" class="btn btn--skip" @click="logout">Вийти</button>
  </div>
</template>
