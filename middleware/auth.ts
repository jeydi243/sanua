export default defineNuxtRouteMiddleware((to) => {
  const session = useSupabaseSession()

  // If the user is logged in and trying to access the auth page, redirect to home.
  if (session.value && to.name === 'auth') {
    return navigateTo('/')
  }

  // If the user is not logged in and is trying to access a protected page, redirect to auth.
  if (!session.value && to.name !== 'auth') {
    return navigateTo('/auth')
  }

  // Otherwise, allow navigation.
})
