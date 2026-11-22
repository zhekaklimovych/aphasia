import type { Answer, DialogResult, HistoryEntry, Question } from '@aphasia/shared'
import type { DialogStatus } from '~/types/dialog'
import { mockQuestions, mockResult } from '~/mocks/questions'

/** Питання і підсумок для одного діалогу. Поки що з моків, на етапі 4 — з API. */
export interface DialogScenario {
  questions: readonly Question[]
  result: DialogResult
}

const defaultScenario: DialogScenario = { questions: mockQuestions, result: mockResult }

/**
 * Стан активного діалогу: idle → asking → result → done, reset() повертає в idle.
 * У Pinia, щоб діалог не губився при переході між сторінками.
 */
export const useDialogStore = defineStore('dialog', () => {
  const status = ref<DialogStatus>('idle')
  const input = ref('')
  const questions = ref<Question[]>([])
  const finalResult = ref<DialogResult | null>(null)
  const index = ref(0)
  const history = ref<HistoryEntry[]>([])
  const wasCorrect = ref<boolean | null>(null)

  const currentQuestion = computed(() => {
    if (status.value !== 'asking') return null
    return questions.value[index.value] ?? null
  })

  const progress = computed(() => ({
    current: Math.min(index.value + 1, questions.value.length),
    total: questions.value.length,
  }))

  const result = computed(() => {
    if (status.value === 'result' || status.value === 'done') return finalResult.value
    return null
  })

  function start(text: string, scenario: DialogScenario = defaultScenario) {
    const trimmed = text.trim()
    if (status.value !== 'idle' || !trimmed) return

    input.value = trimmed
    questions.value = [...scenario.questions]
    finalResult.value = scenario.result
    index.value = 0
    history.value = []
    wasCorrect.value = null
    status.value = 'asking'
  }

  function answer(value: Answer) {
    const question = currentQuestion.value
    if (status.value !== 'asking' || !question) return

    history.value.push({ question, answer: value })
    index.value++

    if (index.value >= questions.value.length) {
      status.value = 'result'
    }
  }

  function confirm(correct: boolean) {
    if (status.value !== 'result') return

    wasCorrect.value = correct
    status.value = 'done'
  }

  function reset() {
    status.value = 'idle'
    input.value = ''
    questions.value = []
    finalResult.value = null
    index.value = 0
    history.value = []
    wasCorrect.value = null
  }

  // Увесь стан повертаємо як ref: Pinia так серіалізує його для SSR і показує в devtools.
  // Змінювати стан ззовні — лише через start / answer / confirm / reset.
  return {
    status,
    input,
    questions,
    finalResult,
    index,
    history,
    wasCorrect,
    currentQuestion,
    progress,
    result,
    start,
    answer,
    confirm,
    reset,
  }
})
