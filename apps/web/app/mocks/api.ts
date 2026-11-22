import type {
  Profile,
  SessionDetail,
  SessionSummary,
  WordInput,
  WordMapping,
  WordUpdate,
} from '@aphasia/shared'
import { mockSessions } from './sessions'

/**
 * МОК API для профілю і словника. Дані живуть у localStorage браузера,
 * тому викликати лише на клієнті (useAsyncData з server: false).
 * На етапі 4 замінюється запитами до Nest API.
 */

const PROFILE_KEY = 'aphasia_mock_profile'
const WORDS_KEY = 'aphasia_mock_words'

// Вигадані тестові пари для першого запуску
const seedWords: WordInput[] = [
  { usedWord: 'чашка', correctWord: 'чайник', context: 'на кухні' },
  { usedWord: 'вода гаряча', correctWord: 'чай' },
  { usedWord: 'біла', correctWord: 'молоко' },
  { usedWord: 'ходити', correctWord: 'гуляти', context: 'про прогулянку' },
  { usedWord: 'дзвонити', correctWord: 'телефон' },
]

export class MockApiError extends Error {
  constructor(
    message: string,
    readonly field?: string,
  ) {
    super(message)
  }
}

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Приватний режим або заблоковане сховище: мок просто не збереже дані
  }
}

function toMapping(input: WordInput): WordMapping {
  return { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
}

function readWords(): WordMapping[] {
  const words = read<WordMapping[]>(WORDS_KEY)
  if (words) return words
  const seeded = seedWords.map(toMapping)
  write(WORDS_KEY, seeded)
  return seeded
}

function sameWord(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase()
}

function assertUnique(words: WordMapping[], usedWord: string, exceptId?: string) {
  if (words.some((word) => word.id !== exceptId && sameWord(word.usedWord, usedWord))) {
    throw new MockApiError('Це слово вже є у словнику', 'usedWord')
  }
}

export const mockApi = {
  async getProfile(): Promise<Profile | null> {
    return read<Profile>(PROFILE_KEY)
  },

  async saveProfile(profile: Profile): Promise<Profile> {
    write(PROFILE_KEY, profile)
    return profile
  },

  async listWords(): Promise<WordMapping[]> {
    return readWords()
  },

  async addWord(input: WordInput): Promise<WordMapping> {
    const words = readWords()
    assertUnique(words, input.usedWord)
    const word = toMapping(input)
    write(WORDS_KEY, [word, ...words])
    return word
  },

  async updateWord(id: string, patch: WordUpdate): Promise<WordMapping> {
    const words = readWords()
    const existing = words.find((word) => word.id === id)
    if (!existing) throw new MockApiError('Слово не знайдено')
    if (patch.usedWord) assertUnique(words, patch.usedWord, id)

    const updated: WordMapping = { ...existing, ...patch }
    write(
      WORDS_KEY,
      words.map((word) => (word.id === id ? updated : word)),
    )
    return updated
  },

  /** Від найновіших до найстаріших, без повідомлень */
  async listSessions(): Promise<SessionSummary[]> {
    return [...mockSessions]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(({ messages: _messages, ...summary }) => summary)
  },

  async getSession(id: string): Promise<SessionDetail | null> {
    return mockSessions.find((session) => session.id === id) ?? null
  },

  async deleteWord(id: string): Promise<void> {
    write(
      WORDS_KEY,
      readWords().filter((word) => word.id !== id),
    )
  },
}
