import { defineStore } from 'pinia'
import type { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js'
import type { Pret, EcheancierPret } from '~/types'
import type { PretState } from '~/types/store'
import type { TablesInsert, TablesUpdate } from '~/types/supabase'

export const usePretStore = defineStore('pret', {
    state: (): PretState => ({
        prets: [],
        activePret: null,
        pretChannel: null,
        echeancierChannel: null, // Ce canal sera géré dynamiquement
    }),

    actions: {
        async init() {
            if (this.pretChannel) return
            await this.fetchPrets()
            this.setupPretChangesListener()
        },

        // Actions sur la liste globale des prêts
        async fetchPrets() {
            try {
                const supabase = useSupabaseClient()
                const { data, error } = await supabase.from('pret').select('*')
                if (error) throw error
                this.prets = data || []
                return { data, error: null }
            } catch (err: any) {
                return { data: null, error: err }
            }
        },

        // Actions sur le prêt actif
        async setActivePret(pretId: string) {
            try {
                const supabase = useSupabaseClient()
                const [pretRes, echeancierRes] = await Promise.all([
                    supabase.from('pret').select('*').eq('pret_id', pretId).single(),
                    supabase.from('echeancierpret').select('*').eq('pret_id', pretId).order('date_echeance'),
                ])

                if (pretRes.error) throw pretRes.error
                if (echeancierRes.error) throw echeancierRes.error

                this.activePret = {
                    details: pretRes.data,
                    echeancier: echeancierRes.data || [],
                    garants: [], // La logique pour les garants peut être ajoutée ici
                }
                return { data: this.activePret, error: null }
            } catch (err: any) {
                this.activePret = null
                return { data: null, error: err }
            }
        },

        clearActivePret() {
            this.activePret = null
        },

        // CRUD Actions
        async createPret(pret: TablesInsert<'pret'>) {
            // ... (l'action reste la même, le listener mettra à jour la liste `prets`)
            try {
                const supabase: SupabaseClient = useSupabaseClient()
                const { data, error } = await supabase.from('pret').insert(pret).select().single()
                if (error) throw error
                return { data, error: null }
            } catch (err: any) {
                return { data: null, error: err }
            }
        },

        // Listener pour la liste globale
        setupPretChangesListener() {
            if (this.pretChannel) return
            const supabase: SupabaseClient = useSupabaseClient()
            this.pretChannel = supabase
                .channel('public:pret')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pret' }, (payload) => {
                    this.prets.push(payload.new as Pret)
                })
                .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'pret' }, (payload) => {
                    const updated = payload.new as Pret
                    const index = this.prets.findIndex(p => p.pret_id === updated.pret_id)
                    if (index !== -1) this.prets[index] = updated
                    if (this.activePret?.details.pret_id === updated.pret_id) {
                        this.activePret.details = updated
                    }
                })
                .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'pret' }, (payload) => {
                    const oldId = (payload.old as Partial<Pret>).pret_id
                    this.prets = this.prets.filter(p => p.pret_id !== oldId)
                    if (this.activePret?.details.pret_id === oldId) {
                        this.activePret = null
                    }
                })
                .subscribe()
        },
        
        removePretChangesListener() {
            if (this.pretChannel) {
                this.pretChannel.unsubscribe()
                this.pretChannel = null
            }
        },
    },
})