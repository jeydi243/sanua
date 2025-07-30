// types/store.ts

import type { RealtimeChannel, User } from '@supabase/supabase-js'
import type { Client, Compte, Adresse, Organisation, Pret, EcheancierPret, Lookup } from '~/types'

/**
 * État pour le store des clients.
 * Gère une liste globale de clients et un client "actif" avec ses données associées.
 */
export interface ClientState {
    clients: Client[] // Liste globale pour les affichages de type tableau
    activeClient: {
        details: Client
        comptes: Compte[]
        adresses: Adresse[]
        contacts: Adresse[]
        prets: Pret[]
    } | null
    clientChannel: RealtimeChannel | null
    // Les listeners pour les comptes/adresses seront gérés dynamiquement
}

/**
 * État pour le store des organisations.
 */
export interface OrganisationState {
    organisations: Organisation[]
    organisationChannel: RealtimeChannel | null
}

/**
 * État pour le store des prêts.
 * Gère une liste globale de prêts et un prêt "actif" avec son échéancier.
 */
export interface PretState {
    prets: Pret[] // Liste globale
    activePret: {
        details: Pret
        echeancier: EcheancierPret[]
        garants: any[]
    } | null
    pretChannel: RealtimeChannel | null
    // Le listener pour l'échéancier sera géré dynamiquement
}

/**
 * État pour le store de l'utilisateur (authentification).
 */
export interface UserState {
    user: User | null
}

/**
 * État pour le store d'administration.
 */
export interface AdminState {
    users: User[]
    lookups: Lookup[]
}