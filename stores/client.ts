import { defineStore } from 'pinia';
import type { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';

// Interface pour un client. Adaptez les champs à votre table 'client'.
interface Client {
  id?: string; // UUID
  nom: string;
  prenom: string;
  date_naissance?: string;
  // Ajoutez d'autres champs ici
}

// Interface pour un compte. Adaptez les champs à votre table 'compte'.
interface Compte {
  id?: number;
  client_id: string; // Clé étrangère vers la table client
  numero_compte: string;
  solde: number;
  type_compte: string;
  // Ajoutez d'autres champs ici
}

// Interface pour l'état du store
interface ClientState {
  clients: Client[];
  comptes: Compte[];
  loading: boolean;
  error: string | null;
  clientChannel: RealtimeChannel | null;
}

export const useClientStore = defineStore('client', {
  state: (): ClientState => ({
    clients: [],
    comptes: [],
    loading: false,
    error: null,
    clientChannel: null,
  }),

  actions: {
    // =================================================================
    // Actions CRUD pour la table 'client'
    // =================================================================

    async createClient(client: Omit<Client, 'id'>) {
      this.loading = true;
      this.error = null;
      try {
        const supabase = useSupabaseClient();
        const { data, error } = await supabase.from('client').insert([client]).select().single();
        if (error) throw error;
        // L'écouteur real-time devrait gérer l'ajout, mais on peut l'ajouter manuellement par sécurité
        if (data && !this.clients.some(c => c.id === data.id)) {
          this.clients.push(data);
        }
        return { data, error: null, loading: false };
      } catch (err: any) {
        this.error = err.message;
        return { data: null, error: err.message, loading: false };
      } finally {
        this.loading = false;
      }
    },

    async fetchClients() {
      this.loading = true;
      this.error = null;
      try {
        const supabase = useSupabaseClient();
        const { data, error } = await supabase.from('client').select('*');
        if (error) throw error;
        this.clients = data || [];
        return { data, error: null, loading: false };
      } catch (err: any) {
        this.error = err.message;
        return { data: null, error: err.message, loading: false };
      } finally {
        this.loading = false;
      }
    },

    async fetchClientById(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const supabase = useSupabaseClient();
        const { data, error } = await supabase.from('client').select('*').eq('id', id).single();
        if (error) throw error;
        // On peut choisir de le stocker dans un état 'currentClient' ou simplement de le retourner
        return { data, error: null, loading: false };
      } catch (err: any) {
        this.error = err.message;
        return { data: null, error: err.message, loading: false };
      } finally {
        this.loading = false;
      }
    },

    async updateClient(client: Client) {
      this.loading = true;
      this.error = null;
      try {
        const supabase = useSupabaseClient();
        const { data, error } = await supabase.from('client').update(client).eq('id', client.id).select().single();
        if (error) throw error;
        // L'écouteur real-time devrait gérer la mise à jour
        return { data, error: null, loading: false };
      } catch (err: any) {
        this.error = err.message;
        return { data: null, error: err.message, loading: false };
      } finally {
        this.loading = false;
      }
    },

    async deleteClient(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const supabase = useSupabaseClient();
        const { error } = await supabase.from('client').delete().eq('id', id);
        if (error) throw error;
        // L'écouteur real-time devrait gérer la suppression
        return { data: { success: true }, error: null, loading: false };
      } catch (err: any) {
        this.error = err.message;
        return { data: null, error: err.message, loading: false };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Met en place un écouteur pour les changements sur la table 'client'.
     */
    setupClientChangesListener() {
      if (this.clientChannel) return; // Évite de créer plusieurs écouteurs

      const supabase = useSupabaseClient();
      this.clientChannel = supabase
        .channel('public:client')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'client' },
          (payload) => {
            console.log('Nouveau client inséré:', payload.new);
            this.clients.push(payload.new as Client);
          }
        )
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'client' },
          (payload) => {
            console.log('Client mis à jour:', payload.new);
            const index = this.clients.findIndex(c => c.id === payload.new.id);
            if (index !== -1) {
              this.clients[index] = payload.new as Client;
            }
          }
        )
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'client' },
          (payload) => {
            console.log('Client supprimé:', payload.old);
            this.clients = this.clients.filter(c => c.id !== payload.old.id);
          }
        )
        .subscribe();
        
      console.log("Écouteur de changements pour la table 'client' activé.");
    },

    /**
     * Supprime l'écouteur de changements pour éviter les fuites de mémoire.
     */
    removeClientChangesListener() {
        if (this.clientChannel) {
            this.clientChannel.unsubscribe();
            this.clientChannel = null;
            console.log("Écouteur de changements pour la table 'client' désactivé.");
        }
    },


    // =================================================================
    // Actions CRUD pour la table 'compte'
    // =================================================================

    async createCompte(compte: Omit<Compte, 'id'>) {
      this.loading = true;
      this.error = null;
      try {
        const supabase = useSupabaseClient();
        const { data, error } = await supabase.from('compte').insert([compte]).select().single();
        if (error) throw error;
        if (data) {
          this.comptes.push(data);
        }
        return { data, error: null, loading: false };
      } catch (err: any) {
        this.error = err.message;
        return { data: null, error: err.message, loading: false };
      } finally {
        this.loading = false;
      }
    },

    async fetchComptesForClient(clientId: string) {
      this.loading = true;
      this.error = null;
      try {
        const supabase = useSupabaseClient();
        const { data, error } = await supabase.from('compte').select('*').eq('client_id', clientId);
        if (error) throw error;
        // Remplace les comptes existants pour ce client par les nouveaux
        this.comptes = [...this.comptes.filter(c => c.client_id !== clientId), ...(data || [])];
        return { data, error: null, loading: false };
      } catch (err: any) {
        this.error = err.message;
        return { data: null, error: err.message, loading: false };
      } finally {
        this.loading = false;
      }
    },

    async updateCompte(compte: Compte) {
        this.loading = true;
        this.error = null;
        try {
            const supabase = useSupabaseClient();
            const { data, error } = await supabase.from('compte').update(compte).eq('id', compte.id).select().single();
            if (error) throw error;
            if (data) {
                const index = this.comptes.findIndex(c => c.id === compte.id);
                if (index !== -1) this.comptes[index] = data;
            }
            return { data, error: null, loading: false };
        } catch (err: any) {
            this.error = err.message;
            return { data: null, error: err.message, loading: false };
        } finally {
            this.loading = false;
        }
    },

    async deleteCompte(id: number) {
        this.loading = true;
        this.error = null;
        try {
            const supabase = useSupabaseClient();
            const { error } = await supabase.from('compte').delete().eq('id', id);
            if (error) throw error;
            this.comptes = this.comptes.filter(c => c.id !== id);
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