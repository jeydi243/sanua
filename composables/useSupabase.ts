import { SupabaseClient } from '@supabase/supabase-js'; // Importez le type SupabaseClient

/**
 * Composable pour accéder à l'instance Supabase dans toute l'application Nuxt 3.
 *
 * @returns {SupabaseClient} L'instance du client Supabase.
 * @throws {Error} Si l'instance Supabase n'est pas disponible.
 */
export const useSupabase = (): SupabaseClient => {
  const nuxtApp = useNuxtApp();
  // Vérifiez si $supabase a été fourni par le plugin
  if (!nuxtApp.$supabase) {
    throw new Error('Supabase client non disponible. Assurez-vous que le plugin Supabase est correctement configuré.');
  }
  return nuxtApp?.$supabase as SupabaseClient;
};