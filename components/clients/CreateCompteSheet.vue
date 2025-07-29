<script setup lang="ts">
import { useClientStore } from '@/stores/client'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-vue-next'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'vue-sonner'

const clientStore = useClientStore()
const isOpen = ref(false)
const isLoading = ref(false)

const newCompte = ref({
    nom: '',
    prenom: '',
    date_naissance: '',
    contact: '',
})

async function handleCreateCompte() {
    isLoading.value = true
    const { error } = await clientStore.createCompte(newCompte.value)
    isLoading.value = false

    if (error) {
        toast.error('Erreur lors de la création', {
            description: error.message,
        })
    } else {
        toast.success('Compte créé avec succès !')
        isOpen.value = false // Ferme la modale
        // Réinitialise le formulaire
        newCompte.value = { nom: '', prenom: '', date_naissance: '', contact: '' }
    }
}
</script>

<template>
    <Dialog v-model:open="isOpen">
        <DialogTrigger as-child>
            <Button variant="default" size="sm" class="w-50 float-left">
                <PlusIcon class="w-4 h-4" />
                Ajouter un Compte
            </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Nouveau Compte</DialogTitle>
                <DialogDescription> Remplissez les informations ci-dessous pour créer un nouveau compte. </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="prenom" class="text-right"> Prénom </Label>
                    <Input id="prenom" v-model="newCompte.prenom" class="col-span-3" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="nom" class="text-right"> Nom </Label>
                    <Input id="nom" v-model="newCompte.nom" class="col-span-3" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="date_naissance" class="text-right"> Date de naissance </Label>
                    <Input id="date_naissance" v-model="newCompte.date_naissance" type="date" class="col-span-3" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="contact" class="text-right"> Contact </Label>
                    <Input id="contact" v-model="newCompte.contact" class="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <Button :disabled="isLoading" type="submit" @click="handleCreateCompte">
                    <Icon v-if="isLoading" name="line-md:loading-twotone-loop" class="mr-2 h-4 w-4 animate-spin" />
                    Enregistrer
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
