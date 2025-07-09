<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">

const userStore = useUserStore();

onMounted(() => {
  // Initialise l'utilisateur et configure l'écouteur d'authentification au démarrage de l'application.
  // Cela garantit que le store est à jour avec la session actuelle
  // et qu'il réagit aux changements d'état d'authentification.
  userStore.fetchUser();
  userStore.setupAuthListener();
});
</script>
