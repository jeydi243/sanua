import { defineStore } from 'pinia';
import type { SupabaseClient } from '@supabase/supabase-js';

// Interface pour une organisation. Adaptez les champs à votre table.
interface Organisation {
  id?: number;
  nom: string;
  adresse?: string;
  telephone?: string;
  // Ajoutez d'autres champs pertinents ici
}

// Interface pour l'état du store
interface OrganisationState {
  organisations: Organisation[];
  loading: boolean;
  error: string | null;
}

export const useOrganisationStore = defineStore('organisation', {
  state: (): OrganisationState => ({
    organisations: [],
    loading: false,
    error: null,
  }),

  actions: {
    /**
     * Crée une nouvelle organisation.
     * @param organisation - L'objet organisation à créer.
     */
    async createOrganisation(organisation: Omit<Organisation, 'id'>) {
      this.loading = true;
      this.error = null;
      try {
        const supabase = useSupabaseClient();
        const { data, error } = await supabase.from('organisation').insert([organisation]).select().single();
        if (error) throw error;
        if (data) {
          this.organisations.push(data);
        }
        return { data, error: null, loading: false };
      } catch (err: any) {
        this.error = err.message;
        return { data: null, error: err.message, loading: false };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Récupère toutes les organisations depuis la base de données.
     */
    async fetchOrganisations() {
      this.loading = true;
      this.error = null;
      try {
        const supabase = useSupabaseClient();
        const { data, error } = await supabase.from('organisation').select('*');
        if (error) throw error;
        this.organisations = data || [];
        return { data, error: null, loading: false };
      } catch (err: any) {
        this.error = err.message;
        return { data: null, error: err.message, loading: false };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Met à jour une organisation existante.
     * @param organisation - L'objet organisation avec les informations mises à jour.
     */
    async updateOrganisation(organisation: Organisation) {
      this.loading = true;
      this.error = null;
      if (!organisation.id) {
        const err = new Error("L'ID de l'organisation est requis pour la mise à jour.");
        this.error = err.message;
        return { data: null, error: err.message, loading: false };
      }
      try {
        const supabase = useSupabaseClient();
        const { data, error } = await supabase.from('organisation').update(organisation).eq('id', organisation.id).select().single();
        if (error) throw error;
        if (data) {
          const index = this.organisations.findIndex(o => o.id === organisation.id);
          if (index !== -1) this.organisations[index] = data;
        }
        return { data, error: null, loading: false };
      } catch (err: any) {
        this.error = err.message;
        return { data: null, error: err.message, loading: false };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Supprime une organisation par son ID.
     * @param id - L'ID de l'organisation à supprimer.
     */
    async deleteOrganisation(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const supabase = useSupabaseClient();
        const { error } = await supabase.from('organisation').delete().eq('id', id);
        if (error) throw error;
        this.organisations = this.organisations.filter(o => o.id !== id);
        return { data: { success: true }, error: null, loading: false };
      } catch (err: any) {
        this.error = err.message;
        return { data: null, error: err.message, loading: false };
      } finally {
        this.loading = false;
      }
    },
  },
});
