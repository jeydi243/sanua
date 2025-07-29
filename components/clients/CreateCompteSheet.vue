<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useClientStore } from '@/stores/client'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toast } from 'vue-sonner'
import { PlusIcon } from 'lucide-vue-next'

const props = defineProps<{
    clientId: string
}>()

const clientStore = useClientStore()
const isOpen = ref(false)
const isLoading = ref(false)

const formSchema = toTypedSchema(z.object({
    type_compte: z.string().min(2, 'Le type de compte est requis.'),
    solde: z.number().min(0, 'Le solde initial ne peut pas être négatif.'),
    numero_compte: z.string().min(5, 'Le numéro de compte est trop court.'),
}))

const { handleSubmit, resetForm } = useForm({
    validationSchema: formSchema,
    initialValues: {
        solde: 0,
    },
})

const onSubmit = handleSubmit(async (values) => {
    isLoading.value = true
    const compteData = {
        ...values,
        client_id: props.clientId,
    }
    const { error } = await clientStore.createCompte(compteData)
    isLoading.value = false

    if (error) {
        toast.error('Erreur lors de la création du compte', {
            description: error.message,
        })
    } else {
        toast.success('Compte créé avec succès !')
        isOpen.value = false // Ferme la modale
        resetForm()
    }
})
</script>

<template>
    <Dialog v-model:open="isOpen">
        <DialogTrigger as-child>
            <Button variant="default" size="sm">
                <PlusIcon class="w-4 h-4 mr-2" />
                Ajouter un Compte
            </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Nouveau Compte</DialogTitle>
                <DialogDescription> Remplissez les informations ci-dessous pour créer un nouveau compte. </DialogDescription>
            </DialogHeader>
            <form class="space-y-4" @submit="onSubmit">
                <FormField v-slot="{ componentField }" name="numero_compte">
                    <FormItem>
                        <FormLabel>Numéro de Compte</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="N° de compte" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="type_compte">
                    <FormItem>
                        <FormLabel>Type de Compte</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="Ex: Épargne, Courant" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="solde">
                    <FormItem>
                        <FormLabel>Solde Initial</FormLabel>
                        <FormControl>
                            <Input type="number" v-bind="componentField" />
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