import type { User } from '@supabase/supabase-js'
import { defineStore } from 'pinia'

interface AdminState {
    currentUser: User | null
    users: User[]
    isLoading: boolean
    error: string | null
    isAuthenticated: boolean
    errorMessage: string
}

export const useAdminStore = defineStore('admin', {
    state: (): AdminState => ({
        currentUser: null,
        users: [],
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
        // Fonction pour récupérer un utilisateur par ID (déjà présente)
        async fetchUserById(userId: string) {
            this.loading = true;
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
                this.loading = false;
            }
        },

        // Fonction pour lister les utilisateurs
        async fetchUsers() {
            this.loading = true;
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
                this.loading = false;
            }
        },

        // Fonction pour créer un utilisateur
        async createUser(email: string, password: string, metadata?: object) {
            this.loading = true;
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
                this.loading = false;
            }
        },

        // Fonction pour mettre à jour un utilisateur
        async updateUser(userId: string, updates: object) {
            this.loading = true;
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
                this.loading = false;
            }
        },

        // Fonction pour supprimer un utilisateur
        async deleteUser(userId: string) {
            this.loading = true;
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
                this.loading = false;
            }
        },

        // Fonction pour inviter un utilisateur
        async inviteUser(email: string, metadata?: object) {
            this.loading = true;
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
                this.loading = false;
            }
        },

        // Fonction pour générer un lien (ex: réinitialisation de mot de passe)
        async generateAuthLink(email: string, type: string, options?: object) {
            this.loading = true;
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
                this.loading = false;
            }
        }
    }
}) 
