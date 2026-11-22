// Глобальний: кожна нова сторінка закрита для гостей, якщо не позначена `public: true`
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  const target = resolveAuthRedirect(
    { fullPath: to.fullPath, isPublic: to.meta.public === true },
    auth.isLoggedIn,
  )
  if (target) return navigateTo(target)
})
