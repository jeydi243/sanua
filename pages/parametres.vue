<template>
    <div class="w-full">
        <Tabs default-value="parametres" class="w-[1000px]">
            <TabsList>
                <TabsTrigger value="parametres">
                    Parametres
                </TabsTrigger>
                <TabsTrigger value="utilisateurs">
                    Utilisateurs
                </TabsTrigger>
                <TabsTrigger value="Lookups">
                    Lookups
                </TabsTrigger>
                <TabsTrigger value="Organisations">
                    Organisations
                </TabsTrigger>
            </TabsList>
            <NuxtPage />
        </Tabs>
    </div>

</template>

<script setup lang="ts">
import { NuxtPage } from '#components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
useHead({
    title: 'Sanua - Parametres'
})
</script>

<style scoped></style>