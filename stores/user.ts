import { defineStore } from 'pinia'

interface UserState {
    user: any | null; // Remplacez 'any' par le type d'utilisateur Supabase si vous l'avez défini
    loading: boolean;
    error: string | null;
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        user: null,
        loading: false,
        error: null,
    }),
    actions: {
        /**
         * Initialise l'utilisateur en récupérant la session Supabase.
         * Cette action peut être appelée au démarrage de l'application ou lors d'un rafraîchissement.
         */
        async fetchUser() {
            this.loading = true;
            this.error = null;
            try {
                // Accédez à l'instance Supabase via useNuxtApp().$supabase
                // Note: useNuxtApp() doit être appelé dans le contexte d'une application Nuxt,
                // ce qui est le cas dans les actions de Pinia car Pinia est initialisé par Nuxt.
                const supabase = useSupabase();

                const { data: { user }, error } = await supabase.auth.getUser();

                if (error) {
                    throw error;
                }

                this.user = user;
            } catch (err: any) {
                this.error = err.message || 'Erreur lors de la récupération de l\'utilisateur.';
                this.user = null;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Gère la connexion de l'utilisateur.
         */
        async signIn(email: string, password: string) {
            this.loading = true;
            this.error = null;
            try {
                const supabase = useSupabase();
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });

                if (error) {
                    throw error;
                }

                this.user = data.user;
                return data.user;
            } catch (err: any) {
                this.error = err.message || 'Erreur de connexion.';
                this.user = null;
                throw err; // Propage l'erreur pour une gestion côté composant
            } finally {
                this.loading = false;
            }
        },

        /**
         * Gère la déconnexion de l'utilisateur.
         */
        async signOut() {
            this.loading = true;
            this.error = null;
            try {
                const supabase = useSupabase();
                const { error } = await supabase.auth.signOut();

                if (error) {
                    throw error;
                }

                this.user = null;
            } catch (err: any) {
                this.error = err.message || 'Erreur de déconnexion.';
                throw err;
            } finally {
                this.loading = false;
            }
        },
    },
});