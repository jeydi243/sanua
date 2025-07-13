<template>
    <div>
        <TabsContent value="parametres">
                parametres
            </TabsContent>
            <TabsContent value="utilisateurs">
                utilisateurs
            </TabsContent>
            <TabsContent value="Lookups">
                Lookups
            </TabsContent>
            <TabsContent value="Organisations">
                Organisations
            </TabsContent>
    </div>
</template>

<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
</script>

<style scoped></style>