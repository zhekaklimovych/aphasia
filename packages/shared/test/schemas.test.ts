import { describe, expect, it } from 'vitest'
import {
  AnswerSchema,
  DialogResultSchema,
  LoginSchema,
  ProfileInputSchema,
  RegisterSchema,
  StartSessionSchema,
  WordInputSchema,
} from '../src'

describe('dialog', () => {
  it('приймає лише YES / NO / SKIP', () => {
    expect(AnswerSchema.safeParse('YES').success).toBe(true)
    expect(AnswerSchema.safeParse('MAYBE').success).toBe(false)
  })

  it('confidence має бути від 0 до 1', () => {
    expect(DialogResultSchema.safeParse({ interpretation: 'x', confidence: 0.8 }).success).toBe(
      true,
    )
    expect(DialogResultSchema.safeParse({ interpretation: 'x', confidence: 80 }).success).toBe(
      false,
    )
  })

  it('initialInput обрізається і не може бути порожнім', () => {
    expect(StartSessionSchema.parse({ initialInput: '  чайник  ' }).initialInput).toBe('чайник')
    expect(StartSessionSchema.safeParse({ initialInput: '   ' }).success).toBe(false)
  })
})

describe('profile', () => {
  it('підставляє значення за замовчуванням', () => {
    const profile = ProfileInputSchema.parse({ firstName: 'Тест' })

    expect(profile).toMatchObject({ language: 'uk', preferredPace: 'normal', hobbies: [] })
  })

  it("вимагає ім'я і правильний формат дати", () => {
    expect(ProfileInputSchema.safeParse({ firstName: '  ' }).success).toBe(false)
    expect(
      ProfileInputSchema.safeParse({ firstName: 'Тест', birthDate: '01.02.1990' }).success,
    ).toBe(false)
    expect(
      ProfileInputSchema.safeParse({ firstName: 'Тест', birthDate: '1990-02-01' }).success,
    ).toBe(true)
  })
})

describe('word', () => {
  it('вимагає обидва слова', () => {
    expect(WordInputSchema.safeParse({ usedWord: 'чашка', correctWord: 'чайник' }).success).toBe(
      true,
    )
    expect(WordInputSchema.safeParse({ usedWord: 'чашка', correctWord: '' }).success).toBe(false)
  })
})

describe('auth', () => {
  it('нормалізує email і вимагає пароль від 8 символів', () => {
    const input = RegisterSchema.parse({ email: ' Test@Example.COM ', password: '12345678' })

    expect(input.email).toBe('test@example.com')
    expect(RegisterSchema.safeParse({ email: 'test@example.com', password: '123' }).success).toBe(
      false,
    )
  })

  it('відхиляє невірний email', () => {
    expect(LoginSchema.safeParse({ email: 'not-an-email', password: 'x' }).success).toBe(false)
  })
})
