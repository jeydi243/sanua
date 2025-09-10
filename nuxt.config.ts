import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    app: {
        layoutTransition: { name: 'fadeIn' },
    },
    modules: [
        '@nuxt/eslint',
        '@nuxt/fonts',
        '@nuxt/icon',
        '@nuxt/image',
        'shadcn-nuxt',
        '@pinia/nuxt',
        '@nuxtjs/supabase',
        '@nuxtjs/color-mode',
    ],
    colorMode: {
        preference: 'system', // default value of $colorMode.preference
        fallback: 'light', // fallback value if not system preference found
        hid: 'nuxt-color-mode-script',
        globalName: '__NUXT_COLOR_MODE__',
        componentName: 'ColorScheme',
        classPrefix: '',
        classSuffix: '',
        storage: 'localStorage', // or 'sessionStorage' or 'cookie'
        storageKey: 'nuxt-color-mode',
    },
    fonts: {
        families: [
            { name: 'Montserrat', provider: 'google' },
            { name: 'Roboto', provider: 'google' },
            { name: 'Open Sans', provider: 'google' },
            { name: 'JetBrains Mono', provider: 'google' },
        ],
    },
    css: ['~/assets/css/tailwind.css'],
    vite: {
        plugins: [tailwindcss()],
    },
    supabase: {
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_ANON_KEY,
        redirect: false, // Gère les redirections post-connexion/déconnexion
        redirectOptions: {
            login: '/auth',
            callback: '/confirm',
        },
    },
    runtimeConfig: {
        // Private keys are only available on the server
        apiSecret: '12345678',

        // Public keys that are exposed to the client
        public: {
            SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
            SUPABASE_URL: process.env.SUPABASE_URL,
        },
    },
    shadcn: {
        prefix: '',
        /**
         * Directory that the component lives in.
         * @default "./components/ui"
         */
        componentDir: './components/ui',
    },
    icon: {
        clientBundle: {
            // list of icons to include in the client bundle
            // icons: [
            //   'uil:github',
            //   'logos:vitejs',

            // ],

            // scan all components in the project and include icons
            scan: true,

            // include all custom collections in the client bundle
            includeCustomCollections: true,

            // guard for uncompressed bundle size, will fail the build if exceeds
            sizeLimitKb: 256,
        },
    },
})
