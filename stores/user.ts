import { defineStore } from 'pinia'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { UserState } from '~/types/store'

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        user: null,
    }),
    actions: {
        /**
         * Initialise le store en mettant en place le listener d'état d'authentification.
         */
        init() {
            // Pas de garde de double initialisation nécessaire car onAuthStateChange gère cela.
            this.setupAuthListener()
        },

        async fetchUser() {
            try {
                const supabase = useSupabaseClient()
                const { data, error } = await supabase.auth.getUser()
                if (error) throw error
                this.user = data.user
                return { data: { user: this.user }, error: null }
            } catch (err: any) {
                this.user = null
                return { data: null, error: err }
            }
        },

        async signIn(email: string, password: string) {
            try {
                const supabase = useSupabaseClient()
                const { data, error } = await supabase.auth.signInWithPassword({ email, password })
                if (error) throw error
                this.user = data.user
                return { data, error: null }
            } catch (err: any) {
                return { data: null, error: err }
            }
        },

        async signOut() {
            try {
                const supabase = useSupabaseClient()
                const { error } = await supabase.auth.signOut()
                if (error) throw error
                this.user = null
                return { data: { success: true }, error: null }
            } catch (err: any) {
                return { data: null, error: err }
            }
        },

        setupAuthListener() {
            const supabase: SupabaseClient = useSupabaseClient()
            supabase.auth.onAuthStateChange((event, session) => {
                this.user = session?.user || null
            })
        },
    },
})