import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

describe('auth store (мок)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useAuthStore().logout()
  })

  it('спочатку користувач не увійшов', () => {
    const auth = useAuthStore()

    expect(auth.isLoggedIn).toBe(false)
    expect(auth.user).toBeNull()
  })

  it('login() зберігає користувача', async () => {
    const auth = useAuthStore()

    await auth.login({ email: 'test@example.com', password: 'secret123' })

    expect(auth.isLoggedIn).toBe(true)
    expect(auth.user?.email).toBe('test@example.com')
  })

  it('register() теж входить у систему', async () => {
    const auth = useAuthStore()

    await auth.register({ email: 'new@example.com', password: 'secret123' })

    expect(auth.user?.email).toBe('new@example.com')
  })

  it('logout() очищає користувача', async () => {
    const auth = useAuthStore()
    await auth.login({ email: 'test@example.com', password: 'secret123' })

    auth.logout()

    expect(auth.isLoggedIn).toBe(false)
  })
})
