<template>
  <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
    <div class="grid auto-rows-min gap-4 md:grid-cols-3">
      <div class="bg-muted/50 aspect-video rounded-xl border" />
      <div class="bg-muted/50 aspect-video rounded-xl border" />
      <div class="bg-muted/50 aspect-video rounded-xl border" />
    </div>
    <div class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'], // Applique le middleware 'auth' à cette page
  requiresAuth: true,
  title: 'Dashboard - Sanua'
})

</script>