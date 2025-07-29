<script setup lang="ts">
import { useClientStore } from '@/stores/client'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-vue-next'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'vue-sonner'
import type { Adresse } from '~/types'

const props = defineProps({
    clientId: {
        type: String,
        required: true,
    },
})

const clientStore = useClientStore()
const isOpen = ref(false)
const isLoading = ref(false)

const newAdresse = ref<Omit<Adresse, 'id'>>({
    client_id: props.clientId,
    rue: '',
    ville: '',
    code_postal: '',
    pays: '',
    is_primary: false,
})

async function handleCreateAdresse() {
    isLoading.value = true
    const { error } = await clientStore.createAdresse(newAdresse.value)
    isLoading.value = false

    if (error) {
        toast.error("Erreur lors de l'ajout de l'adresse", {
            description: error.message,
        })
    } else {
        toast.success('Adresse ajoutée avec succès !')
        isOpen.value = false // Ferme la modale
        // Réinitialise le formulaire
        newAdresse.value = {
            client_id: props.clientId,
            rue: '',
            ville: '',
            code_postal: '',
            pays: '',
            is_primary: false,
        }
    }
}
</script>

<template>
    <Dialog v-model:open="isOpen">
        <DialogTrigger as-child>
            <Button variant="default" size="sm" class="w-50 float-left">
                <PlusIcon class="w-4 h-4" />
                Ajouter une Adresse
            </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Nouvelle Adresse</DialogTitle>
                <DialogDescription> Remplissez les informations ci-dessous pour ajouter une nouvelle adresse. </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="rue" class="text-right"> Rue </Label>
                    <Input id="rue" v-model="newAdresse.rue" class="col-span-3" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="ville" class="text-right"> Ville </Label>
                    <Input id="ville" v-model="newAdresse.ville" class="col-span-3" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="code_postal" class="text-right"> Code Postal </Label>
                    <Input id="code_postal" v-model="newAdresse.code_postal" class="col-span-3" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="pays" class="text-right"> Pays </Label>
                    <Input id="pays" v-model="newAdresse.pays" class="col-span-3" />
                </div>
                 <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="is_primary" class="text-right"> Adresse Primaire </Label>
                    <input id="is_primary" v-model="newAdresse.is_primary" type="checkbox" class="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <Button :disabled="isLoading" type="submit" @click="handleCreateAdresse">
                    <Icon v-if="isLoading" name="line-md:loading-twotone-loop" class="mr-2 h-4 w-4 animate-spin" />
                    Enregistrer
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
