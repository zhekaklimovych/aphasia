import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BottomNav from '~/components/app/BottomNav.vue'

describe('BottomNav', () => {
  it('показує посилання на всі основні розділи', async () => {
    const wrapper = await mountSuspended(BottomNav)

    const links = wrapper.findAll('a').map((a) => [a.text(), a.attributes('href')])

    expect(links).toEqual([
      ['Діалог', '/'],
      ['Історія', '/history'],
      ['Словник', '/words'],
      ['Профіль', '/profile'],
    ])
  })
  // aria-current ставить сам NuxtLink; у mountSuspended активний стан посилань
  // не відтворюється, тому це перевіряється в E2E (Playwright)
})
