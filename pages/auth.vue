<template>
    <div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div class="w-full max-w-sm">
            <div :class="cn('flex flex-col gap-6', props.class)">
                <Card>
                    <CardHeader>
                        <CardTitle>Login to your account</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                        <Alert variant="destructive" class="border border-red-500" v-if="login_result">
                            <AlertCircle class="w-4 h-4" />
                            <AlertDescription>
                                {{ login_result }}
                            </AlertDescription>
                        </Alert>
                    </CardHeader>
                    <CardContent>
                        <form @submit="onSubmit">
                            <div class="flex flex-col gap-6">
                                <FormField v-slot="{ componentField }" name="username">
                                    <FormItem>
                                        <FormLabel>Utilisateur</FormLabel>
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
                                            <Input type="text" placeholder="shadcn" v-bind="componentField" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                </FormField>
                                <div class="flex flex-col gap-3">
                                    <Button type="submit" class="w-full">
                                        <Icon name="line-md:loading-twotone-loop" style="color: white"
                                            v-if="isLoading" />
                                        Connexion
                                    </Button>
                                    <Button variant="outline" class="w-full">
                                        Connexion avec Google
                                    </Button>
                                </div>
                            </div>
                            <div class="mt-4 text-center text-sm">
                                Pas de compte ?
                                <a href="#" class="underline underline-offset-4">
                                    S'enregistrer
                                </a>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// import LoginForm from '@/components/LoginForm.vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { AlertCircle } from 'lucide-vue-next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'


useHead({ title: 'Authentification - Sanua' })


const { signIn } = useUserStore();
let login_result = ref(null);

const props = defineProps<{
    class?: HTMLAttributes['class']
}>()
async function login(values: any) {
    const { email, password } = values;
    await signIn(email, password);
    console.log(email, password);
}
const formSchema = toTypedSchema(z.object({
    username: z.string().min(2).max(50),
    password: z.string().min(2).max(50),
}))
var isLoading = ref(false)
const form = useForm({
    validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
    isLoading.value = true
    const { error, user } = await signIn(values.username, values.password);
    console.log('Form submitted!', values)
    if (error) {
        isLoading.value = false
        console.error('Erreur de connexion:', error.message);
        login_result.value = error.message;
        console.log(login_result);
    }
    if (user) {
        isLoading.value = false
        console.log('Connexion réussie:', user);
        navigateTo('/');
    }
})
definePageMeta({
    layout: 'auth',
    title: 'Auth'
})
</script>

<style scoped></style>