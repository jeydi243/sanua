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
                                <TableCell :colspan="columns.length" class="h-24 text-center"> Aucune adresse trouvée. </TableCell>
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
import { MoreHorizontal, ArrowUpDown } from 'lucide-vue-next'
import CreateAdresseSheet from '~/components/adresses/CreateAdresseSheet.vue'
import type { Adresse } from '~/types'

const props = defineProps<{
    clientId: string
    data: Adresse[]| null
}>()

const columns: ColumnDef<Adresse>[] = [
    {
        accessorKey: 'rue',
        header: ({ column }) => h(Button, { variant: 'ghost', onClick: () => column.toggleSorting(column.getIsSorted() === 'asc') }, () => ['Rue', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => h('div', {}, row.getValue('rue')),
    },
    {
        accessorKey: 'ville',
        header: 'Ville',
        cell: ({ row }) => h('div', {}, row.getValue('ville')),
    },
    {
        accessorKey: 'code_postal',
        header: 'Code Postal',
        cell: ({ row }) => h('div', {}, row.getValue('code_postal')),
    },
    {
        accessorKey: 'pays',
        header: 'Pays',
        cell: ({ row }) => h('div', {}, row.getValue('pays')),
    },
    {
        accessorKey: 'is_primary',
        header: 'Principale',
        cell: ({ row }) => h('div', {}, row.getValue('is_primary') ? 'Oui' : 'Non'),
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
