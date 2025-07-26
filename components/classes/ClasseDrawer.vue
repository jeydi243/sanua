<template>
  <Drawer :open="open" @update:open="handleUpdateOpen">
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Détails de la classe</DrawerTitle>
        <DrawerDescription>
          Voici les détails de la classe sélectionnée.
        </DrawerDescription>
      </DrawerHeader>
      <div>
        <p>ID de la classe : {{ classeId }}</p>
      </div>
      <DrawerFooter>
        <DrawerClose as-child>
          <Button variant="outline">
            Fermer
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>

<script setup lang="ts">
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  open: boolean
  classeId: number | null
}>()

const emit = defineEmits(['update:open'])

const handleUpdateOpen = (value: boolean) => {
  emit('update:open', value)
}
</script>
