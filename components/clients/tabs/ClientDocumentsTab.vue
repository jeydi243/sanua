<template>
    <Card>
        <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Liste des documents associés au client.</CardDescription>
        </CardHeader>
        <CardContent>
            <p>Section des documents à venir.</p>
            <!-- Interface pour l'upload et la liste des documents -->
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

defineProps<{
    clientId: string
    data: Document[] | null
}>()
</script>
