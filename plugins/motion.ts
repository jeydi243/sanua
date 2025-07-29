import { MotionPlugin, fade } from '@vueuse/motion'
// import { fade } from '@vueuse/motion/presets'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(MotionPlugin, {
        directives: {
            'motion-fade': fade,
        },
    })
})
