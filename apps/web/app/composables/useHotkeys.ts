/** Обробники за KeyboardEvent.code, наприклад { KeyY: () => ... }. */
export type HotkeyMap = Partial<Record<string, () => void>>

/**
 * Глобальні гарячі клавіші, поки компонент змонтований.
 * Використовуємо event.code (фізична клавіша), щоб Y/N працювали
 * і в українській розкладці.
 */
export function useHotkeys(map: HotkeyMap) {
  function onKeydown(event: KeyboardEvent) {
    if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return
    if (isTypingTarget(event.target)) return

    const handler = map[event.code]
    if (!handler) return

    event.preventDefault()
    handler()
  }

  onMounted(() => window.addEventListener('keydown', onKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}
