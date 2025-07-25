<template>
  <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
    <ClientOnly>
      <BlurReveal :delay="0.2" :duration="2" class="p-8">
        <h2 class="text-3xl font-bold font tracking-tighter xl:text-5xl/none sm:text-5xl">Bonjour 👋 {{ data.full_name }}
        </h2>
        <span class="text-pretty text-xl tracking-tighter xl:text-4xl/none sm:text-3xl">
          Ravis de vous revoir
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


const user = useSupabaseUser();
const supabase = useSupabaseClient()


const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.value.id)
  .single();

</script>