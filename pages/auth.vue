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
                    </CardHeader>
                    <CardContent>
                        <form @submit="login">
                            <div class="flex flex-col gap-6">
                                <div class="grid gap-3">
                                    <Label for="email">Email</Label>
                                    <Input id="email" type="email" placeholder="m@example.com" required />
                                </div>
                                <div class="grid gap-3">
                                    <div class="flex items-center">
                                        <Label for="password">Password</Label>
                                        <a href="#"
                                            class="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                                            Forgot your password?
                                        </a>
                                    </div>
                                    <Input id="password" type="password" required />
                                </div>
                                <FormField v-slot="{ componentField }" name="username">
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="shadcn" v-bind="componentField" />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public display name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                </FormField>
                                <div class="flex flex-col gap-3">
                                    <Button type="submit" class="w-full">
                                        Login
                                    </Button>
                                    <Button variant="outline" class="w-full">
                                        Login with Google
                                    </Button>
                                </div>
                            </div>
                            <div class="mt-4 text-center text-sm">
                                Don't have an account?
                                <a href="#" class="underline underline-offset-4">
                                    Sign up
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'


const { signIn } = useAuth();
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
}))

const form = useForm({
    validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
    console.log('Form submitted!', values)
})
definePageMeta({
    layout: 'auth',
})
</script>

<style scoped></style>