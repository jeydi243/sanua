<template>
    <div class="w-full ">
        <h1 class="font-bold text-5xl mb-4">Roles</h1>
        <span class="text-md">List de touts les roles dans l'application </span>
        <div class="flex gap-2 items-center py-4">
            <Input class="max-w-52" placeholder="Rechercher"
                :model-value="table.getColumn('code')?.getFilterValue() as string"
                @update:model-value=" table.getColumn('code')?.setFilterValue($event)" />
            <!-- <Button @click="randomize">
                Randomize
            </Button> -->
            <Button @click="fetchRoles">
                <Icon v-if="roleIsFetching" name="line-md:loading-twotone-loop" style="color: white" />
                <Icon v-if="!roleIsFetching" name="cuida:loading-right-outline" style="color: white" />
                <!-- Actualiser -->
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button variant="outline" class="ml-auto">
                        Columns
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

            <CreateRoleForm />
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
                            No results.
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
                    Precedent
                </Button>
                <Button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
                    Suivant
                </Button>
            </div>
        </div>

        <Toaster class="pointer-events-auto" />
    </div>
</template>

<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
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
import { ChevronDown } from 'lucide-vue-next'
import { toast } from 'vue-sonner'


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
import CreateRoleForm from '~/components/roles/createRoleForm.vue'
import DropdownActionRole from '~/components/roles/dropdownActionRole.vue'

export interface Role {
    id: string
    code: number
    name: string
    description: string
}

onMounted(async () => {
    await fetchRoles()
})

// const users = shallowRef<User[]>([])
const roleIsFetching = ref(false)
const errorMessage = ref('')
const roles = ref([])

const fetchRoles = async () => {
    roleIsFetching.value = true;
    errorMessage.value = '';

    toast('Role has been created', {
        description: 'Sunday, December 03, 2023 at 9:00 AM',
        action: {
            label: 'Rafraichir',
            onClick: () => console.log('Rafraichir roles'),
        },
    });
    try {
        // Vous pouvez passer des paramètres de pagination ici, ex: ?page=2&perPage=50

        let { data: _roles, error } = await supabase
            .from('roles')
            .select('*')
        console.log(_roles, error);

        if (!_roles) {
            errorMessage.value = error;
            roles.value = [];
        } else {
            roles.value = _roles;
        }
    } catch (error: any) {
        errorMessage.value = `Error fetching users list: ${error.message}`;
    } finally {
        roleIsFetching.value = false;
        // console.log("pffffff ....");
    }
};

const columns: ColumnDef<Role>[] = [
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
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('code')),
    },
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('name')),
    },
    {
        accessorKey: 'description',
        header: () => h('div', { class: 'text-left' }, 'Description'),
        cell: ({ row }) => {
            return h('div', { class: 'text-left font-medium' }, row.getValue('description'))
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        header: () => h('div', { class: 'text-center' }, 'Actions'),
        cell: ({ row }) => {
            const payment = row.original

            return h('div', { class: 'relative text-center' }, h(DropdownActionRole, {
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
    data: roles,
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
