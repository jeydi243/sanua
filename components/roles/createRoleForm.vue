<script setup lang="ts">
import { h } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { PlusIcon, AlertCircle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'vue-sonner'
const openForm = ref(false)
const apiResponse = ref(null)
const formSchema = toTypedSchema(z.object({
    name: z.string().min(2).max(50),
    description: z.string().min(2).max(50),
    code: z.string().min(2).max(50),
}))

async function onSubmit(values: any) {
    apiResponse.value = null
    try {
        const supabase = useSupabaseClient();

        const { data, error } = await supabase
            .from('roles')
            .insert([
                { ...values }
            ])
            .select()

        if (data) {
            toast('Role has been created with ' + data, {
                description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(data, null, 2))),
            })

            openForm.value = !openForm.value
        } else {
            toast('Error ', {
                description: h('pre', { class: 'mt-2 w-[440px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-red' }, JSON.stringify(error, null, 2))),
            })
        }

    } catch (error) {
        console.error(error?.data.message)
        apiResponse.value = error?.data.message
    }
}
</script>

<template>
    <Form v-slot="{ handleSubmit }" as="" keep-values :validation-schema="formSchema">
        <Dialog v-model:open="openForm">
            <DialogTrigger as-child>
                <Button>
                    <PlusIcon class="w-4 h-4" />
                    Créer un role
                </Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Créer un role</DialogTitle>
                    <DialogDescription>
                        Créer un role
                    </DialogDescription>
                </DialogHeader>
                <Alert v-if="apiResponse" variant="destructive" class="border border-red-500">
                    <AlertCircle class="w-4 h-4" />
                    <AlertDescription>
                        {{ apiResponse }}
                    </AlertDescription>
                </Alert>
                <form id="dialogForm" @submit="handleSubmit($event, onSubmit)">
                    <FormField v-slot="{ componentField }" name="name" class="mb-10">
                        <FormItem class="mb-5">
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="code" class="mb-10">
                        <FormItem class="mb-5">
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="description">
                        <FormItem class="mb-5">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </form>

                <DialogFooter>
                    <Button type="submit" form="dialogForm">
                        Créer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </Form>
</template>
