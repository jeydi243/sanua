export default defineNuxtRouteMiddleware(async (to, from) => {
    // Accédez à l'instance Supabase via useNuxtApp().$supabase
    const supabase = useNuxtApp().$supabase;

    // Récupérez la session de l'utilisateur
    const { data: { session } } = await supabase.auth.getSession();

    // Si l'utilisateur n'est pas connecté et essaie d'accéder à une page protégée
    if (!session && to.meta.requiresAuth) {
        // Redirigez vers la page de connexion
        return navigateTo('/auth');
    }

    // Si l'utilisateur est connecté et essaie d'accéder à la page de connexion
    // ou d'inscription, redirigez-le vers le tableau de bord (par exemple).
    if (session && (to.path === '/auth')) {
        return navigateTo('/');
    }
});