import type { Answer, DialogStatus, HistoryEntry } from '~/types/dialog'
import { mockQuestions, mockResult } from '~/mocks/questions'

export function useDialog(questions = mockQuestions, finalResult = mockResult) {
  const status = ref<DialogStatus>('idle')
  const input = ref('')
  const index = ref(0) // номер поточного питання
  const history = ref<HistoryEntry[]>([])
  const wasCorrect = ref<boolean | null>(null)

  const currentQuestion = computed(() => {
    if (status.value !== 'asking') return null
    return questions[index.value] ?? null
  })

  const progress = computed(() => ({
    current: Math.min(index.value + 1, questions.length),
    total: questions.length,
  }))

  const result = computed(() => {
    if (status.value === 'result' || status.value === 'done') return finalResult
    return null
  })

  function start(text: string) {
    const trimmed = text.trim()
    if (status.value !== 'idle' || !trimmed) return

    input.value = trimmed
    index.value = 0
    history.value = []
    status.value = 'asking'
  }

  function answer(value: Answer) {
    const question = currentQuestion.value
    if (status.value !== 'asking' || !question) return

    history.value.push({ question, answer: value })
    index.value++

    if (index.value >= questions.length) {
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
    index.value = 0
    history.value = []
    wasCorrect.value = null
  }

  return {
    status: readonly(status),
    input: readonly(input),
    history: readonly(history),
    wasCorrect: readonly(wasCorrect),
    currentQuestion,
    progress,
    result,
    start,
    answer,
    confirm,
    reset,
  }
}
