// Créez ce fichier si vous voulez une meilleure autocomplétion pour $supabase
declare module '#app' {
    interface NuxtApp {
      $supabase: ReturnType<typeof createClient>;
    }
  }
  
  declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
      $supabase: ReturnType<typeof createClient>;
    }
  }