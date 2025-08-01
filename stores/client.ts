import { defineStore } from 'pinia'
import type { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js'
import type { Client, Compte } from '~/types'
import type { ClientState } from '~/types/store'
import type { TablesInsert } from '~/types/supabase'

export const useClientStore = defineStore('client', {
    state: (): ClientState => ({
        clients: [],
        activeClient: null,
        clientChannel: null,
    }),
    getters:{
        activeComptes: (state)=> state.activeClient?.comptes,
        activeAdresses: (state)=> state.activeClient?.adresses,
        activeContacts: (state)=> state.activeClient?.contacts,
        activePrets: (state)=> state.activeClient?.prets,
        getClients: (state)=> state.clients,
    },

    actions: {
        async init() {
            if (this.clientChannel) return
            await this.fetchClients()
            this.setupClientChangesListener()
        },

        // Actions sur la liste globale des clients
        async fetchClients() {
            try {
                const supabase: SupabaseClient = useSupabaseClient()
                const { data, error } = await supabase
                    .from('client')
                    .select('*')
                if (error) throw error
                this.clients = data || []
                return { data, error: null }
            } catch (err: any) {
                return { data: null, error: err }
            }
        },

        // Actions sur le client actif
        async setActiveClient(clientId: string) {
            try {
                console.log('Setting active client: ', clientId)
                const supabase: SupabaseClient = useSupabaseClient()
                // Récupérer les données en parallèle pour plus d'efficacité
                const [clientRes, comptesRes, adressesRes, contactsRes, pretsRes] = await Promise.all([
                    supabase
                        .from('client')
                        .select('*')
                        .eq('client_id', clientId)
                        .single(),
                    supabase
                        .from('compte')
                        .select('*')
                        .eq('client_id', clientId),
                    supabase
                        .from('adresse')
                        .select('*')
                        .eq('client_id', clientId),
                    supabase
                        .from('contact')
                        .select('*')
                        .eq('client_id', clientId),
                    supabase
                        .from('pret')
                        .select('*')
                        .eq('client_id', clientId),
                ])

                if (clientRes.error) throw clientRes.error
                if (comptesRes.error) throw comptesRes.error
                if (adressesRes.error) throw adressesRes.error
                if (contactsRes.error) throw contactsRes.error
                if (pretsRes.error) throw pretsRes.error

                this.activeClient = {
                    details: clientRes.data,
                    comptes: comptesRes.data || [],
                    adresses: adressesRes.data || [],
                    contacts: contactsRes.data || [],
                    prets: pretsRes.data || [],
                }
                console.log('The active client is ',this.activeClient)
                // return { data: this.activeClient, error: null }
            } catch (err: any) {
                console.log('Error setting active client: ', err)
                this.activeClient = null
                return { data: null, error: err }
            }
        },

        clearActiveClient() {
            this.activeClient = null
        },

        // CRUD Actions (impactent la liste globale via le listener)
        async createClient(client: TablesInsert<'client'>) {
            try {
                const supabase: SupabaseClient = useSupabaseClient()
                const { data, error } = await supabase
                    .from('client')
                    .insert(client)
                    .select()
                    .single()
                if (error) throw error
                return { data, error: null }
            } catch (err: any) {
                return { data: null, error: err }
            }
        },

        // ... (update, delete restent les mêmes)

        // Listener pour la liste globale
        setupClientChangesListener() {
            if (this.clientChannel) return
            const supabase: SupabaseClient = useSupabaseClient()
            this.clientChannel = supabase
                .channel('public:client')
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'client' },
                    (payload) => {
                        console.log('Client inserted: ', payload.new)
                        this.clients.push(payload.new as Client)
                    },
                )
                .on(
                    'postgres_changes',
                    { event: 'UPDATE', schema: 'public', table: 'client' },
                    (payload) => {
                        console.log('Client updated: ', payload.new)
                        const updated = payload.new as Client
                        const index = this.clients.findIndex(
                            (c) => c.client_id === updated.client_id,
                        )
                        if (index !== -1) this.clients[index] = updated
                        // Mettre aussi à jour le client actif s'il correspond
                        if (
                            this.activeClient?.details.client_id ===
                            updated.client_id
                        ) {
                            this.activeClient.details = updated
                        }
                    },
                )
                .on(
                    'postgres_changes',
                    { event: 'DELETE', schema: 'public', table: 'client' },
                    (payload) => {
                        console.log('Client deleted: ', payload.old)
                        const oldId = (payload.old as Partial<Client>).client_id
                        this.clients = this.clients.filter(
                            (c) => c.client_id !== oldId,
                        )
                        // Nettoyer le client actif s'il a été supprimé
                        if (this.activeClient?.details.client_id === oldId) {
                            this.activeClient = null
                        }
                    },
                )
                .subscribe()
        },

        removeClientChangesListener() {
            if (this.clientChannel) {
                this.clientChannel.unsubscribe()
                this.clientChannel = null
            }
        },
    },
})
