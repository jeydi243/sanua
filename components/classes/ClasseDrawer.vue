<template>
    <Drawer :open="open" @update:open="handleUpdateOpen">
        <div class="flex flex-row items-center justify-center align-middle">
            <DrawerContent class="w-[70%] place-self-center">
                <DrawerHeader>
                    <DrawerTitle>Liste des lookups de cette classe</DrawerTitle>
                    <DrawerDescription> Voici les détails de la classe sélectionnée. </DrawerDescription>
                </DrawerHeader>

                <div class="pl-4 pr-10 w-full overflow-y-auto mt-8 mb-10">
                    <div class="flex flex-row justify-between mb-2">
                        <p>{{ classeId }}</p>

                        <Button variant="outline">
                            <PlusIcon class="w-4 h-4" />
                            Ajouter un lookup
                        </Button>
                    </div>
                    <!-- Liste des lookups -->
                    <LookupsList :classe-id="classeId as string" />
                </div>

                <!-- <DrawerFooter>
          <DrawerClose as-child>
            <Button variant="outline"> Fermer </Button>
          </DrawerClose>
        </DrawerFooter> -->
            </DrawerContent>
        </div>
    </Drawer>
</template>

<script setup lang="ts">
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import LookupsList from './LookupsList.vue'
import { PlusIcon } from 'lucide-vue-next'

defineProps<{
    open: boolean
    classeId: string | null
}>()

const emit = defineEmits(['update:open'])

const handleUpdateOpen = (value: boolean) => {
    emit('update:open', value)
}
</script>
