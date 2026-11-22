import type { DialogMessage, HistoryEntry, SessionStats, SessionSummary } from '@aphasia/shared'

/** Статистика за списком сесій. На бекенді рахуватиметься SQL-запитом. */
export function computeStats(sessions: readonly SessionSummary[]): SessionStats {
  const completed = sessions.filter((session) => session.status === 'COMPLETED')
  const successful = completed.filter((session) => session.wasCorrect === true)
  return {
    total: sessions.length,
    completed: completed.length,
    successRate: completed.length ? successful.length / completed.length : 0,
  }
}

/** Повідомлення сесії → пари "питання — відповідь" для DialogHistory. */
export function messagesToHistory(messages: readonly DialogMessage[]): HistoryEntry[] {
  const sorted = [...messages].sort((a, b) => a.sequence - b.sequence)
  const entries: HistoryEntry[] = []

  sorted.forEach((message, i) => {
    const next = sorted[i + 1]
    if (message.role === 'AI_QUESTION' && next?.role === 'USER_ANSWER' && next.answer) {
      entries.push({ question: { id: message.id, text: message.content }, answer: next.answer })
    }
  })
  return entries
}

/** Короткий підсумок сесії для бейджа в історії. */
export function sessionOutcome(session: SessionSummary): { label: string; tone: string } {
  if (session.status === 'ABANDONED') return { label: 'Перервано', tone: 'skip' }
  if (session.status === 'ACTIVE') return { label: 'Не завершено', tone: 'skip' }
  if (session.wasCorrect === true) return { label: 'Зрозуміли', tone: 'yes' }
  if (session.wasCorrect === false) return { label: 'Не зрозуміли', tone: 'no' }
  return { label: 'Без відповіді', tone: 'skip' }
}

const dateFormatter = new Intl.DateTimeFormat('uk-UA', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

export function formatDate(iso: string) {
  return dateFormatter.format(new Date(iso))
}
