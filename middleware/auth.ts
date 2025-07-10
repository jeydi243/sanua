export default defineNuxtRouteMiddleware(async (to, from) => {
    // Accédez à l'instance Supabase via useNuxtApp().$supabase
    const supabase = useSupabase();

    // Récupérez l'utilisateur actuellement connecté
    const { data: { user } } = await supabase.auth.getUser()


    // Si l'utilisateur n'est pas connecté et essaie d'accéder à une page protégée
    if (!user && to.meta.requiresAuth) {
        // Redirigez vers la page de connexion
        console.log('No user ', !user, ' connected requiresAuth = ', to.meta.requiresAuth);
        return navigateTo('/auth');
    }

    // Si l'utilisateur est connecté et essaie d'accéder à la page de connexion on le redirige à la page index
    if (user && (to.path === '/auth')) {
        console.log('User is connected ', user)
        return navigateTo('/');
    }
});