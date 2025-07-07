export const useAuth = () => {
    const supabase = useSupabase();

    const signIn = async (email: string, password: string) => {
        const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.error('Erreur de connexion:', error.message);
            return null;
        }
        return user;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Erreur de déconnexion:', error.message);
        }
    };

    const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    };

    return {
        signIn,
        signOut,
        getUser,
        supabase // Vous pouvez aussi exposer l'instance directement
    };
};