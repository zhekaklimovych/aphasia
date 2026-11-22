import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AnswerButtons from '~/components/dialog/AnswerButtons.vue'

describe('AnswerButtons', () => {
  it('показує три кнопки з підписами', async () => {
    const wrapper = await mountSuspended(AnswerButtons)

    const labels = wrapper.findAll('button').map((button) => button.text())

    expect(labels).toEqual(['Так', 'Ні', 'Пропустити'])
  })

  it('емітить answer з відповіддю натиснутої кнопки', async () => {
    const wrapper = await mountSuspended(AnswerButtons)

    await wrapper.findAll('button')[1]?.trigger('click')

    expect(wrapper.emitted('answer')).toEqual([['NO']])
  })
})
