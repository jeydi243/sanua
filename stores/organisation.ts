import { defineStore } from 'pinia'
import type { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js'
import type { Organisation } from '~/types'
import type { OrganisationState } from '~/types/store'
import type { TablesInsert, TablesUpdate } from '~/types/supabase'

export const useOrganisationStore = defineStore('organisation', {
    state: (): OrganisationState => ({
        organisations: [],
        organisationChannel: null,
    }),

    actions: {
        /**
         * Initialise le store en chargeant les données initiales et en mettant en place le listener temps réel.
         */
        async init() {
            if (this.organisationChannel) return // Empêche la double initialisation

            await this.fetchOrganisations()
            this.setupOrganisationChangesListener()
        },

        async createOrganisation(organisation: TablesInsert<'organisation'>) {
            try {
                const supabase: SupabaseClient = useSupabaseClient()
                const { data, error } = await supabase
                    .from('organisation')
                    .insert(organisation)
                    .select()
                    .single()
                if (error) throw error
                return { data, error: null }
            } catch (err: any) {
                return { data: null, error: err }
            }
        },

        async fetchOrganisations() {
            try {
                const supabase = useSupabaseClient()
                const { data, error } = await supabase
                    .from('organisation')
                    .select('*')
                if (error) throw error
                this.organisations = data || []
                return { data, error: null }
            } catch (err: any) {
                return { data: null, error: err }
            }
        },

        async updateOrganisation(organisation: TablesUpdate<'organisation'>) {
            try {
                const supabase: SupabaseClient = useSupabaseClient()
                const { data, error } = await supabase
                    .from('organisation')
                    .update(organisation)
                    .eq('organisation_id', organisation.organisation_id!)
                    .select()
                    .single()
                if (error) throw error
                return { data, error: null }
            } catch (err: any) {
                return { data: null, error: err }
            }
        },

        async deleteOrganisation(id: string) {
            try {
                const supabase = useSupabaseClient()
                const { data, error } = await supabase
                    .from('organisation')
                    .delete()
                    .eq('organisation_id', id)
                if (error) throw error
                return { data, error: null }
            } catch (err: any) {
                return { data: null, error: err }
            }
        },

        setupOrganisationChangesListener() {
            if (this.organisationChannel) return

            const supabase: SupabaseClient = useSupabaseClient()
            this.organisationChannel = supabase
                .channel('public:organisation')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'organisation' },
                    (payload) => {
                        const newOrg = payload.new as Organisation
                        if (!this.organisations.some(o => o.organisation_id === newOrg.organisation_id)) {
                            this.organisations.push(newOrg)
                        }
                    }
                )
                .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'organisation' },
                    (payload) => {
                        const updatedOrg = payload.new as Organisation
                        const index = this.organisations.findIndex(o => o.organisation_id === updatedOrg.organisation_id)
                        if (index !== -1) this.organisations[index] = updatedOrg
                    }
                )
                .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'organisation' },
                    (payload) => {
                        const oldOrgId = (payload.old as Partial<Organisation>).organisation_id
                        if (oldOrgId) {
                            this.organisations = this.organisations.filter(o => o.organisation_id !== oldOrgId)
                        }
                    }
                )
                .subscribe()
        },

        removeOrganisationChangesListener() {
            if (this.organisationChannel) {
                this.organisationChannel.unsubscribe()
                this.organisationChannel = null
            }
        },
    },
})