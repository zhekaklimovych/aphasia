import type { DialogResult, Question } from '~/types/dialog'

// Сценарій для вводу "чайник синій". Дані вигадані.
// Питання звужуються від загального до конкретного.
export const mockQuestions: readonly Question[] = [
  { id: 'q1', text: 'Ви говорите про щось на кухні?' },
  { id: 'q2', text: 'Ви хочете щось випити?' },
  { id: 'q3', text: 'Це гарячий напій?' },
  { id: 'q4', text: 'Ви хочете кави?' },
  { id: 'q5', text: 'Ви хочете чаю?' },
  { id: 'q6', text: 'Вам потрібен чайник, щоб його заварити?' },
  { id: 'q7', text: 'Важливо, щоб це був саме синій чайник?' },
  { id: 'q8', text: 'Ви хочете, щоб хтось приготував чай для вас?' },
]

export const mockResult: DialogResult = {
  interpretation: 'Ви хочете чаю і просите, щоб його заварили в синьому чайнику',
  confidence: 0.82,
}
