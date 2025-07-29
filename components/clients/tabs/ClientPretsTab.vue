<template>
    <Card>
        <CardHeader class="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Prêts du Client</CardTitle>
                <CardDescription>Liste des prêts accordés au client.</CardDescription>
            </div>
            <CreatePretSheet v-if="clientId"  :client-id="clientId" />
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Montant</TableHead>
                        <TableHead>Taux</TableHead>
                        <TableHead>Date de début</TableHead>
                        <TableHead class="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="prets.length > 0">
                        <TableRow v-for="pret in prets" :key="pret.id">
                            <TableCell class="font-medium">{{ formatCurrency(pret.montant) }}</TableCell>
                            <TableCell>{{ pret.taux_interet_annuel }}%</TableCell>
                            <TableCell>{{ formatDate(pret.date_debut) }}</TableCell>
                            <TableCell class="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger as-child>
                                        <Button variant="ghost" class="h-8 w-8 p-0">
                                            <span class="sr-only">Ouvrir le menu</span>
                                            <MoreHorizontal class="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Voir l'échéancier</DropdownMenuItem>
                                        <DropdownMenuItem>Enregistrer un remboursement</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    </template>
                    <template v-else>
                        <TableRow>
                            <TableEmpty :colspan="4">Aucun prêt trouvé pour ce client.</TableEmpty>
                        </TableRow>
                    </template>
                </TableBody>
            </Table>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableEmpty } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-vue-next'
import CreatePretSheet from '~/components/prets/CreatePretSheet.vue'
import type { Pret } from '~/types'

defineProps<{
    clientId: string
    prets: Pret[]
}>()

const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('fr-FR')
}

const formatCurrency = (amount?: number) => {
    if (amount === undefined) return 'N/A'
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
    }).format(amount)
}
</script>
