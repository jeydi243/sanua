<template>
    <div class="w-full ">
        <h1 class="font-bold text-5xl mb-4">Organisations</h1>
        <span class="text-md">List de toutes les organisations dans l'application </span>
        <div class="flex gap-2 items-center py-4">
            <Input class="max-w-52" placeholder="Rechercher"
                :model-value="table.getColumn('email')?.getFilterValue() as string"
                @update:model-value=" table.getColumn('email')?.setFilterValue($event)" />

            <Button @click="fetchOrganisations">
                <Icon name="line-md:loading-twotone-loop" style="color: white" v-if="userIsFetching" />
                <Icon name="cuida:loading-right-outline" style="color: white" v-if="!userIsFetching" />

            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button variant="outline" class="ml-auto">
                        Colonnes
                        <ChevronDown class="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem
                        v-for="column in table.getAllColumns().filter((column) => column.getCanHide())" :key="column.id"
                        class="capitalize" :model-value="column.getIsVisible()" @update:model-value="(value) => {
                            column.toggleVisibility(!!value)
                        }">
                        {{ column.id }}
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <CreateOrgForm />
        </div>
        <div class="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                        <TableHead v-for="header in headerGroup.headers" :key="header.id">
                            <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                                :props="header.getContext()" />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="table.getRowModel().rows?.length">
                        <template v-for="row in table.getRowModel().rows" :key="row.id">
                            <TableRow :data-state="row.getIsSelected() && 'selected'">
                                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                                    <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="row.getIsExpanded()">
                                <TableCell :colspan="row.getAllCells().length">
                                    {{ JSON.stringify(row.original) }}
                                </TableCell>
                            </TableRow>
                        </template>
                    </template>

                    <TableRow v-else>
                        <TableCell :colspan="columns.length" class="h-24 text-center">
                            Aucune organisation !
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>

        <div class="flex items-center justify-end space-x-2 py-4">
            <div class="flex-1 text-sm text-muted-foreground">
                {{ table.getFilteredSelectedRowModel().rows.length }} of
                {{ table.getFilteredRowModel().rows.length }} row(s) selected.
            </div>
            <div class="space-x-2">
                <Button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()"
                    @click="table.previousPage()">
                    Previous
                </Button>
                <Button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
                    Next
                </Button>
            </div>
        </div>

        <Toaster class="pointer-events-auto" />
    </div>
</template>

<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import CreateOrgForm from '@/components/organisations/createOrgForm.vue'
import type {
    ColumnDef,
    ColumnFiltersState,
    ExpandedState,
    SortingState,
    VisibilityState,
} from '@tanstack/vue-table'
import {
    FlexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useVueTable,
} from '@tanstack/vue-table'
import { ArrowUpDown, ChevronDown } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar'

const supabase = useSupabaseClient()

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import DropdownAction from '@/components/users/dropdownAction.vue'
import type { User } from '@supabase/supabase-js'

export interface responseUsers {
    users: User[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}

export interface Organisation {
    id: User[];
    lookup_id: number;
    nom: number;
    description: number;
    created_at: string;
}


onMounted(async () => {
    await fetchOrganisations()
})

const organisations = shallowRef<[]>([])
const orgsIsFetching = ref(false)
const errorMessage = ref('')

const fetchOrganisations = async () => {
    orgsIsFetching.value = true;
    errorMessage.value = '';

    try {
        // Vous pouvez passer des paramètres de pagination ici, ex: ?page=2&perPage=50

        let { data: _organisations, error } = await supabase
            .from('organisation')
            .select('*')
        console.log(_organisations, error);

        if (!_organisations) {
            errorMessage.value = error;
            organisations.value = [];
            toast('Organisations have been fetched !', {
                description: 'Sunday, December 03, 2023 at 9:00 AM',
                action: {
                    label: 'Ok',
                    onClick: () => console.log('Undo'),
                },
            });
        } else {
            organisations.value = _organisations;
        }
    } catch (error: any) {
        errorMessage.value = `Error fetching users list: ${error.message}`;
    } finally {
        orgsIsFetching.value = false;
        // console.log("pffffff ....");
    }
};

const columns: ColumnDef<Organisation>[] = [
    {
        id: 'select',
        header: ({ table }) => h(Checkbox, {
            'modelValue': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
            'onUpdate:modelValue': value => table.toggleAllPageRowsSelected(!!value),
            'ariaLabel': 'Select all',
        }),
        cell: ({ row }) => h(Checkbox, {
            'modelValue': row.getIsSelected(),
            'onUpdate:modelValue': value => row.toggleSelected(!!value),
            'ariaLabel': 'Select row',
        }),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'code',
        header: 'Code',
        cell: ({ row }) => h(
            Avatar,
            { class: 'h-8 w-8 rounded-lg' },
            {
                default: () => [
                    h(AvatarImage, { src: row.getValue('avatar_url'), alt: row.getValue('username') }),
                    h(AvatarFallback, { class: 'rounded-lg' }, 'CN')
                ]
            }
        ),
    },
    {
        accessorKey: 'nom',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Nom', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('nom')),
    },
    {
        accessorKey: 'description',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Description', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('description')),
    },

    {
        accessorKey: 'lookup_id',
        header: () => h('div', { class: 'text-right' }, "Type d'organisation"),
        cell: ({ row }) => {
            return h('div', { class: 'text-right font-medium' }, row.getValue('lookup_id'))
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        header: () => h('div', { class: 'text-center' }, 'Actions'),
        cell: ({ row }) => {
            const payment = row.original

            return h('div', { class: 'relative text-center' }, h(DropdownAction, {
                payment,
                onExpand: row.toggleExpanded,
            }))
        },
    },
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const table = useVueTable({
    data: organisations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
    onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
    onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
    onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
    onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expanded),
    state: {
        get sorting() { return sorting.value },
        get columnFilters() { return columnFilters.value },
        get columnVisibility() { return columnVisibility.value },
        get rowSelection() { return rowSelection.value },
        get expanded() { return expanded.value },
    },
})

</script>
