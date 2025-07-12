<template>
  <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
    <ClientOnly>
      <BlurReveal :delay="0.2" :duration="2" class="p-8">
        <h2 class="text-3xl font-bold tracking-tighter xl:text-6xl/none sm:text-5xl">Hey there 👋</h2>
        <span class="text-pretty text-xl tracking-tighter xl:text-4xl/none sm:text-3xl">
          How is it going?
        </span>
      </BlurReveal>
    </ClientOnly>
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
  middleware: 'auth', // Applique le middleware 'auth' à cette page
  requiresAuth: true,
})

useHead({ title: 'Dashboard - Sanua' })

</script>