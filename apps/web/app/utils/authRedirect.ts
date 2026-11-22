/**
 * Куди перенаправити користувача перед переходом на сторінку, або null, якщо нікуди.
 * Гість на закритій сторінці → /login (з поверненням назад), користувач на /login чи /register → /.
 */
export function resolveAuthRedirect(
  route: { fullPath: string; isPublic: boolean },
  isLoggedIn: boolean,
): string | null {
  if (!route.isPublic && !isLoggedIn) {
    return route.fullPath === '/'
      ? '/login'
      : `/login?redirect=${encodeURIComponent(route.fullPath)}`
  }
  if (route.isPublic && isLoggedIn) return '/'
  return null
}

/** Лише внутрішні шляхи, щоб ?redirect= не можна було використати для переходу на чужий сайт. */
export function safeRedirect(value: unknown, fallback = '/'): string {
  if (typeof value !== 'string') return fallback
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return fallback
  return value
}
