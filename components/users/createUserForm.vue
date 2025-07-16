<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { PlusIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
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

const formSchema = toTypedSchema(z.object({
    username: z.string().min(2).max(50),
}))

function onSubmit(values: any) {
    toast({
        title: 'You submitted the following values:' + values,
        description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
    })
}
</script>

<template>
    <Form v-slot="{ handleSubmit }" as="" keep-values :validation-schema="formSchema">
        <Dialog>
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
                    <FormField v-slot="{ componentField }" name="username">
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="shadcn" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="password">
                        <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="shadcn" v-bind="componentField" />
                            </FormControl>
                            <FormDescription>
                                Le mot de passe doit etre fort au moins 8 caracteres
                            </FormDescription>
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