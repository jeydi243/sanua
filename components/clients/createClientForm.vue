<script setup lang="ts">
import { h } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useClientStore } from '@/stores/client'
import { Button } from '@/components/ui/button'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toast } from 'vue-sonner'
import { PlusIcon } from 'lucide-vue-next'

const clientStore = useClientStore()
const isOpen = ref(false)
const isLoading = ref(false)

const formSchema = toTypedSchema(z.object({
    prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères.'),
    nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.'),
    date_naissance: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Date de naissance invalide.' }),
    telephone: z.string().min(9, 'Le numéro de téléphone est trop court.'),
}))

const { handleSubmit, resetForm } = useForm({
    validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
    isLoading.value = true
    const { error } = await clientStore.createClient(values)
    isLoading.value = false

    if (error) {
        toast.error('Erreur lors de la création', {
            description: error.message,
        })
    } else {
        toast.success('Client créé avec succès')
        isOpen.value = false // Ferme la modale
        resetForm()
    }
})
</script>

<template>
    <Dialog v-model:open="isOpen">
        <DialogTrigger as-child>
            <Button variant="default">
                <PlusIcon class="w-4 h-4 mr-2" />
                Ajouter un Client
            </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Nouveau Client</DialogTitle>
                <DialogDescription> Remplissez les informations ci-dessous pour créer un nouveau client. </DialogDescription>
            </DialogHeader>
            <form class="space-y-4" @submit="onSubmit">
                <FormField v-slot="{ componentField }" name="prenom">
                    <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="John" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="nom">
                    <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="Doe" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="date_naissance">
                    <FormItem>
                        <FormLabel>Date de naissance</FormLabel>
                        <FormControl>
                            <Input type="date" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="telephone">
                    <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                            <Input type="tel" placeholder="+221 77 123 45 67" v-bind="componentField" />
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