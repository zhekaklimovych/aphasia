import { describe, expect, it } from 'vitest'
import { ProfileInputSchema } from '@aphasia/shared'

describe('profileForm', () => {
  it('parseList ділить рядок за комами і прибирає порожні елементи', () => {
    expect(parseList('читання, сад , ,музика,')).toEqual(['читання', 'сад', 'музика'])
    expect(parseList('   ')).toEqual([])
  })

  it('profileToForm перетворює відсутні поля на порожні рядки', () => {
    const form = profileToForm({
      firstName: 'Тест',
      language: 'uk',
      preferredPace: 'slow',
      hobbies: ['сад'],
    })

    expect(form).toMatchObject({ birthDate: '', severity: '', occupation: '', hobbies: ['сад'] })
  })

  it('форма → схема → форма дає той самий профіль', () => {
    const saved = ProfileInputSchema.parse({
      firstName: 'Тест',
      birthDate: '1990-02-01',
      severity: 'MODERATE',
      preferredPace: 'fast',
      hobbies: ['сад'],
    })

    expect(ProfileInputSchema.parse(profileToForm(saved))).toEqual(saved)
  })
})
