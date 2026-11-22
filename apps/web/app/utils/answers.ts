import type { Answer } from '~/types/dialog'

/** Підписи відповідей для кнопок та історії. */
export const answerLabels: Record<Answer, string> = {
  YES: 'Так',
  NO: 'Ні',
  SKIP: 'Пропустити',
}

/** Гарячі клавіші відповідей: code — фізична клавіша, key — підпис на кнопці. */
export const answerHotkeys: Record<Answer, { code: string; key: string }> = {
  YES: { code: 'KeyY', key: 'Y' },
  NO: { code: 'KeyN', key: 'N' },
  SKIP: { code: 'KeyS', key: 'S' },
}
