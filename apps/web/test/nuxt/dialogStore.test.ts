import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { Question } from '@aphasia/shared'
import type { DialogScenario } from '~/stores/dialog'

// Власні короткі дані, щоб тести не залежали від моків застосунку.
const questions: Question[] = [
  { id: 't1', text: 'Перше питання?' },
  { id: 't2', text: 'Друге питання?' },
]
const scenario: DialogScenario = {
  questions,
  result: { interpretation: 'Тестова інтерпретація', confidence: 0.5 },
}

// Діалог, щойно розпочатий: стан 'asking', перше питання.
function startedDialog() {
  const dialog = useDialogStore()
  dialog.start('чайник', scenario)
  return dialog
}

// Діалог після відповіді на всі питання: стан 'result'.
function finishedDialog() {
  const dialog = startedDialog()
  questions.forEach(() => dialog.answer('YES'))
  return dialog
}

describe('dialog store', () => {
  // Свіжий Pinia на кожен тест: store — синглтон, без цього стан перетікав би між тестами
  beforeEach(() => setActivePinia(createPinia()))

  describe('переходи', () => {
    it('починає в стані idle без питання і результату', () => {
      const dialog = useDialogStore()

      expect(dialog.status).toBe('idle')
      expect(dialog.currentQuestion).toBeNull()
      expect(dialog.result).toBeNull()
    })

    it('start() переходить в asking і показує перше питання', () => {
      const dialog = useDialogStore()

      dialog.start('  чайник  ', scenario)

      expect(dialog.status).toBe('asking')
      expect(dialog.input).toBe('чайник')
      expect(dialog.currentQuestion).toEqual(questions[0])
      expect(dialog.progress).toEqual({ current: 1, total: 2 })
    })

    it('без сценарію бере мок-питання', () => {
      const dialog = useDialogStore()

      dialog.start('чайник')

      expect(dialog.progress.total).toBeGreaterThan(0)
      expect(dialog.currentQuestion).not.toBeNull()
    })

    it('answer() записує відповідь в історію і показує наступне питання', () => {
      const dialog = startedDialog()

      dialog.answer('YES')

      expect(dialog.history).toEqual([{ question: questions[0], answer: 'YES' }])
      expect(dialog.currentQuestion).toEqual(questions[1])
      expect(dialog.progress).toEqual({ current: 2, total: 2 })
    })

    it('SKIP записується як відповідь і перемикає питання', () => {
      const dialog = startedDialog()

      dialog.answer('SKIP')

      expect(dialog.history[0]?.answer).toBe('SKIP')
      expect(dialog.currentQuestion).toEqual(questions[1])
    })

    it('після останньої відповіді переходить в result', () => {
      const dialog = finishedDialog()

      expect(dialog.status).toBe('result')
      expect(dialog.currentQuestion).toBeNull()
      expect(dialog.result).toEqual(scenario.result)
      expect(dialog.history).toHaveLength(questions.length)
    })

    it('confirm() переходить в done і зберігає відповідь користувача', () => {
      const dialog = finishedDialog()

      dialog.confirm(true)

      expect(dialog.status).toBe('done')
      expect(dialog.wasCorrect).toBe(true)
      expect(dialog.result).toEqual(scenario.result)
    })

    it('reset() повертає все до початкового стану', () => {
      const dialog = finishedDialog()
      dialog.confirm(false)

      dialog.reset()

      expect(dialog.status).toBe('idle')
      expect(dialog.input).toBe('')
      expect(dialog.history).toEqual([])
      expect(dialog.wasCorrect).toBeNull()
      expect(dialog.result).toBeNull()
    })
  })

  describe('захист від неможливих переходів', () => {
    it('start() з порожнім текстом нічого не робить', () => {
      const dialog = useDialogStore()

      dialog.start('   ', scenario)

      expect(dialog.status).toBe('idle')
      expect(dialog.input).toBe('')
    })

    it('повторний start() під час діалогу ігнорується', () => {
      const dialog = startedDialog()
      dialog.answer('NO')

      dialog.start('інший текст', scenario)

      expect(dialog.input).toBe('чайник')
      expect(dialog.progress.current).toBe(2)
    })

    it('answer() до старту нічого не робить', () => {
      const dialog = useDialogStore()

      dialog.answer('YES')

      expect(dialog.status).toBe('idle')
      expect(dialog.history).toEqual([])
    })

    it('confirm() до появи результату нічого не робить', () => {
      const dialog = startedDialog()

      dialog.confirm(true)

      expect(dialog.status).toBe('asking')
      expect(dialog.wasCorrect).toBeNull()
    })
  })

  it('стан спільний: повторний виклик useDialogStore() бачить той самий діалог', () => {
    startedDialog().answer('YES')

    const sameDialog = useDialogStore()

    expect(sameDialog.status).toBe('asking')
    expect(sameDialog.history).toHaveLength(1)
  })
})
