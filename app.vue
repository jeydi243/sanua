<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <!-- <Transition name="fadeIn" mode="out-in"> -->
      <NuxtPage :page-key="route => route.fullPath" />
    <!-- </Transition> -->
  </NuxtLayout>
</template>
<script setup lang="ts">

const { fetchUser, setupAuthListener } = useUserStore();

onMounted(() => {
  // Initialise l'utilisateur et configure l'écouteur d'authentification au démarrage de l'application.
  // Cela garantit que le store est à jour avec la session actuelle
  // et qu'il réagit aux changements d'état d'authentification.
  fetchUser();
  setupAuthListener();
});
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
