<script setup lang="ts">
import { h } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { usePretStore } from '@/stores/pret'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-vue-next'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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

const formSchema = toTypedSchema(z.object({
    montant_principal: z.number().positive("Le montant doit être positif"),
    duree_mois: z.number().int().positive("La durée doit être un entier positif"),
    taux_interet: z.number().min(0, "Le taux ne peut pas être négatif"),
    date_octroi: z.string().nonempty("La date d'octroi est requise"),
    type_pret: z.string().nonempty("Le type de prêt est requis"),
    periode_interet: z.string().nonempty("La période d'intérêt est requise"),
    statut_pret: z.string().nonempty("Le statut est requis"),
    conditions_speciales: z.string().optional(),
    date_premiere_echeance: z.string().optional().nullable(),
}))

const { handleSubmit, resetForm } = useForm({
    validationSchema: formSchema,
    initialValues: {
        montant_principal: 0,
        duree_mois: 12,
        taux_interet: 5,
        date_octroi: new Date().toISOString().split('T')[0],
        type_pret: 'Amortissable',
        periode_interet: 'Mensuel',
        statut_pret: 'Brouillon',
        conditions_speciales: '',
        date_premiere_echeance: null,
    },
})

const onSubmit = handleSubmit(async (values) => {
    isLoading.value = true

    const newPretData: Omit<Pret, 'pret_id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'solde_du_principal' | 'solde_du_interets' | 'solde_du_penalites' | 'montant_total_a_rembourser' | 'date_dernier_remboursement' | 'agent_id'> & { agent_id: string | null } = {
        ...values,
        client_id: props.clientId,
        agent_id: null, // Mettez à jour avec l'ID de l'agent connecté si disponible
    };

    const { error } = await pretStore.createPret(newPretData)
    isLoading.value = false

    if (error) {
        toast.error('Erreur lors de la création du prêt', {
            description: error.message,
        })
    } else {
        toast.success('Prêt créé avec succès !')
        isOpen.value = false
        resetForm()
    }
})
</script>

<template>
    <Dialog v-model:open="isOpen">
        <DialogTrigger as-child>
            <Button variant="default" size="sm" class="w-50 float-left">
                <PlusIcon class="w-4 h-4" />
                Ajouter un Prêt
            </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>Nouveau Prêt</DialogTitle>
                <DialogDescription> Remplissez les informations ci-dessous pour créer un nouveau prêt. </DialogDescription>
            </DialogHeader>
            <form class="grid gap-4 py-4" @submit="onSubmit">
                <div class="grid grid-cols-2 gap-4">
                    <FormField v-slot="{ componentField }" name="montant_principal">
                        <FormItem>
                            <FormLabel>Montant Principal</FormLabel>
                            <FormControl>
                                <Input type="number" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="duree_mois">
                        <FormItem>
                            <FormLabel>Durée (mois)</FormLabel>
                            <FormControl>
                                <Input type="number" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </div>
                <div class="grid grid-cols-2 gap-4">
                     <FormField v-slot="{ componentField }" name="taux_interet">
                        <FormItem>
                            <FormLabel>Taux d'intérêt (%)</FormLabel>
                            <FormControl>
                                <Input type="number" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="type_pret">
                        <FormItem>
                            <FormLabel>Type de prêt</FormLabel>
                            <FormControl>
                                <Input type="text" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <FormField v-slot="{ componentField }" name="date_octroi">
                        <FormItem>
                            <FormLabel>Date d'octroi</FormLabel>
                            <FormControl>
                                <Input type="date" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="date_premiere_echeance">
                        <FormItem>
                            <FormLabel>Date de première échéance</FormLabel>
                            <FormControl>
                                <Input type="date" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <FormField v-slot="{ componentField }" name="periode_interet">
                        <FormItem>
                            <FormLabel>Période d'intérêt</FormLabel>
                            <FormControl>
                                <Input type="text" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="statut_pret">
                        <FormItem>
                            <FormLabel>Statut du prêt</FormLabel>
                            <FormControl>
                                <Input type="text" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </div>
                <FormField v-slot="{ componentField }" name="conditions_speciales">
                    <FormItem>
                        <FormLabel>Conditions spéciales</FormLabel>
                        <FormControl>
                            <Textarea v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <DialogFooter>
                    <Button :disabled="isLoading" type="submit">
                        <Icon v-if="isLoading" name="line-md:loading-twotone-loop" class="mr-2 h-4 w-4 animate-spin" />
                        Enregistrer
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>
