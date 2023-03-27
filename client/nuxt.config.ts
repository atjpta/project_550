// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        '@nuxtjs/supabase',

    ],
    alias: {
        pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs"
    },
    css: [  
        '@fortawesome/fontawesome-svg-core/styles.css'
    ],
    plugins: [
        "~/plugins/fontawesome.js",
    ],
    // app: {
    //     pageTransition: { name: 'bounce'}
    // },
    ssr: false,
})
