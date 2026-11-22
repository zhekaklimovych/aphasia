import { describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'

// Мінімальний компонент, який лише реєструє гарячі клавіші
async function mountWithHotkeys(map: HotkeyMap) {
  return mountSuspended(
    defineComponent({
      setup() {
        useHotkeys(map)
        return () => h('div')
      },
    }),
  )
}

function press(code: string, init: KeyboardEventInit = {}) {
  window.dispatchEvent(new KeyboardEvent('keydown', { code, ...init }))
}

describe('useHotkeys', () => {
  it('викликає обробник для своєї клавіші', async () => {
    const onY = vi.fn()
    const wrapper = await mountWithHotkeys({ KeyY: onY })

    press('KeyY')

    expect(onY).toHaveBeenCalledOnce()
    wrapper.unmount()
  })

  it('ігнорує комбінації з Ctrl/Alt/Meta і утримання клавіші', async () => {
    const onY = vi.fn()
    const wrapper = await mountWithHotkeys({ KeyY: onY })

    press('KeyY', { ctrlKey: true })
    press('KeyY', { altKey: true })
    press('KeyY', { metaKey: true })
    press('KeyY', { repeat: true })

    expect(onY).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('знімає слухача після unmount', async () => {
    const onY = vi.fn()
    const wrapper = await mountWithHotkeys({ KeyY: onY })

    wrapper.unmount()
    press('KeyY')

    expect(onY).not.toHaveBeenCalled()
  })
})
