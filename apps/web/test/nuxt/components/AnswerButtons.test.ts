import { afterEach, describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { VueWrapper } from '@vue/test-utils'
import AnswerButtons from '~/components/dialog/AnswerButtons.vue'

function pressKey(code: string, target: EventTarget = window) {
  target.dispatchEvent(new KeyboardEvent('keydown', { code, bubbles: true }))
}

describe('AnswerButtons', () => {
  let wrapper: VueWrapper | undefined

  // Знімаємо компонент, щоб його слухач клавіш не впливав на наступні тести
  afterEach(() => wrapper?.unmount())

  it('показує три кнопки з підписами', async () => {
    wrapper = await mountSuspended(AnswerButtons)

    const labels = wrapper.findAll('button').map((button) => button.text())

    expect(labels).toEqual(['Так Y', 'Ні N', 'Пропустити S'])
  })

  it('емітить answer з відповіддю натиснутої кнопки', async () => {
    wrapper = await mountSuspended(AnswerButtons)

    await wrapper.findAll('button')[1]?.trigger('click')

    expect(wrapper.emitted('answer')).toEqual([['NO']])
  })

  it('відповідає з клавіатури клавішами Y, N, S', async () => {
    wrapper = await mountSuspended(AnswerButtons)

    pressKey('KeyY')
    pressKey('KeyN')
    pressKey('KeyS')

    expect(wrapper.emitted('answer')).toEqual([['YES'], ['NO'], ['SKIP']])
  })

  it('ігнорує клавіші, поки фокус у полі вводу', async () => {
    wrapper = await mountSuspended(AnswerButtons)
    const input = document.createElement('input')
    document.body.append(input)

    pressKey('KeyY', input)

    expect(wrapper.emitted('answer')).toBeUndefined()
    input.remove()
  })

  it('ігнорує інші клавіші', async () => {
    wrapper = await mountSuspended(AnswerButtons)

    pressKey('KeyA')

    expect(wrapper.emitted('answer')).toBeUndefined()
  })
})
