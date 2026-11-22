import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ResultCard from '~/components/dialog/ResultCard.vue'

const result = { interpretation: 'Тестова інтерпретація', confidence: 0.825 }

describe('ResultCard', () => {
  it('показує інтерпретацію і впевненість у відсотках', async () => {
    const wrapper = await mountSuspended(ResultCard, { props: { result } })

    expect(wrapper.text()).toContain('Тестова інтерпретація')
    expect(wrapper.text()).toContain('Впевненість: 83%')
  })

  it('рендерить вміст слоту actions', async () => {
    const wrapper = await mountSuspended(ResultCard, {
      props: { result },
      slots: { actions: () => h('button', 'Підтвердити') },
    })

    expect(wrapper.find('.result-card__actions button').text()).toBe('Підтвердити')
  })
})
