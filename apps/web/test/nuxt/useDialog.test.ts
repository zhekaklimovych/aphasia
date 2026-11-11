import { describe, expect, it } from 'vitest'
import type { DialogResult, Question } from '~/types/dialog'

// Власні короткі дані, щоб тести не залежали від моків застосунку.
const questions: Question[] = [
  { id: 't1', text: 'Перше питання?' },
  { id: 't2', text: 'Друге питання?' },
]
const result: DialogResult = { interpretation: 'Тестова інтерпретація', confidence: 0.5 }

// Діалог, щойно розпочатий: стан 'asking', перше питання.
function startedDialog() {
  const dialog = useDialog(questions, result)
  dialog.start('чайник')
  return dialog
}

// Діалог після відповіді на всі питання: стан 'result'.
function finishedDialog() {
  const dialog = startedDialog()
  questions.forEach(() => dialog.answer('YES'))
  return dialog
}

describe('useDialog', () => {
  describe('переходи', () => {
    it('починає в стані idle без питання і результату', () => {
      const dialog = useDialog(questions, result)

      expect(dialog.status.value).toBe('idle')
      expect(dialog.currentQuestion.value).toBeNull()
      expect(dialog.result.value).toBeNull()
    })

    it('start() переходить в asking і показує перше питання', () => {
      const dialog = useDialog(questions, result)

      dialog.start('  чайник  ')

      expect(dialog.status.value).toBe('asking')
      expect(dialog.input.value).toBe('чайник')
      expect(dialog.currentQuestion.value).toEqual(questions[0])
      expect(dialog.progress.value).toEqual({ current: 1, total: 2 })
    })

    it('answer() записує відповідь в історію і показує наступне питання', () => {
      const dialog = startedDialog()

      dialog.answer('YES')

      expect(dialog.history.value).toEqual([{ question: questions[0], answer: 'YES' }])
      expect(dialog.currentQuestion.value).toEqual(questions[1])
      expect(dialog.progress.value).toEqual({ current: 2, total: 2 })
    })

    it('SKIP записується як відповідь і перемикає питання', () => {
      const dialog = startedDialog()

      dialog.answer('SKIP')

      expect(dialog.history.value[0]?.answer).toBe('SKIP')
      expect(dialog.currentQuestion.value).toEqual(questions[1])
    })

    it('після останньої відповіді переходить в result', () => {
      const dialog = finishedDialog()

      expect(dialog.status.value).toBe('result')
      expect(dialog.currentQuestion.value).toBeNull()
      expect(dialog.result.value).toEqual(result)
      expect(dialog.history.value).toHaveLength(questions.length)
    })

    it('confirm() переходить в done і зберігає відповідь користувача', () => {
      const dialog = finishedDialog()

      dialog.confirm(true)

      expect(dialog.status.value).toBe('done')
      expect(dialog.wasCorrect.value).toBe(true)
      expect(dialog.result.value).toEqual(result)
    })

    it('reset() повертає все до початкового стану', () => {
      const dialog = finishedDialog()
      dialog.confirm(false)

      dialog.reset()

      expect(dialog.status.value).toBe('idle')
      expect(dialog.input.value).toBe('')
      expect(dialog.history.value).toEqual([])
      expect(dialog.wasCorrect.value).toBeNull()
      expect(dialog.result.value).toBeNull()
    })
  })

  describe('захист від неможливих переходів', () => {
    it('start() з порожнім текстом нічого не робить', () => {
      const dialog = useDialog(questions, result)

      dialog.start('   ')

      expect(dialog.status.value).toBe('idle')
      expect(dialog.input.value).toBe('')
    })

    it('повторний start() під час діалогу ігнорується', () => {
      const dialog = startedDialog()
      dialog.answer('NO')

      dialog.start('інший текст')

      expect(dialog.input.value).toBe('чайник')
      expect(dialog.progress.value.current).toBe(2)
    })

    it('answer() до старту нічого не робить', () => {
      const dialog = useDialog(questions, result)

      dialog.answer('YES')

      expect(dialog.status.value).toBe('idle')
      expect(dialog.history.value).toEqual([])
    })

    it('confirm() до появи результату нічого не робить', () => {
      const dialog = startedDialog()

      dialog.confirm(true)

      expect(dialog.status.value).toBe('asking')
      expect(dialog.wasCorrect.value).toBeNull()
    })
  })
})
