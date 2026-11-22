import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import InputForm from '~/components/dialog/InputForm.vue'

describe('InputForm', () => {
  it('кнопка вимкнена, поки поле порожнє', async () => {
    const wrapper = await mountSuspended(InputForm)

    await wrapper.find('input').setValue('   ')

    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('не емітить submit для порожнього тексту', async () => {
    const wrapper = await mountSuspended(InputForm)

    await wrapper.find('input').setValue('   ')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('емітить submit з введеним текстом', async () => {
    const wrapper = await mountSuspended(InputForm)

    await wrapper.find('input').setValue('чайник синій')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toEqual([['чайник синій']])
  })
})
