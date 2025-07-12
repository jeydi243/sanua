import type { SupabaseClient } from '@supabase/supabase-js';
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
        error: null
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

        async signIn(email: string, password: string) {
            const supabase = useSupabaseClient();
            const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                console.error('Erreur de connexion:', error.message);
                return { error };
            }
            return { user };
        },

        async signOut() {
            const supabase = useSupabaseClient();
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Erreur de déconnexion:', error.message);
            }
        },

        async getUser() {
            const { data: { user } } = await this.supabase.auth.getUser();
            return user;
        },

        setupAuthListener() {
            const supabase = useSupabaseClient();
            supabase.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN') {
                    console.log('Utilisateur connecté:', session?.user);
                    this.user = session?.user || null;
                } else if (event === 'SIGNED_OUT') {
                    console.log('Utilisateur déconnecté.');
                    this.user = null;
                }
                // Vous pouvez gérer d'autres événements comme 'INITIAL_SESSION', 'TOKEN_REFRESHED'
            });
        }
    },
});