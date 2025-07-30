// Ce fichier est destiné à contenir tous les types et interfaces de données de votre application,
// à l'exception des types d'état des stores Pinia, qui sont dans `types/store.ts`.
// Grâce à Nuxt 3, tous les types exportés d'ici seront automatiquement disponibles
// dans l'ensemble de votre projet.

import type { User } from '@supabase/supabase-js'
import type { Tables } from './supabase'

// =================================================================
// Type Aliases from Supabase Schema
// =================================================================

export type Organisation = Tables<'organisation'>
export type Client = Tables<'client'>
export type Compte = Tables<'compte'>
export type Pret = Tables<'pret'>
export type EcheancierPret = Tables<'echeancierpret'>
export type Lookup = Tables<'lookup'>
export type Profile = Tables<'profiles'>
export type Role = Tables<'roles'>

// =================================================================
// Manually defined types
// =================================================================

export interface Adresse {
    id?: number
    client_id: string
    rue: string
    ville: string
    code_postal: string
    pays: string
    is_primary: boolean
}

// =================================================================
// Other Custom Types
// =================================================================

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
