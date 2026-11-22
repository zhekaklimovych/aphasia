import type { DialogMessage, SessionDetail } from '@aphasia/shared'

// Вигадані тестові діалоги для історії

function messages(
  input: string,
  turns: [question: string, answer: 'YES' | 'NO' | 'SKIP'][],
  result?: string,
): DialogMessage[] {
  const list: DialogMessage[] = [
    { id: 'm0', role: 'USER_INPUT', content: input, answer: null, sequence: 0 },
  ]
  turns.forEach(([question, answer]) => {
    list.push({
      id: `m${list.length}`,
      role: 'AI_QUESTION',
      content: question,
      answer: null,
      sequence: list.length,
    })
    list.push({
      id: `m${list.length}`,
      role: 'USER_ANSWER',
      content: answer,
      answer,
      sequence: list.length,
    })
  })
  if (result) {
    list.push({
      id: `m${list.length}`,
      role: 'AI_RESULT',
      content: result,
      answer: null,
      sequence: list.length,
    })
  }
  return list
}

export const mockSessions: SessionDetail[] = [
  {
    id: 'session-1',
    initialInput: 'чайник синій',
    status: 'COMPLETED',
    interpretation: 'Ви хочете чаю і просите заварити його в синьому чайнику',
    confidence: 0.82,
    wasCorrect: true,
    createdAt: '2026-11-20T09:15:00.000Z',
    messages: messages(
      'чайник синій',
      [
        ['Ви говорите про щось на кухні?', 'YES'],
        ['Ви хочете щось випити?', 'YES'],
        ['Ви хочете кави?', 'NO'],
        ['Ви хочете чаю?', 'YES'],
      ],
      'Ви хочете чаю і просите заварити його в синьому чайнику',
    ),
  },
  {
    id: 'session-2',
    initialInput: 'ходити далеко',
    status: 'COMPLETED',
    interpretation: 'Ви хочете піти в магазин',
    confidence: 0.55,
    wasCorrect: false,
    createdAt: '2026-11-19T16:40:00.000Z',
    messages: messages(
      'ходити далеко',
      [
        ['Ви хочете вийти з дому?', 'YES'],
        ['Вам потрібно щось купити?', 'SKIP'],
        ['Це про прогулянку?', 'NO'],
      ],
      'Ви хочете піти в магазин',
    ),
  },
  {
    id: 'session-3',
    initialInput: 'книга червона',
    status: 'ABANDONED',
    interpretation: null,
    confidence: null,
    wasCorrect: null,
    createdAt: '2026-11-18T11:05:00.000Z',
    messages: messages('книга червона', [['Ви хочете почитати?', 'YES']]),
  },
]
