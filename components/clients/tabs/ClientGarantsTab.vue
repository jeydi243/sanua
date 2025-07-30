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
                                <TableCell :colspan="columns.length" class="h-24 text-center"> Aucun garant trouvé. </TableCell>
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
import { FlexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table'
import type { ColumnDef, SortingState } from '@tanstack/vue-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MoreHorizontal, ArrowUpDown } from 'lucide-vue-next'
import CreateGarantSheet from '~/components/garants/CreateGarantSheet.vue'
import type { Garant, Pret } from '~/types'

const props = defineProps<{
    clientId: string
    prets: Pret[]
    data: Garant[]
}>()

const columns: ColumnDef<Garant>[] = [
    {
        accessorKey: 'nom',
        header: ({ column }) => h(Button, { variant: 'ghost', onClick: () => column.toggleSorting(column.getIsSorted() === 'asc') }, () => ['Nom', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => h('div', {}, row.getValue('nom')),
    },
    {
        accessorKey: 'relation',
        header: 'Relation',
        cell: ({ row }) => h('div', {}, row.getValue('relation')),
    },
    {
        accessorKey: 'contact',
        header: 'Contact',
        cell: ({ row }) => h('div', {}, row.getValue('contact')),
    },
    {
        id: 'actions',
        cell: () => {
            return h('div', { class: 'relative text-right' }, h(MoreHorizontal, { class: 'h-4 w-4' }))
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
