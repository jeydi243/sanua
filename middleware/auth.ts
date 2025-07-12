export default defineNuxtRouteMiddleware((to, _from) => {
    const session = useSupabaseSession()

    if (!session.value) {
        return navigateTo('/auth')
    }

    if (session.value && to.name == 'auth') {
        const user = useSupabaseUser()
        console.log('Go back please you are connected as ', user);
        return navigateTo('/')
    }
})
