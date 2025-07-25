<script setup lang="ts">
import type { Client } from '@/stores/client';
import { MoreHorizontal } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'vue-router';

const props = defineProps<{
  client: Client
}>();

const router = useRouter();

function goToClientDetails() {
  if (props.client.id) {
    router.push(`/clients/${props.client.id}`);
  }
}

function editClient() {
    // Logique pour éditer le client (peut ouvrir une modale)
    console.log('Edit client:', props.client.id);
}

function deleteClient() {
    // Logique pour supprimer le client (avec confirmation)
    console.log('Delete client:', props.client.id);
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="h-8 w-8 p-0">
        <span class="sr-only">Ouvrir le menu</span>
        <MoreHorizontal class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem @click="goToClientDetails">
        Voir les détails
      </DropdownMenuItem>
      <DropdownMenuItem @click="editClient">
        Modifier
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="text-red-600" @click="deleteClient">
        Supprimer
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
