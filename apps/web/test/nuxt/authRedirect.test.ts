import { describe, expect, it } from 'vitest'

describe('resolveAuthRedirect', () => {
  it('гостя на закритій сторінці веде на /login з поверненням назад', () => {
    expect(resolveAuthRedirect({ fullPath: '/words?q=чай', isPublic: false }, false)).toBe(
      `/login?redirect=${encodeURIComponent('/words?q=чай')}`,
    )
  })

  it('гостя з головної веде на /login без redirect', () => {
    expect(resolveAuthRedirect({ fullPath: '/', isPublic: false }, false)).toBe('/login')
  })

  it('користувача з /login чи /register веде на головну', () => {
    expect(resolveAuthRedirect({ fullPath: '/login', isPublic: true }, true)).toBe('/')
  })

  it('інакше нікуди не веде', () => {
    expect(resolveAuthRedirect({ fullPath: '/words', isPublic: false }, true)).toBeNull()
    expect(resolveAuthRedirect({ fullPath: '/login', isPublic: true }, false)).toBeNull()
  })
})

describe('safeRedirect', () => {
  it('пропускає внутрішні шляхи', () => {
    expect(safeRedirect('/words?q=1')).toBe('/words?q=1')
  })

  it('відкидає зовнішні адреси і не-рядки', () => {
    expect(safeRedirect('https://evil.example')).toBe('/')
    expect(safeRedirect('//evil.example')).toBe('/')
    expect(safeRedirect('/\\evil.example')).toBe('/')
    expect(safeRedirect(['/words'])).toBe('/')
    expect(safeRedirect(undefined)).toBe('/')
  })
})
