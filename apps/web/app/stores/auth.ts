import type { CurrentUser, LoginInput, RegisterInput } from '@aphasia/shared'

/**
 * МОК-авторизація: будь-які валідні дані приймаються, "сесія" живе в звичайній cookie,
 * щоб її бачили і сервер (middleware при SSR), і браузер.
 * На етапі 4 замінимо на httpOnly cookie від API і GET /auth/me.
 */
export const useAuthStore = defineStore('auth', () => {
  const session = useCookie<CurrentUser | null>('aphasia_mock_user', {
    default: () => null,
    sameSite: 'lax',
  })

  const user = computed(() => session.value)
  const isLoggedIn = computed(() => user.value !== null)

  async function login(input: LoginInput) {
    session.value = mockUser(input.email)
  }

  async function register(input: RegisterInput) {
    session.value = mockUser(input.email)
  }

  function logout() {
    session.value = null
  }

  return { user, isLoggedIn, login, register, logout }
})

function mockUser(email: string): CurrentUser {
  return { id: 'mock-user', email }
}
