<template>
  <div class="w-full p-4 md:p-8">
    <h1 class="font-bold text-4xl mb-2">Clients</h1>
    <span class="text-md text-muted-foreground">Liste de tous les clients de l'application.</span>

    <div class="flex items-center gap-2 py-4">
      <Input class="max-w-sm" placeholder="Filtrer par nom..."
        :model-value="table.getColumn('nom')?.getFilterValue() as string ?? ''"
        @update:model-value="table.getColumn('nom')?.setFilterValue($event)" />

      <Button :disabled="isLoading" @click="clientStore.fetchClients()">
        <Icon v-if="isLoading" name="line-md:loading-twotone-loop" class="text-white" />
        <span v-else>Rafraîchir</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="ml-auto">
            Colonnes
            <ChevronDown class="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem v-for="column in table
            .getAllColumns()
            .filter((c: any) => c.getCanHide())" :key="column.id" class="capitalize" :checked="column.getIsVisible()"
            @update:checked="(value: any) => column.toggleVisibility(!!value)">
            {{ column.id }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateClientForm />
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
            <TableRow v-for="row in table.getRowModel().rows" :key="row.id"
              :data-state="row.getIsSelected() && 'selected'">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <TableRow v-else>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              <span v-if="isLoading">Chargement des clients...</span>
              <span v-else>Aucun client trouvé.</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-end space-x-2 py-4">
      <div class="flex-1 text-sm text-muted-foreground">
        {{ table.getFilteredSelectedRowModel().rows.length }} sur
        {{ table.getFilteredRowModel().rows.length }} ligne(s) sélectionnée(s).
      </div>
      <div class="space-x-2">
        <Button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
          Précédent
        </Button>
        <Button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
          Suivant
        </Button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useClientStore } from "@/stores/client";
import type { Client } from "@/stores/client"; // Assurez-vous que le type est exporté du store
import CreateClientForm from "@/components/clients/createClientForm.vue";
import DropdownActionClient from "@/components/clients/dropdownActionClient.vue";

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/vue-table";
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import { ArrowUpDown, ChevronDown } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const clientStore = useClientStore();

// Récupérer les clients du store de manière réactive
const clients = computed(() => clientStore.clients);
const isLoading = computed(() => clientStore.loading);

onMounted(() => {
  // Si les clients ne sont pas déjà chargés, les récupérer
  if (clients.value.length === 0) {
    clientStore.fetchClients();
  }
});

const getAvatarFallback = (client: Client) => {
  if (!client) return "";
  return `${client.prenom?.[0] ?? ""}${client.nom?.[0] ?? ""}`.toUpperCase();
};

const columns: ColumnDef<Client>[] = [
  {
    id: "select",
    header: ({ table }) =>
      h(Checkbox, {
        checked:
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate"),
        "onUpdate:checked": (value) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: "Select all",
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        "onUpdate:checked": (value) => row.toggleSelected(!!value),
        ariaLabel: "Select row",
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nom",
    header: ({ column }) =>
      h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Client", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      ),
    cell: ({ row }) => {
      const client = row.original;
      return h("div", { class: "flex items-center gap-2" }, [
        h(
          Avatar,
          { class: "h-8 w-8" },
          {
            default: () => [
              h(AvatarImage, { src: client.avatar_url, alt: client.nom }),
              h(AvatarFallback, {}, getAvatarFallback(client)),
            ],
          }
        ),
        h("span", `${client.prenom} ${client.nom}`),
      ]);
    },
  },
  {
    accessorKey: "date_naissance",
    header: "Date de Naissance",
    cell: ({ row }) =>
      h(
        "div",
        new Date(row.getValue("date_naissance")).toLocaleDateString("fr-FR")
      ),
  },
  {
    accessorKey: "contact", // Assurez-vous que ce champ existe dans votre type Client
    header: "Contact",
    cell: ({ row }) => h("div", row.getValue("contact") || "N/A"),
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => h("div", { class: "text-center" }, "Actions"),
    cell: ({ row }) =>
      h(
        "div",
        { class: "relative text-center" },
        h(DropdownActionClient, {
          client: row.original,
        })
      ),
  },
];

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});

const table = useVueTable({
  get data() {
    return clients.value;
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: (updaterOrValue) =>
  (sorting.value =
    typeof updaterOrValue === "function"
      ? updaterOrValue(sorting.value)
      : updaterOrValue),
  onColumnFiltersChange: (updaterOrValue) =>
  (columnFilters.value =
    typeof updaterOrValue === "function"
      ? updaterOrValue(columnFilters.value)
      : updaterOrValue),
  onColumnVisibilityChange: (updaterOrValue) =>
  (columnVisibility.value =
    typeof updaterOrValue === "function"
      ? updaterOrValue(columnVisibility.value)
      : updaterOrValue),
  onRowSelectionChange: (updaterOrValue) =>
  (rowSelection.value =
    typeof updaterOrValue === "function"
      ? updaterOrValue(rowSelection.value)
      : updaterOrValue),
  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
  },
});
</script>
