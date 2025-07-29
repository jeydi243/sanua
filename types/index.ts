// Ce fichier est destiné à contenir tous les types et interfaces personnalisés de votre application.
// Grâce à Nuxt 3, tous les types exportés d'ici seront automatiquement disponibles
// dans l'ensemble de votre projet, sans qu'il soit nécessaire de les importer manuellement.

import type { RealtimeChannel, User } from '@supabase/supabase-js'

// Exemple :
// export interface MonTypePersonnalise {
//   id: number;
//   nom: string;
// }
// Interface pour une organisation. Adaptez les champs à votre table.
export interface Organisation {
    id?: number
    nom: string
    adresse?: string
    telephone?: string
    // Ajoutez d'autres champs pertinents ici
}

// Interface pour l'état du store
export interface OrganisationState {
    organisations: Organisation[]
    loading: boolean
    error: string | null
}
export interface Role {
    id: string
    code: number
    name: string
    description: string
}
export interface responseUsers {
    users: User[]
    total: number
    page: number
    perPage: number
    totalPages: number
}
export interface Payment {
    id: string
    amount: number
    status: 'pending' | 'processing' | 'success' | 'failed'
    email: string
}

// Interface pour un client. Adaptez les champs à votre table 'client'.


// Interface pour un compte. Adaptez les champs à votre table 'compte'.
export interface Compte {
    id?: number
    client_id: string // Clé étrangère vers la table client
    numero_compte: string
    solde: number
    type_compte: string
    // Ajoutez d'autres champs ici
}

// Interface pour une adresse.
export interface Adresse {
    id?: number
    client_id: string
    rue: string
    ville: string
    code_postal: string
    pays: string
    is_primary: boolean
}

// Interface pour l'état du store
export interface ClientState {
    clients: Client[]
    comptes: Compte[]
    adresses: Adresse[]
    loading: boolean
    error: string | null
    clientChannel: RealtimeChannel | null
}
// Interface pour un prêt. Remplacez les champs par ceux de votre table 'pret'.
export interface Pret {
    id?: number
    montant?: number
    duree?: number // en mois
    taux_interet_annuel?: number
    date_debut?: string
    client_id?: string
    // Ajoutez d'autres champs ici
}

// Interface pour un échéancier de prêt. Remplacez les champs par ceux de votre table 'echeancierPret'.
export interface EcheancierPret {
    id?: number
    pret_id?: number
    date_echeance?: string
    montant_echeance?: number
    principal_rembourse?: number
    interet_paye?: number
    capital_restant_du?: number
    // Ajoutez d'autres champs ici
}

// Interface pour un garant.
export interface Garant {
    id?: number
    pret_id: string
    nom: string
    relation: string
    contact: string
}

// Interface pour l'état du store
export interface PretState {
    prets: Pret[]
    echeanciers: EcheancierPret[]
    garants: Garant[]
    loading: boolean
    error: string | null
}

// Interface pour la table Lookup
export interface Lookup {
    id?: number
    lookup_id?: string
    classe_id: string 
    code: string // Ex: 'PERSO', 'ENTREP'
    nom: string // Ex: 'Prêt personnel', 'Prêt entreprise'
    description?: string
}

export interface AdminState {
    users: User[]
    lookups: Lookup[] // Ajout de l'état pour les lookups
    isLoading: boolean
    error: string | null
    errorMessage: string
}
export interface UserState {
    user: User | null // Remplacez 'any' par le type d'utilisateur Supabase si vous l'avez défini
    loading: boolean
    error: string | null
}
