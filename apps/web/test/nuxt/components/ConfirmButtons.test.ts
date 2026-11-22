import { afterEach, describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { VueWrapper } from '@vue/test-utils'
import ConfirmButtons from '~/components/dialog/ConfirmButtons.vue'

describe('ConfirmButtons', () => {
  let wrapper: VueWrapper | undefined

  afterEach(() => wrapper?.unmount())

  it('емітить confirm(true) і confirm(false) по кліку', async () => {
    wrapper = await mountSuspended(ConfirmButtons)
    const [yes, no] = wrapper.findAll('button')

    await yes?.trigger('click')
    await no?.trigger('click')

    expect(wrapper.emitted('confirm')).toEqual([[true], [false]])
  })

  it('підтверджує клавішами Y і N', async () => {
    wrapper = await mountSuspended(ConfirmButtons)

    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyY' }))
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyN' }))

    expect(wrapper.emitted('confirm')).toEqual([[true], [false]])
  })
})
