import type { User } from '@supabase/supabase-js'
import { defineStore } from 'pinia'

// Interface pour la table Lookup
interface Lookup {
  id?: number;
  type: string; // Ex: 'TYPE_PRET', 'STATUT_CLIENT'
  code: string; // Ex: 'PERSO', 'ENTREP'
  valeur: string; // Ex: 'Prêt personnel', 'Prêt entreprise'
  description?: string;
}

interface AdminState {
    currentUser: User | null
    users: User[]
    lookups: Lookup[] // Ajout de l'état pour les lookups
    isLoading: boolean
    error: string | null
    isAuthenticated: boolean
    errorMessage: string
}

export const useAdminStore = defineStore('admin', {
    state: (): AdminState => ({
        currentUser: null,
        users: [],
        lookups: [], // Initialisation du tableau de lookups
        isLoading: false,
        error: null,
        isAuthenticated: false,
        errorMessage: ''
    }),

    getters: {
        // Get current admin user
        getCurrentUser: (state) => state.currentUser,

        // Get all users
        getAllUsers: (state) => state.users,

        // Get all lookups
        getAllLookups: (state) => state.lookups,

        // Get lookups by type
        getLookupsByType: (state) => (type: string) =>
            state.lookups.filter(lookup => lookup.type === type),

        // Get users by role
        getUsersByRole: (state) => (role: string) =>
            state.users.filter(user => user.role.contains(role)),

        // Check if admin is logged in
        isLoggedIn: (state) => state.isAuthenticated,

        // Get loading state
        getLoadingState: (state) => state.isLoading,

        // Get error message
        getError: (state) => state.error
    },
 
    actions: {
        // =================================================================
        // Actions CRUD pour la table 'lookup'
        // =================================================================

        /**
         * Crée une nouvelle entrée dans la table lookup.
         * @param lookup - L'objet lookup à créer.
         */
        async createLookup(lookup: Omit<Lookup, 'id'>) {
            this.isLoading = true;
            this.errorMessage = '';
            try {
                const supabase = useSupabaseClient();
                const { data, error } = await supabase.from('lookup').insert([lookup]).select().single();
                if (error) throw new Error(error.message);
                if (data) {
                    this.lookups.push(data);
                }
                return { data, error: null, loading: false };
            } catch (err: any) {
                this.errorMessage = `Error creating lookup: ${err.message}`;
                return { data: null, error: err.message, loading: false };
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * Récupère toutes les entrées de la table lookup.
         */
        async fetchLookups() {
            this.isLoading = true;
            this.errorMessage = '';
            try {
                const supabase = useSupabaseClient();
                const { data, error } = await supabase.from('lookup').select('*');
                if (error) throw new Error(error.message);
                this.lookups = data || [];
                return { data, error: null, loading: false };
            } catch (err: any) {
                this.errorMessage = `Error fetching lookups: ${err.message}`;
                return { data: null, error: err.message, loading: false };
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * Met à jour une entrée dans la table lookup.
         * @param lookup - L'objet lookup avec les informations mises à jour.
         */
        async updateLookup(lookup: Lookup) {
            this.isLoading = true;
            this.errorMessage = '';
            try {
                const supabase = useSupabaseClient();
                const { data, error } = await supabase.from('lookup').update(lookup).eq('id', lookup.id).select().single();
                if (error) throw new Error(error.message);
                if (data) {
                    const index = this.lookups.findIndex(l => l.id === lookup.id);
                    if (index !== -1) this.lookups[index] = data;
                }
                return { data, error: null, loading: false };
            } catch (err: any) {
                this.errorMessage = `Error updating lookup: ${err.message}`;
                return { data: null, error: err.message, loading: false };
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * Supprime une entrée de la table lookup par son ID.
         * @param id - L'ID de l'entrée à supprimer.
         */
        async deleteLookup(id: number) {
            this.isLoading = true;
            this.errorMessage = '';
            try {
                const supabase = useSupabaseClient();
                const { error }.from('lookup').delete().eq('id', id);
                if (error) throw new Error(error.message);
                this.lookups = this.lookups.filter(l => l.id !== id);
                return { data: { success: true }, error: null, loading: false };
            } catch (err: any) {
                this.errorMessage = `Error deleting lookup: ${err.message}`;
                return { data: null, error: err.message, loading: false };
            } finally {
                this.isLoading = false;
            }
        },

        // =================================================================
        // Actions pour la gestion des utilisateurs (via API server)
        // =================================================================

        // Fonction pour récupérer un utilisateur par ID (déjà présente)
        async fetchUserById(userId: string) {
            this.isLoading = true;
            this.errorMessage = '';
            try {
                const response = await fetch(`/api/admin/users/${userId}`);
                const result = await response.json();
                if (!response.ok) {
                    this.errorMessage = result.message || 'An unknown error occurred.';
                    this.currentUser = null;
                } else {
                    this.currentUser = result.user;
                }
            } catch (error: any) {
                this.errorMessage = `Error fetching user: ${error.message}`;
            } finally {
                this.isLoading = false;
            }
        },

        // Fonction pour lister les utilisateurs
        async fetchUsers() {
            this.isLoading = true;
            this.errorMessage = '';
            try {
                // Vous pouvez passer des paramètres de pagination ici, ex: ?page=2&perPage=50
                const response = await fetch('/api/admin/users/list');
                const result = await response.json();
                if (!response.ok) {
                    this.errorMessage = result.message || 'An unknown error occurred.';
                    this.users = [];
                } else {
                    this.users = result.users;
                }
            } catch (error: any) {
                this.errorMessage = `Error fetching users list: ${error.message}`;
            } finally {
                this.isLoading = false;
            }
        },

        // Fonction pour créer un utilisateur
        async createUser(email: string, password: string, metadata?: object) {
            this.isLoading = true;
            this.errorMessage = '';
            try {
                const response = await fetch('/api/admin/users/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, user_metadata: metadata })
                });
                const result = await response.json();
                if (!response.ok) {
                    this.errorMessage = result.message || 'Failed to create user.';
                } else {
                    console.log('User created:', result.user);
                    // Actualiser la liste des utilisateurs ou faire autre chose
                }
            } catch (error: any) {
                this.errorMessage = `Error creating user: ${error.message}`;
            } finally {
                this.isLoading = false;
            }
        },

        // Fonction pour mettre à jour un utilisateur
        async updateUser(userId: string, updates: object) {
            this.isLoading = true;
            this.errorMessage = '';
            try {
                const response = await fetch(`/api/admin/users/update/${userId}`, {
                    method: 'PUT', // Ou PATCH selon votre préférence et si vous voulez une mise à jour partielle
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updates)
                });
                const result = await response.json();
                if (!response.ok) {
                    this.errorMessage = result.message || 'Failed to update user.';
                } else {
                    console.log('User updated:', result.user);
                    // Actualiser les détails de l'utilisateur ou la liste
                }
            } catch (error: any) {
                this.errorMessage = `Error updating user: ${error.message}`;
            } finally {
                this.isLoading = false;
            }
        },

        // Fonction pour supprimer un utilisateur
        async deleteUser(userId: string) {
            this.isLoading = true;
            this.errorMessage = '';
            try {
                const response = await fetch(`/api/admin/users/delete/${userId}`, {
                    method: 'DELETE'
                });
                const result = await response.json();
                if (!response.ok) {
                    this.errorMessage = result.message || 'Failed to delete user.';
                } else {
                    console.log('User deleted:', result.message);
                    // Supprimer l'utilisateur de la liste côté client
                    this.users = this.users.filter(u => u.id !== userId);
                }
            } catch (error: any) {
                this.errorMessage = `Error deleting user: ${error.message}`;
            } finally {
                this.isLoading = false;
            }
        },

        // Fonction pour inviter un utilisateur
        async inviteUser(email: string, metadata?: object) {
            this.isLoading = true;
            this.errorMessage = '';
            try {
                const response = await fetch('/api/admin/users/invite', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, user_metadata: metadata })
                });
                const result = await response.json();
                if (!response.ok) {
                    this.errorMessage = result.message || 'Failed to invite user.';
                } else {
                    console.log('User invited:', result.user);
                }
            } catch (error: any) {
                this.errorMessage = `Error inviting user: ${error.message}`;
            } finally {
                this.isLoading = false;
            }
        },

        // Fonction pour générer un lien (ex: réinitialisation de mot de passe)
        async generateAuthLink(email: string, type: string, options?: object) {
            this.isLoading = true;
            this.errorMessage = '';
            try {
                const response = await fetch('/api/admin/users/generate-link', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, type, ...options })
                });
                const result = await response.json();
                if (!response.ok) {
                    this.errorMessage = result.message || 'Failed to generate link.';
                } else {
                    console.log('Auth link generated:', result.properties.action_link);
                    // Afficher le lien à l'administrateur ou l'envoyer par d'autres moyens
                }
            } catch (error: any) {
                this.errorMessage = `Error generating link: ${error.message}`;
            } finally {
                this.isLoading = false;
            }
        }
    }
}) 
