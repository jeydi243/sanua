<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { PlusIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'vue-sonner'
const openForm = ref(false)
const formSchema = toTypedSchema(z.object({
    username: z.string().min(2).max(50),
    password: z.string().min(8).max(50),
    user_type: z.string().max(50),
}))

function onSubmit(values: any) {
    toast('User has been created with ' + values, {
        action: {
            label: 'Undo',
            onClick: () => console.log('Undo'),
        },
        description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
    })
    openForm.value = !openForm.value
}
</script>

<template>
    <Form v-slot="{ handleSubmit }" as="" keep-values :validation-schema="formSchema">
        <Dialog v-model="openForm">
            <DialogTrigger as-child>
                <Button>
                    <PlusIcon class="w-4 h-4 mr-2" />
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

                <form id="dialogForm" @submit="handleSubmit($event, onSubmit)">
                    <FormField v-slot="{ componentField }" name="username" class="mb-10">
                        <FormItem class="mb-5">
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="" v-bind="componentField" />
                            </FormControl>
                            <FormMessage  />
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
                    <Button type="submit" form="dialogForm">
                        Créer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </Form>
</template>