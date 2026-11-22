import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import TextField from '~/components/form/TextField.vue'

describe('TextField', () => {
  it('звʼязує підпис з полем', async () => {
    const wrapper = await mountSuspended(TextField, { props: { label: 'Email' } })

    const id = wrapper.find('input').attributes('id')

    expect(wrapper.find('label').attributes('for')).toBe(id)
  })

  it('без помилки поле не позначене як невалідне', async () => {
    const wrapper = await mountSuspended(TextField, { props: { label: 'Email' } })

    expect(wrapper.find('input').attributes('aria-invalid')).toBeUndefined()
    expect(wrapper.find('.field__error').exists()).toBe(false)
  })

  it('показує помилку і звʼязує її з полем через aria-describedby', async () => {
    const wrapper = await mountSuspended(TextField, {
      props: { label: 'Email', error: 'Невірний email' },
    })
    const input = wrapper.find('input')
    const error = wrapper.find('.field__error')

    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe(error.attributes('id'))
    expect(error.text()).toBe('Невірний email')
  })

  it('працює з v-model', async () => {
    const wrapper = await mountSuspended(TextField, {
      props: { label: 'Email', modelValue: '' },
    })

    await wrapper.find('input').setValue('test@example.com')

    expect(wrapper.emitted('update:modelValue')).toEqual([['test@example.com']])
  })
})
