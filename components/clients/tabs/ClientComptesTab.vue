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
            <div class="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                            <TableHead v-for="header in headerGroup.headers" :key="header.id">
                                <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <template v-if="table.getRowModel().rows?.length">
                            <TableRow v-for="row in table.getRowModel().rows" :key="row.id" :data-state="row.getIsSelected() && 'selected'">
                                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                                    <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                                </TableCell>
                            </TableRow>
                        </template>
                        <template v-else>
                            <TableRow>
                                <TableCell :colspan="columns.length" class="h-24 text-center"> Aucun compte trouvé. </TableCell>
                            </TableRow>
                        </template>
                    </TableBody>
                </Table>
            </div>
            <div class="flex items-center justify-end space-x-2 py-4">
                <Button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()"> Précédent </Button>
                <Button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()"> Suivant </Button>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import { FlexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table'
import type { ColumnDef, SortingState } from '@tanstack/vue-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, ArrowUpDown } from 'lucide-vue-next'
import CreateCompteSheet from '~/components/clients/CreateCompteSheet.vue'
import type { Compte } from '~/types'

const props = defineProps<{
    clientId: string
    data: Compte[] | null
}>()

const formatCurrency = (amount?: number) => {
    if (amount === undefined) return 'N/A'
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount)
}

const columns: ColumnDef<Compte>[] = [
    {
        accessorKey: 'numero_compte',
        header: ({ column }) => h(Button, { variant: 'ghost', onClick: () => column.toggleSorting(column.getIsSorted() === 'asc') }, () => ['N° Compte', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('numero_compte')),
    },
    {
        accessorKey: 'type_compte',
        header: 'Type',
        cell: ({ row }) => h('div', {}, row.getValue('type_compte')),
    },
    {
        accessorKey: 'solde',
        header: () => h('div', { class: 'text-right' }, 'Solde'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(row.getValue('solde'))),
    },
    {
        id: 'actions',
        cell: () => {
            return h(
                'div',
                { class: 'relative text-right' },
                h(DropdownMenu, {}, () => [h(DropdownMenuTrigger, { asChild: true }, () => h(Button, { variant: 'ghost', class: 'h-8 w-8 p-0' }, () => [h('span', { class: 'sr-only' }, 'Ouvrir le menu'), h(MoreHorizontal, { class: 'h-4 w-4' })])), h(DropdownMenuContent, { align: 'end' }, () => [h(DropdownMenuItem, {}, () => 'Voir les transactions'), h(DropdownMenuItem, {}, () => 'Faire un dépôt'), h(DropdownMenuItem, {}, () => 'Faire un retrait')])]),
            )
        },
    },
]

const sorting = ref<SortingState>([])

const table = useVueTable({
    get data() {
        return props.data
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
    state: {
        get sorting() {
            return sorting.value
        },
    },
})
</script>
