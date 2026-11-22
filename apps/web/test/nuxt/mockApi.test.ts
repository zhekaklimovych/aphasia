import { beforeEach, describe, expect, it } from 'vitest'
import { MockApiError, mockApi } from '~/mocks/api'

describe('mockApi: словник', () => {
  beforeEach(() => localStorage.clear())

  it('при першому запуску віддає тестові слова', async () => {
    const words = await mockApi.listWords()

    expect(words.length).toBeGreaterThan(0)
    expect(words[0]).toHaveProperty('id')
  })

  it('додає слово на початок списку', async () => {
    const word = await mockApi.addWord({ usedWord: 'ложка', correctWord: 'виделка' })

    const words = await mockApi.listWords()

    expect(words[0]).toEqual(word)
  })

  it('не дає додати слово, яке вже є (без урахування регістру)', async () => {
    await mockApi.addWord({ usedWord: 'Ложка', correctWord: 'виделка' })

    await expect(mockApi.addWord({ usedWord: ' ложка ', correctWord: 'ніж' })).rejects.toThrow(
      MockApiError,
    )
  })

  it('оновлює слово і зберігає інші поля', async () => {
    const word = await mockApi.addWord({ usedWord: 'ложка', correctWord: 'виделка' })

    const updated = await mockApi.updateWord(word.id, { correctWord: 'ніж' })

    expect(updated).toMatchObject({ id: word.id, usedWord: 'ложка', correctWord: 'ніж' })
  })

  it('при оновленні дозволяє лишити те саме слово', async () => {
    const word = await mockApi.addWord({ usedWord: 'ложка', correctWord: 'виделка' })

    await expect(mockApi.updateWord(word.id, { usedWord: 'ложка' })).resolves.toBeDefined()
  })

  it('видаляє слово', async () => {
    const word = await mockApi.addWord({ usedWord: 'ложка', correctWord: 'виделка' })

    await mockApi.deleteWord(word.id)

    expect((await mockApi.listWords()).some((w) => w.id === word.id)).toBe(false)
  })
})

describe('mockApi: профіль', () => {
  beforeEach(() => localStorage.clear())

  it('спочатку профілю немає, після збереження він є', async () => {
    expect(await mockApi.getProfile()).toBeNull()

    const profile = {
      firstName: 'Тест',
      language: 'uk',
      preferredPace: 'normal' as const,
      hobbies: [],
    }
    await mockApi.saveProfile(profile)

    expect(await mockApi.getProfile()).toEqual(profile)
  })
})
