import { createClient } from '@supabase/supabase-js';

export default defineNuxtPlugin(nuxtApp => {
    // Assurez-vous que vos variables d'environnement sont publiques
    // et accessibles via useRuntimeConfig().public
    const config = useRuntimeConfig();

    // Vérifiez si les variables d'environnement sont définies
    if (!config.public.SUPABASE_URL || !config.public.SUPABASE_ANON_KEY) {
        console.error('Erreur: Les variables d\'environnement SUPABASE_URL ou SUPABASE_KEY ne sont pas définies.');
        // Vous pouvez choisir de lancer une erreur ou de gérer cela différemment
        // selon la criticité de l'application sans Supabase.
        return;
    }

    // Créez l'instance Supabase
    const supabase = createClient(
        config.public.SUPABASE_URL,
        config.public.SUPABASE_ANON_KEY
    );

    // Fournissez l'instance Supabase à l'application Nuxt.
    // Elle sera accessible via `useNuxtApp().$supabase`
    // ou via un composable personnalisé que nous allons créer.
    nuxtApp.provide('supabase2', supabase);

    // Optionnel: Vous pouvez également rendre l'instance disponible directement
    // pour une utilisation plus simple dans les composables/pages avec un composable.
    // Nous allons montrer comment faire cela plus tard.
});