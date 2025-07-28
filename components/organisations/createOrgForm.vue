<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { PlusIcon, AlertCircle, Check, ChevronsUpDown } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'vue-sonner'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const openForm = ref(false)
const popoverOpen = ref(false)
const apiResponse = ref<string | null>(null)
const userTypeOptions = ref<Array<{ lookup_id: string; description: string }>>([])
const userTypeLoading = ref(false)

async function fetchTypeOrganisation() {
    userTypeLoading.value = true
    const supabase = useSupabaseClient()
    const { data, error } = await supabase.from('lookup').select('lookup_id, description')

    if (error) {
        // toast.error('Erreur lors de la récupération des types d''organisation', { description: error.message })
        userTypeOptions.value = []
    } else if (data) {
        userTypeOptions.value = data
    }
    userTypeLoading.value = false
}

onMounted(async () => {
    await fetchTypeOrganisation()
})

const formSchema = toTypedSchema(
    z.object({
        code: z.string().min(2, 'Le code doit avoir au moins 2 caractères').max(50),
        nom: z.string().min(2, 'Le nom doit avoir au moins 2 caractères').max(50),
        adresse: z.string().min(5).max(100),
        lookup_id: z.string({ required_error: 'Veuillez sélectionner un type.' }),
    }),
)

async function onSubmit(values: any) {
    apiResponse.value = null

    try {
        const supabase = useSupabaseClient()

        const { data, error } = await supabase
            .from('organisation')
            .insert([{ ...values }])
            .select()
            .single()
        openForm.value = false
        if (error) {
            apiResponse.value = error.message
            toast.error('Erreur lors de la création', {
                description: h('pre', { class: 'mt-2 w-[440px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-red-500' }, JSON.stringify(error, null, 2))),
            })
        } else if (data) {
            toast.success('Organisation créée avec succès', {
                description: `L'organisation "${data?.nom}" a été ajoutée.`,
            })
            openForm.value = false
        }
    } catch (error: any) {
        apiResponse.value = error.message
        toast.error('Une erreur inattendue est survenue.')
    }
}
</script>

<template>
    <Form v-slot="{ handleSubmit }" as="div" :validation-schema="formSchema">
        <Dialog v-model:open="openForm">
            <DialogTrigger as-child>
                <Button>
                    <PlusIcon class="w-4 h-4" />
                    Ajouter
                </Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Créer une organisation</DialogTitle>
                    <DialogDescription> Remplissez les informations pour créer une nouvelle organisation. </DialogDescription>
                </DialogHeader>
                <Alert v-if="apiResponse" variant="destructive" class="border border-red-500">
                    <AlertCircle class="w-4 h-4" />
                    <AlertDescription>
                        {{ apiResponse }}
                    </AlertDescription>
                </Alert>
                <form id="dialogForm" class="space-y-4" @submit="handleSubmit($event, onSubmit)">
                    <FormField v-slot="{ componentField }" name="code">
                        <FormItem>
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="ORG-001" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="nom">
                        <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Nom de l'organisation" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="adresse">
                        <FormItem>
                            <FormLabel>Adresse</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Adresse complete" class="border rounded-md placeholder:pl-2.5" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ field }" name="lookup_id">
                        <FormItem class="flex flex-col">
                            <FormLabel>Type d'organisation</FormLabel>
                            <Popover v-model:open="popoverOpen">
                                <PopoverTrigger as-child>
                                    <FormControl>
                                        <Button variant="outline" role="combobox" :class="cn('w-full justify-between', !field.value && 'text-muted-foreground')">
                                            {{ field.value ? userTypeOptions.find((option) => option.lookup_id === field.value)?.description : 'Sélectionner un type...' }}
                                            <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent class="w-[380px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Rechercher un type..." />
                                        <CommandEmpty>
                                            <span v-if="userTypeLoading">Chargement...</span>
                                            <span v-else>Aucun type trouvé.</span>
                                        </CommandEmpty>
                                        <CommandList>
                                            <CommandGroup>
                                                <CommandItem
                                                    v-for="option in userTypeOptions"
                                                    :key="option.lookup_id"
                                                    :value="option.lookup_id"
                                                    @select="
                                                        () => {
                                                            field.onChange(option.lookup_id)
                                                            popoverOpen = false
                                                        }
                                                    "
                                                >
                                                    {{ option.description }}
                                                    <Check :class="cn('ml-auto h-4 w-4', option.lookup_id === field.value ? 'opacity-100' : 'opacity-0')" />
                                                </CommandItem>
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </form>

                <DialogFooter>
                    <Button type="submit" form="dialogForm"> <PlusIcon class="w-4 h-4 mr-2" />Créer </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </Form>
</template>
