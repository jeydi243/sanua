<template>
    <Card>
        <CardHeader>
            <CardTitle>Informations Détaillées</CardTitle>
            <CardDescription>Détails complets du client.</CardDescription>
        </CardHeader>
        <CardContent v-if="client" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p class="font-medium">Prénom</p>
                    <p>{{ client.prenom }}</p>
                </div>
                <div>
                    <p class="font-medium">Nom</p>
                    <p>{{ client.nom }}</p>
                </div>
                <div>
                    <p class="font-medium">Date de Naissance</p>
                    <p>{{ formatDate(client.date_naissance) }}</p>
                </div>
                <div>
                    <p class="font-medium">Téléphone</p>
                    <p>{{ client.telephone }}</p>
                </div>
                <div>
                    <p class="font-medium">Statut Civil</p>
                    <p>{{ client.statut_civil }}</p>
                </div>
                <div>
                    <p class="font-medium">Adresse</p>
                    <p>{{ client.adresse }}</p>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

defineProps<{
    clientId: string
}>()

const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('fr-FR')
}
</script>
