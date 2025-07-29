<script setup lang="ts">
import { usePretStore } from '@/stores/pret'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-vue-next'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'vue-sonner'
import type { Pret } from '~/types'

const props = defineProps({
    clientId: {
        type: String,
        required: true,
    },
})

const pretStore = usePretStore()
const isOpen = ref(false)
const isLoading = ref(false)

const newPret = ref<Omit<Pret, 'id'>>({
    client_id: props.clientId,
    montant_principal: 0,
    duree_mois: 0,
    taux_interet: 0,
    date_octroi: new Date().toISOString().split('T')[0],
    statut_pret: 'Brouillon',
    type_pret: '',
    agent_id: '', // You might want to get this from the logged-in user
    periode_interet: 'Mensuel',
    solde_du_principal: 0,
    solde_du_interets: 0,
    solde_du_penalites: 0,
})

async function handleCreatePret() {
    isLoading.value = true
    newPret.value.solde_du_principal = newPret.value.montant_principal
    const { error } = await pretStore.createPret(newPret.value)
    isLoading.value = false

    if (error) {
        toast.error('Erreur lors de la création du prêt', {
            description: error.message,
        })
    } else {
        toast.success('Prêt créé avec succès !')
        isOpen.value = false // Ferme la modale
        // Réinitialise le formulaire
        newPret.value = {
            client_id: props.clientId,
            montant_principal: 0,
            duree_mois: 0,
            taux_interet: 0,
            date_octroi: new Date().toISOString().split('T')[0],
            statut_pret: 'Brouillon',
            type_pret: '',
            agent_id: '',
            periode_interet: 'Mensuel',
            solde_du_principal: 0,
            solde_du_interets: 0,
            solde_du_penalites: 0,
        }
    }
}
</script>

<template>
    <Dialog v-model:open="isOpen">
        <DialogTrigger as-child>
            <Button variant="default" size="sm" class="w-50 float-left">
                <PlusIcon class="w-4 h-4" />
                Ajouter un Prêt
            </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Nouveau Prêt</DialogTitle>
                <DialogDescription> Remplissez les informations ci-dessous pour créer un nouveau prêt. </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="montant_principal" class="text-right"> Montant Principal </Label>
                    <Input id="montant_principal" v-model.number="newPret.montant_principal" type="number" class="col-span-3" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="duree_mois" class="text-right"> Durée (mois) </Label>
                    <Input id="duree_mois" v-model.number="newPret.duree_mois" type="number" class="col-span-3" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="taux_interet" class="text-right"> Taux d'intérêt (%) </Label>
                    <Input id="taux_interet" v-model.number="newPret.taux_interet" type="number" class="col-span-3" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="date_octroi" class="text-right"> Date d'octroi </Label>
                    <Input id="date_octroi" v-model="newPret.date_octroi" type="date" class="col-span-3" />
                </div>
                 <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="type_pret" class="text-right"> Type de prêt </Label>
                    <Input id="type_pret" v-model="newPret.type_pret" class="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <Button :disabled="isLoading" type="submit" @click="handleCreatePret">
                    <Icon v-if="isLoading" name="line-md:loading-twotone-loop" class="mr-2 h-4 w-4 animate-spin" />
                    Enregistrer
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>