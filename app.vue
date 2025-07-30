<template>
    <NuxtLayout>
        <NuxtRouteAnnouncer />
        <!-- <Transition name="fadeIn" mode="out-in"> -->
        <NuxtPage :page-key="(route) => route.fullPath" />
        <Toaster />
        <!-- </Transition> -->
    </NuxtLayout>
</template>
<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
const { fetchUser, setupAuthListener } = useUserStore()
const { init } = useClientStore()

onMounted(() => {
    // Initialise l'utilisateur et configure l'écouteur d'authentification au démarrage de l'application.
    // Cela garantit que le store est à jour avec la session actuelle
    // et qu'il réagit aux changements d'état d'authentification.
    fetchUser()
    setupAuthListener()
    init().catch((err) => {
        console.error('Erreur lors de l\'initialisation du store client:', err)
    })
})
</script>

<style>
.fadeIn-enter-active,
.fadeIn-leave-active {
    transition: all s ease;
}

.fadeIn-enter-from,
.fadeIn-leave-to {
    opacity: 0;
}
</style>
