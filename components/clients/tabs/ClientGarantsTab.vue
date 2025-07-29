<template>
    <Card>
        <CardHeader class="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Garants</CardTitle>
                <CardDescription>Liste des garants pour les prêts du client.</CardDescription>
            </div>
            <CreateGarantSheet v-if="prets.length > 0" :pret-id="prets[0].id" />
        </CardHeader>
        <CardContent>
            <p>Section des garants à venir.</p>
            <!-- Afficher la liste des garants ici -->
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import CreateGarantSheet from '~/components/garants/CreateGarantSheet.vue'
import type { Pret } from '~/types'

defineProps<{
    clientId: string,
    prets: Pret[]
}>()
</script>
