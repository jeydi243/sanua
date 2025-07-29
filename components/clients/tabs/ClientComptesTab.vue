<template>
    <Card>
        <CardHeader class="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Comptes du Client</CardTitle>
                <CardDescription>Liste des comptes d'épargne et courants.</CardDescription>
            </div>
            <CreateCompteSheet v-if="clientId" :client-id="clientId" />
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>N° Compte</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead class="text-right">Solde</TableHead>
                        <TableHead class="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="comptes.length > 0">
                        <TableRow v-for="compte in comptes" :key="compte.id">
                            <TableCell class="font-medium">{{ compte.numero_compte }}</TableCell>
                            <TableCell>{{ compte.type_compte }}</TableCell>
                            <TableCell class="text-right">{{ formatCurrency(compte.solde) }}</TableCell>
                            <TableCell class="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger as-child>
                                        <Button variant="ghost" class="h-8 w-8 p-0">
                                            <span class="sr-only">Ouvrir le menu</span>
                                            <MoreHorizontal class="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Voir les transactions</DropdownMenuItem>
                                        <DropdownMenuItem>Faire un dépôt</DropdownMenuItem>
                                        <DropdownMenuItem>Faire un retrait</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    </template>
                    <template v-else>
                        <TableRow>
                            <TableEmpty :colspan="4">Aucun compte trouvé pour ce client.</TableEmpty>
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
import CreateCompteSheet from '~/components/clients/CreateCompteSheet.vue'
import type { Compte } from '~/types'

defineProps<{
    clientId: string
    comptes: Compte[]
}>()

const formatCurrency = (amount?: number) => {
    if (amount === undefined) return 'N/A'
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
    }).format(amount)
}
</script>
