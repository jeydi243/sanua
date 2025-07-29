<template>
    <Card>
        <CardHeader class="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Adresses</CardTitle>
                <CardDescription>Liste des adresses du client.</CardDescription>
            </div>
            <CreateAdresseSheet :client-id="clientId" />
        </CardHeader>
        <CardContent>
            <p>Section des adresses à venir.</p>
            <!-- Afficher la liste des adresses ici -->
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import CreateAdresseSheet from '~/components/adresses/CreateAdresseSheet.vue'

defineProps<{
    clientId: string
}>()
</script>
