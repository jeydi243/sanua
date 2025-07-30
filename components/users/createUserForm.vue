<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { PlusIcon, AlertCircle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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
    username: z.string().min(2).max(50),
    email: z.string().email('Inserer un email valide').max(50),
    password: z.string().min(8).max(50),
    user_type: z.string().max(50),
}))

async function onSubmit(values: any) {
    apiResponse.value = null
    const body = {
        email: values.email,
        username: values.username,
        user_metadata: {
            user_type: values.user_type
        },
    }
    try {
        const data = await $fetch('/api/admin/users/create', { method: 'POST', body: values })
        // console.log(data.value, status.value, error.value);
        if (data) {
            toast('User has been created with ' + data, {
                description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(data, null, 2))),
            })

            openForm.value = !openForm.value
        } else {

        }

    } catch (error) {
        console.error(error?.data.message)
        apiResponse.value = error?.data.message
        // toast('Error ', {
        //     description: h('pre', { class: 'mt-2 w-[440px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-red' }, JSON.stringify(data, null, 2))),
        // })
    }
}
</script>

<template>
    <Form v-slot="{ handleSubmit }" as="" keep-values :validation-schema="formSchema">
        <Dialog v-model="openForm">
            <DialogTrigger as-child>
                <Button>
                    <PlusIcon class="w-4 h-4" />
                    Créer un utilisateur
                </Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Créer un utilisateur</DialogTitle>
                    <DialogDescription>
                        Créer un utilsateur public ou un agent
                    </DialogDescription>
                </DialogHeader>
                <Alert v-if="apiResponse" variant="destructive" class="border border-red-500">
                    <AlertCircle class="w-4 h-4" />
                    <AlertDescription>
                        {{ apiResponse }}
                    </AlertDescription>
                </Alert>
                <form id="dialogForm" @submit="handleSubmit($event, onSubmit)">
                    <FormField v-slot="{ componentField }" name="email" class="mb-10">
                        <FormItem class="mb-5">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="username" class="mb-10">
                        <FormItem class="mb-5">
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="password">
                        <FormItem class="mb-5">
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="*********" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="user_type">
                        <FormItem>
                            <FormLabel>Type d'utilisateur</FormLabel>
                            <FormControl>
                                <RadioGroup default-value="interne" v-bind="componentField">
                                    <div class="flex items-center space-x-2">
                                        <RadioGroupItem id="r1" value="interne" />
                                        <Label for="r1">Interne</Label>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <RadioGroupItem id="r2" value="public" />
                                        <Label for="r2">Public</Label>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </form>

                <DialogFooter>
                    <Button type="submit" form="dialogForm" @click="openForm = !openForm">
                        Créer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </Form>
</template>