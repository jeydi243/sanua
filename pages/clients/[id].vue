<template>
    <div class="flex flex-1 flex-col gap-4 p-4 md:gap-8">
        <div class="flex flex-row gap-3 justify-between">
            <Button variant="outline" class="flex left-0 self-left" @click="router.back()">
                <ArrowLeftIcon class="w-4 h-4 mr-2" />
                Retour
            </Button>
        </div>
        <!-- En-tête de la page -->
        <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-4">
                <template v-if="isLoading">
                    <Skeleton class="h-16 w-16 rounded-full" />
                    <div class="space-y-2">
                        <Skeleton class="h-6 w-48" />
                        <Skeleton class="h-4 w-32" />
                    </div>
                </template>
                <template v-else-if="client">
                    <Avatar class="h-16 w-16">
                        <AvatarImage :src="client.profile_picture ?? ''" :alt="`${client.prenom} ${client.nom}`" />
                        <AvatarFallback>{{ getAvatarFallback(client) }}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 class="text-2xl font-semibold">{{ client.prenom }} {{ client.nom }}</h1>
                        <p class="text-sm text-muted-foreground flex flex-row gap-2">
                            {{ client.prenom }}<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" /> 
                            Né le {{ client.date_naissance }} <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
                            Télephone: {{ client.telephone }} <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
                            Client depuis le <b>{{ formatDate(client.created_at) }}</b>
                        </p>
                    </div>
                </template>
            </div>
            <div>
                <Button variant="outline">Modifier</Button>
            </div>
        </div>

        <!-- Indicateurs Clés (KPIs) -->
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">Solde Total</CardTitle>
                    <span class="text-muted-foreground">XOF</span>
                </CardHeader>
                <CardContent>
                    <template v-if="isLoading">
                        <Skeleton class="h-8 w-full" />
                    </template>
                    <template v-else>
                        <div class="text-2xl font-bold">
                            {{ formatCurrency(comptes?.reduce((acc: number, c: any) => acc + (c.solde || 0), 0)) }}
                        </div>
                        <p class="text-xs text-muted-foreground">{{ comptes?.length }} comptes actifs</p>
                    </template>
                </CardContent>
            </Card>
            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">Encours de Crédit</CardTitle>
                    <span class="text-muted-foreground">XOF</span>
                </CardHeader>
                <CardContent>
                    <template v-if="isLoading">
                        <Skeleton class="h-8 w-full" />
                    </template>
                    <template v-else>
                        <div class="text-2xl font-bold">
                            {{ formatCurrency(prets?.reduce((acc: number, p: any) => acc + (p.montant || 0), 0)) }}
                        </div>
                        <p class="text-xs text-muted-foreground">{{ prets?.length }} prêts en cours</p>
                    </template>
                </CardContent>
            </Card>
        </div>

        <!-- Onglets -->
        <Tabs default-value="comptes" class="w-full">
            <TabsList>
                <TabsTrigger v-for="tab in tabs" :key="tab.value" :value="tab.value">
                    <Icon :name="tab.icon" class="mr-2 h-4 w-4" />
                    {{ tab.label }}
                </TabsTrigger>
            </TabsList>

            <!-- Contenu des onglets -->
            <TabsContent v-for="tab in tabs" :key="`content-${tab.value}`" :value="tab.value">
                <component :is="tab.component" :client-id="clientId" :data="tab.data" />
            </TabsContent>
        </Tabs>
    </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useClientStore } from '@/stores/client'
import { Button } from '@/components/ui/button'
import type { Client } from '~/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import {  ArrowLeftIcon } from 'lucide-vue-next'

import ClientComptesTab from '@/components/clients/tabs/ClientComptesTab.vue'
import ClientPretsTab from '@/components/clients/tabs/ClientPretsTab.vue'
import ClientDocumentsTab from '@/components/clients/tabs/ClientDocumentsTab.vue'
import ClientContactsTab from '@/components/clients/tabs/ClientContactsTab.vue'
import ClientAdressesTab from '@/components/clients/tabs/ClientAdressesTab.vue'

const route = useRoute()
const router = useRouter()
const clientStore = useClientStore()

const client = computed(() => clientStore.activeClient?.details)
const comptes = computed(() => clientStore.activeComptes)
const prets = computed(() => clientStore.activePrets)
const adresses = computed(() => clientStore.activeAdresses)
const contacts = computed(() => clientStore.activeContacts)
const isLoading = ref(true)

const tabs = [
    // { value: 'details', label: 'Détails', icon: 'lucide:user', component: ClientDetailsTab, data: client },
    { value: 'comptes', label: 'Comptes', icon: 'lucide:wallet', component: ClientComptesTab, data: comptes },
    { value: 'prets', label: 'Prêts', icon: 'lucide:landmark', component: ClientPretsTab, data: prets },
    { value: 'documents', label: 'Documents', icon: 'lucide:file-text', component: ClientDocumentsTab },
    { value: 'contacts', label: 'Contacts', icon: 'lucide:users', component: ClientContactsTab, data: contacts },
    { value: 'adresses', label: 'Adresses', icon: 'lucide:home', component: ClientAdressesTab, data: adresses },
]

useHead({
    title: 'Sanua - Détails Client',
})
definePageMeta({
    validate: async (route) => {
        // Return false if ID is not present
        return !!route.params.id
    },
})

const clientId: string = route.params.id as string

onMounted(async () => {
    // if (!clientId) return
    isLoading.value = true

    clientStore.setActiveClient(clientId)
    // Utilisation de Promise.all pour charger les données en parallèle
    // const [clientRes, comptesRes, pretsRes, adressesRes] = await Promise.all([clientStore.fetchClientById(clientId), clientStore.fetchComptesForClient(clientId), pretStore.fetchPretsForClient(clientId), clientStore.fetchAdressesForClient(clientId)])

    isLoading.value = false
})

// Fonction pour formater les dates
const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('fr-FR')
}

// Fonction pour formater les montants monétaires
const formatCurrency = (amount?: number) => {
    if (amount === undefined) return 'N/A'
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'CDF',
    }).format(amount)
}

const getAvatarFallback = (client: Client | null) => {
    if (!client) return ''
    return `${client.prenom?.[0] ?? ''}${client.nom?.[0] ?? ''}`.toUpperCase()
}
</script>
