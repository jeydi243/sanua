<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { usePretStore } from '~/stores/pret'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

const props = defineProps<{
  clientId: string
}>()

const pretStore = usePretStore()
const isOpen = defineModel<boolean>('open', { default: false })

// Définir le schéma de validation avec Zod
const formSchema = toTypedSchema(
  z.object({
    montant_principal: z.number().positive('Le montant doit être positif.'),
    taux_interet: z.number().min(0, 'Le taux ne peut pas être négatif.'),
    duree_mois: z.number().int().positive('La durée doit être un nombre entier positif.'),
    date_octroi: z.date({
      required_error: 'La date d\'octroi est requise.',
    }),
    type_pret: z.string().nonempty('Le type de prêt est requis.'),
    agent_id: z.string().uuid('L\'ID de l\'agent est invalide.').nonempty('L\'agent est requis.'),
    periode_interet: z.string().nonempty('La période d\'intérêt est requise.'),
    // Ajoutez d'autres champs si nécessaire
  }),
)

const { handleSubmit, isSubmitting, setFieldValue } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  const pretData: any = {
    ...values,
    date_octroi: values.date_octroi.toISOString(), // Convertir la date en string ISO
    client_id: props.clientId,
    statut_pret: 'Actif', // Statut par défaut
    solde_du_principal: values.montant_principal, // Le solde initial est le montant total
    solde_du_interets: 0,
    solde_du_penalites: 0,
  }

  const { error } = await pretStore.createPret(pretData)

  if (error) {
    toast.error('Erreur lors de la création du prêt', {
      description: error.message,
    })
  } else {
    toast.success('Prêt créé avec succès!')
    isOpen.value = false
  }
})
</script>

<template>
  <Sheet v-model:open="isOpen">
    <SheetContent class="w-[70vw] sm:max-w-none">
      <SheetHeader>
        <SheetTitle>Nouveau Prêt</SheetTitle>
        <SheetDescription>
          Remplissez les informations ci-dessous pour créer un nouveau prêt pour ce client.
        </SheetDescription>
      </SheetHeader>
      <div class="py-4 p-8">
        <form class="space-y-4" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="montant_principal">
            <FormItem>
              <FormLabel>Montant Principal</FormLabel>
              <FormControl>
                <Input type="number" placeholder="5000" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="taux_interet">
            <FormItem>
              <FormLabel>Taux d'intérêt annuel (%)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="5" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="duree_mois">
            <FormItem>
              <FormLabel>Durée (en mois)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="12" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ value, errorMessage }" name="date_octroi">
            <FormItem class="flex flex-col">
              <FormLabel>Date d'octroi</FormLabel>
              <Popover>
                <PopoverTrigger as-child>
                  <FormControl>
                    <Button variant="outline" :class="cn(
                      'w-[240px] ps-3 text-start font-normal',
                      !value && 'text-muted-foreground',
                    )">
                      <span>{{ value ? format(value, "PPP") : "Choisissez une date" }}</span>
                      <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <Calendar :model-value="value" @update:model-value="(val) => setFieldValue('date_octroi', val)"
                    :initial-focus="true" />
                </PopoverContent>
              </Popover>
              <FormMessage :message="errorMessage" />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="type_pret">
            <FormItem>
              <FormLabel>Type de prêt</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Prêt personnel" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="agent_id">
            <FormItem>
              <FormLabel>Agent ID</FormLabel>
              <FormControl>
                <Input type="text" placeholder="ID de l'agent" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="periode_interet">
            <FormItem>
              <FormLabel>Période d'intérêt</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Mensuel" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <SheetFooter class="flex flex-row justify-end">
            <Button type="reset" :disabled="isSubmitting" class="w-1/2" variant="outline">
              <Icon name="line-md:refres" v-if="isSubmitting" class="mr-2" />
              Reset
            </Button>
            <Button type="submit" :disabled="isSubmitting" class="w-1/2">
              <Icon name="line-md:loading-twotone-loop" v-if="isSubmitting" class="mr-2" />
              Créer le Prêt
            </Button>
          </SheetFooter>
        </form>
      </div>
    </SheetContent>
  </Sheet>
</template>
