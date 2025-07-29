<script setup lang="ts">
import { usePretStore } from '@/stores/pret'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-vue-next'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'vue-sonner'
import type { Garant } from '~/types'

const props = defineProps({
    pretId: {
        type: String,
        required: true,
    },
})

const pretStore = usePretStore()
const isOpen = ref(false)
const isLoading = ref(false)

const newGarant = ref<Omit<Garant, 'id'>>({
    pret_id: props.pretId,
    nom: '',
    relation: '',
    contact: '',
})

async function handleCreateGarant() {
    isLoading.value = true
    const { error } = await pretStore.createGarant(newGarant.value)
    isLoading.value = false

    if (error) {
        toast.error('Erreur lors de la création du garant', {
            description: error.message,
        })
    } else {
        toast.success('Garant créé avec succès !')
        isOpen.value = false // Ferme la modale
        // Réinitialise le formulaire
        newGarant.value = {
            pret_id: props.pretId,
            nom: '',
            relation: '',
            contact: '',
        }
    }
}
</script>

<template>
    <Dialog v-model:open="isOpen">
        <DialogTrigger as-child>
            <Button variant="default" size="sm" class="w-50 float-left">
                <PlusIcon class="w-4 h-4" />
                Ajouter un Garant
            </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Nouveau Garant</DialogTitle>
                <DialogDescription> Remplissez les informations ci-dessous pour créer un nouveau garant. </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="nom" class="text-right"> Nom </Label>
                    <Input id="nom" v-model="newGarant.nom" class="col-span-3" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="relation" class="text-right"> Relation </Label>
                    <Input id="relation" v-model="newGarant.relation" class="col-span-3" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="contact" class="text-right"> Contact </Label>
                    <Input id="contact" v.model="newGarant.contact" class="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <Button :disabled="isLoading" type="submit" @click="handleCreateGarant">
                    <Icon v-if="isLoading" name="line-md:loading-twotone-loop" class="mr-2 h-4 w-4 animate-spin" />
                    Enregistrer
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
