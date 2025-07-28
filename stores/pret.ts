import { defineStore } from 'pinia'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { EcheancierPret, Pret, PretState } from '~/types'

export const usePretStore = defineStore('pret', {
    state: (): PretState => ({
        prets: [],
        echeanciers: [],
        loading: false,
        error: null,
    }),

    actions: {
        // =================================================================
        // Actions CRUD pour la table 'pret'
        // =================================================================

        /**
         * Crée un nouveau prêt dans la base de données.
         * @param pret - L'objet prêt à créer.
         */
        async createPret(pret: Pret) {
            this.loading = true
            this.error = null
            try {
                const supabase: SupabaseClient = useSupabaseClient()
                const { data, error } = await supabase
                    .from('pret')
                    .insert([pret])
                    .select()
                    .single()
                if (error) throw error
                if (data) {
                    this.prets.push(data)
                }
                return { data, error: null, loading: false }
            } catch (err: any) {
                this.error = err.message
                return { data: null, error: err.message, loading: false }
            } finally {
                this.loading = false
            }
        },

        /**
         * Récupère tous les prêts depuis la base de données.
         */
        async fetchPrets() {
            this.loading = true
            this.error = null
            try {
                const supabase = useSupabaseClient()
                const { data, error } = await supabase.from('pret').select('*')
                if (error) throw error
                this.prets = data || []
                return { data, error: null, loading: false }
            } catch (err: any) {
                this.error = err.message
                return { data: null, error: err.message, loading: false }
            } finally {
                this.loading = false
            }
        },

        /**
         * Récupère tous les prêts pour un client donné.
         * @param clientId - L'ID du client pour lequel récupérer les prêts.
         */
        async fetchPretsForClient(clientId: string) {
            this.loading = true
            this.error = null
            try {
                const supabase = useSupabaseClient()
                const { data, error } = await supabase
                    .from('pret')
                    .select('*')
                    .eq('client_id', clientId)
                if (error) throw error
                // On peut choisir de stocker ces prêts dans un état séparé ou de les retourner directement
                return { data, error: null, loading: false }
            } catch (err: any) {
                this.error = err.message
                return { data: null, error: err.message, loading: false }
            } finally {
                this.loading = false
            }
        },

        /**
         * Met à jour un prêt existant.
         * @param pret - L'objet prêt avec les informations mises à jour.
         */
        async updatePret(pret: Pret) {
            this.loading = true
            this.error = null
            try {
                const supabase: SupabaseClient = useSupabaseClient()
                const { data, error } = await supabase
                    .from('pret')
                    .update(pret)
                    .eq('id', pret.id)
                    .select()
                    .single()
                if (error) throw error
                if (data) {
                    const index = this.prets.findIndex((p) => p.id === pret.id)
                    if (index !== -1) this.prets[index] = data
                }
                return { data, error: null, loading: false }
            } catch (err: any) {
                this.error = err.message
                return { data: null, error: err.message, loading: false }
            } finally {
                this.loading = false
            }
        },

        /**
         * Supprime un prêt par son ID.
         * @param id - L'ID du prêt à supprimer.
         */
        async deletePret(id: number) {
            this.loading = true
            this.error = null
            try {
                const supabase = useSupabaseClient()
                const { error } = await supabase
                    .from('pret')
                    .delete()
                    .eq('id', id)
                if (error) throw error
                this.prets = this.prets.filter((p) => p.id !== id)
                return { data: { success: true }, error: null, loading: false }
            } catch (err: any) {
                this.error = err.message
                return { data: null, error: err.message, loading: false }
            } finally {
                this.loading = false
            }
        },

        // =================================================================
        // Génération et gestion de l'échéancier
        // =================================================================

        /**
         * Génère un échéancier de paiement pour un prêt (amortissement constant).
         * @param pret - L'objet prêt contenant montant, duree (en mois), taux_interet_annuel, et date_debut.
         * @returns Un tableau d'objets EcheancierPret.
         */
        genererEcheancier(pret: Pret): EcheancierPret[] {
            const {
                montant,
                duree,
                taux_interet_annuel,
                date_debut,
                id: pret_id,
            } = pret

            if (
                !montant ||
                !duree ||
                !taux_interet_annuel ||
                !date_debut ||
                !pret_id
            ) {
                this.error =
                    "Les informations du prêt sont incomplètes pour générer l'échéancier."
                console.error(this.error)
                return []
            }

            const taux_interet_mensuel = taux_interet_annuel / 12 / 100
            const mensualite =
                (montant *
                    taux_interet_mensuel *
                    Math.pow(1 + taux_interet_mensuel, duree)) /
                (Math.pow(1 + taux_interet_mensuel, duree) - 1)

            const echeancier: EcheancierPret[] = []
            let capital_restant_du = montant
            const dateEcheance = new Date(date_debut)

            for (let i = 0; i < duree; i++) {
                const interet_paye = capital_restant_du * taux_interet_mensuel
                const principal_rembourse = mensualite - interet_paye
                capital_restant_du -= principal_rembourse

                // S'assurer que la date est correctement incrémentée mois par mois
                dateEcheance.setMonth(dateEcheance.getMonth() + 1)

                echeancier.push({
                    pret_id,
                    date_echeance: new Date(dateEcheance)
                        .toISOString()
                        .split('T')[0], // Format YYYY-MM-DD
                    montant_echeance: parseFloat(mensualite.toFixed(2)),
                    principal_rembourse: parseFloat(
                        principal_rembourse.toFixed(2),
                    ),
                    interet_paye: parseFloat(interet_paye.toFixed(2)),
                    capital_restant_du: parseFloat(
                        Math.abs(capital_restant_du).toFixed(2),
                    ), // Utiliser Math.abs pour éviter -0.00
                })
            }

            return echeancier
        },

        /**
         * Enregistre un échéancier complet en base de données.
         * @param echeancierComplet - Le tableau d'échéances à insérer.
         */
        async saveEcheancierComplet(echeancierComplet: EcheancierPret[]) {
            this.loading = true
            this.error = null
            try {
                const supabase: SupabaseClient = useSupabaseClient()
                const { data, error } = await supabase
                    .from('echeancierPret')
                    .insert(echeancierComplet)
                    .select()
                if (error) throw error
                if (data) {
                    // Ajoute les nouvelles échéances à l'état local
                    this.echeanciers = [...this.echeanciers, ...data]
                }
                return { data, error: null, loading: false }
            } catch (err: any) {
                this.error = err.message
                return { data: null, error: err.message, loading: false }
            } finally {
                this.loading = false
            }
        },

        // =================================================================
        // Actions CRUD pour la table 'echeancierPret'
        // =================================================================

        /**
         * Crée un nouvel échéancier pour un prêt.
         * @param echeancier - L'objet échéancier à créer.
         */
        async createEcheancier(echeancier: EcheancierPret) {
            this.loading = true
            this.error = null
            try {
                const supabase: SupabaseClient = useSupabaseClient()
                const { data, error } = await supabase
                    .from('echeancierPret')
                    .insert([echeancier])
                    .select()
                    .single()
                if (error) throw error
                if (data) {
                    this.echeanciers.push(data)
                }
                return { data, error: null, loading: false }
            } catch (err: any) {
                this.error = err.message
                return { data: null, error: err.message, loading: false }
            } finally {
                this.loading = false
            }
        },

        /**
         * Récupère tous les échéanciers pour un prêt donné.
         * @param pretId - L'ID du prêt pour lequel récupérer les échéanciers.
         */
        async fetchEcheanciers(pretId: number) {
            this.loading = true
            this.error = null
            try {
                const supabase = useSupabaseClient()
                const { data, error } = await supabase
                    .from('echeancierPret')
                    .select('*')
                    .eq('pret_id', pretId)
                if (error) throw error
                this.echeanciers = data || []
                return { data, error: null, loading: false }
            } catch (err: any) {
                this.error = err.message
                return { data: null, error: err.message, loading: false }
            } finally {
                this.loading = false
            }
        },

        /**
         * Met à jour un échéancier existant.
         * @param echeancier - L'objet échéancier avec les informations mises à jour.
         */
        async updateEcheancier(echeancier: EcheancierPret) {
            this.loading = true
            this.error = null
            try {
                const supabase: SupabaseClient = useSupabaseClient()
                const { data, error } = await supabase
                    .from('echeancierPret')
                    .update(echeancier)
                    .eq('id', echeancier.id)
                    .select()
                    .single()
                if (error) throw error
                if (data) {
                    const index = this.echeanciers.findIndex(
                        (e) => e.id === echeancier.id,
                    )
                    if (index !== -1) this.echeanciers[index] = data
                }
                return { data, error: null, loading: false }
            } catch (err: any) {
                this.error = err.message
                return { data: null, error: err.message, loading: false }
            } finally {
                this.loading = false
            }
        },

        /**
         * Supprime un échéancier par son ID.
         * @param id - L'ID de l'échéancier à supprimer.
         */
        async deleteEcheancier(id: number) {
            this.loading = true
            this.error = null
            try {
                const supabase = useSupabaseClient()
                const { error } = await supabase
                    .from('echeancierPret')
                    .delete()
                    .eq('id', id)
                if (error) throw error
                this.echeanciers = this.echeanciers.filter((e) => e.id !== id)
                return { data: { success: true }, error: null, loading: false }
            } catch (err: any) {
                this.error = err.message
                return { data: null, error: err.message, loading: false }
            } finally {
                this.loading = false
            }
        },
    },
})
