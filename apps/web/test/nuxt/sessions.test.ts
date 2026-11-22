import { describe, expect, it } from 'vitest'
import type { DialogMessage, SessionSummary } from '@aphasia/shared'

function session(overrides: Partial<SessionSummary>): SessionSummary {
  return {
    id: 's',
    initialInput: 'тест',
    status: 'COMPLETED',
    interpretation: 'x',
    confidence: 0.5,
    wasCorrect: true,
    createdAt: '2026-11-20T09:00:00.000Z',
    ...overrides,
  }
}

describe('computeStats', () => {
  it('рахує частку правильних серед завершених', () => {
    const stats = computeStats([
      session({ wasCorrect: true }),
      session({ wasCorrect: true }),
      session({ wasCorrect: false }),
      session({ status: 'ABANDONED', wasCorrect: null }),
    ])

    expect(stats).toEqual({ total: 4, completed: 3, successRate: 2 / 3 })
  })

  it('без завершених сесій повертає 0, а не NaN', () => {
    expect(computeStats([]).successRate).toBe(0)
    expect(computeStats([session({ status: 'ACTIVE', wasCorrect: null })]).successRate).toBe(0)
  })
})

describe('messagesToHistory', () => {
  const msg = (
    sequence: number,
    role: DialogMessage['role'],
    content: string,
    answer: DialogMessage['answer'] = null,
  ): DialogMessage => ({ id: `m${sequence}`, role, content, answer, sequence })

  it('збирає пари питання — відповідь у порядку sequence', () => {
    const history = messagesToHistory([
      msg(3, 'AI_QUESTION', 'Друге?'),
      msg(0, 'USER_INPUT', 'чайник'),
      msg(1, 'AI_QUESTION', 'Перше?'),
      msg(4, 'USER_ANSWER', 'NO', 'NO'),
      msg(2, 'USER_ANSWER', 'YES', 'YES'),
      msg(5, 'AI_RESULT', 'Результат'),
    ])

    expect(history).toEqual([
      { question: { id: 'm1', text: 'Перше?' }, answer: 'YES' },
      { question: { id: 'm3', text: 'Друге?' }, answer: 'NO' },
    ])
  })

  it('пропускає питання без відповіді', () => {
    expect(messagesToHistory([msg(0, 'AI_QUESTION', 'Без відповіді?')])).toEqual([])
  })
})

describe('sessionOutcome', () => {
  it('описує результат сесії', () => {
    expect(sessionOutcome(session({ wasCorrect: true })).label).toBe('Зрозуміли')
    expect(sessionOutcome(session({ wasCorrect: false })).label).toBe('Не зрозуміли')
    expect(sessionOutcome(session({ status: 'ABANDONED' })).label).toBe('Перервано')
  })
})
