<template>
  <div class="flex flex-1 flex-col gap-4 p-4 md:gap-8">
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
            <AvatarImage :src="client.avatar_url" :alt="`${client.prenom} ${client.nom}`" />
            <AvatarFallback>{{ getAvatarFallback(client) }}</AvatarFallback>
          </Avatar>
          <div>
            <h1 class="text-2xl font-semibold">
              {{ client.prenom }} {{ client.nom }}
            </h1>
            <p class="text-sm text-muted-foreground">
              Client depuis le {{ formatDate(client.created_at) }}
            </p>
          </div>
        </template>
      </div>
      <div class="flex gap-2">
        <Button variant="outline">Modifier</Button>
        <Button @click="isPretSheetOpen = true">
          <PlusIcon class="w-4 h-4 mr-2" />
          Nouvelle Opération
        </Button>
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
              {{
                formatCurrency(
                  comptes.reduce((acc: number, c: any) => acc + (c.solde || 0), 0)
                )
              }}
            </div>
            <p class="text-xs text-muted-foreground">
              {{ comptes.length }} comptes actifs
            </p>
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
              {{
                formatCurrency(
                  prets.reduce((acc: number, p: any) => acc + (p.montant || 0), 0)
                )
              }}
            </div>
            <p class="text-xs text-muted-foreground">
              {{ prets.length }} prêts en cours
            </p>
          </template>
        </CardContent>
      </Card>
    </div>

    <!-- Onglets -->
    <Tabs default-value="comptes" class="w-full">
      <TabsList>
        <TabsTrigger value="comptes">Comptes</TabsTrigger>
        <TabsTrigger value="prets">Prêts</TabsTrigger>
        <TabsTrigger value="activite">Activité Récente</TabsTrigger>
        <TabsTrigger value="details">Informations Détaillées</TabsTrigger>
      </TabsList>

      <!-- Onglet Comptes -->
      <TabsContent value="comptes">
        <Card>
          <CardHeader>
            <CardTitle>Comptes du Client</CardTitle>
            <CardDescription>Liste des comptes d'épargne et courants.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Compte</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead class="text-right">Solde</TableHead>
                  <TableHead class="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <template v-if="isLoading">
                  <TableRow v-for="i in 3" :key="i">
                    <TableCell>
                      <Skeleton class="h-5 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton class="h-5 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton class="h-5 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton class="h-5 w-full" />
                    </TableCell>
                  </TableRow>
                </template>
                <template v-else-if="comptes.length > 0">
                  <TableRow v-for="compte in comptes" :key="compte.id">
                    <TableCell class="font-medium">{{
                      compte.numero_compte
                      }}</TableCell>
                    <TableCell>{{ compte.type_compte }}</TableCell>
                    <TableCell class="text-right">{{
                      formatCurrency(compte.solde)
                      }}</TableCell>
                    <TableCell class="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                          <Button variant="ghost" class="h-8 w-8 p-0">
                            <span class="sr-only">Ouvrir le menu</span>
                            <MoreHorizontal class="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Voir les transactions</DropdownMenuItem>
                          <DropdownMenuItem>Faire un dépôt</DropdownMenuItem>
                          <DropdownMenuItem>Faire un retrait</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </template>
                <template v-else>
                  <TableRow>
                    <TableEmpty :colspan="4">Aucun compte trouvé pour ce client.</TableEmpty>
                  </TableRow>
                </template>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Onglet Prêts -->
      <TabsContent value="prets">
        <Card>
          <CardHeader>
            <CardTitle>Prêts du Client</CardTitle>
            <CardDescription>Liste des prêts accordés au client.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Montant</TableHead>
                  <TableHead>Taux</TableHead>
                  <TableHead>Date de début</TableHead>
                  <TableHead class="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <template v-if="isLoading">
                  <TableRow v-for="i in 2" :key="i">
                    <TableCell>
                      <Skeleton class="h-5 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton class="h-5 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton class="h-5 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton class="h-5 w-full" />
                    </TableCell>
                  </TableRow>
                </template>
                <template v-else-if="prets.length > 0">
                  <TableRow v-for="pret in prets" :key="pret.id">
                    <TableCell class="font-medium">{{
                      formatCurrency(pret.montant)
                      }}</TableCell>
                    <TableCell>{{ pret.taux_interet_annuel }}%</TableCell>
                    <TableCell>{{ formatDate(pret.date_debut) }}</TableCell>
                    <TableCell class="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                          <Button variant="ghost" class="h-8 w-8 p-0">
                            <span class="sr-only">Ouvrir le menu</span>
                            <MoreHorizontal class="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Voir l'échéancier</DropdownMenuItem>
                          <DropdownMenuItem>Enregistrer un remboursement</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </template>
                <template v-else>
                  <TableRow>
                    <TableEmpty :colspan="4">Aucun prêt trouvé pour ce client.</TableEmpty>
                  </TableRow>
                </template>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
    
    <CreatePretSheet v-if="clientId" v-model:open="isPretSheetOpen" :client-id="clientId" />
  </div>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import { useClientStore } from "@/stores/client";
import { usePretStore } from "@/stores/pret";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableEmpty,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusIcon } from "lucide-vue-next";
import CreatePretSheet from '~/components/prets/CreatePretSheet.vue';

// Définition des types pour plus de clarté
type Client = ReturnType<typeof useClientStore>["clients"][0];
type Compte = ReturnType<typeof useClientStore>["comptes"][0];
type Pret = ReturnType<typeof usePretStore>["prets"][0];

const route = useRoute();
const clientStore = useClientStore();
const pretStore = usePretStore();
const client = ref<Client | null>(null);
const comptes = ref<Compte[]>([]);
const prets = ref<Pret[]>([]);
const isLoading = ref(true);
const isPretSheetOpen = ref(false);

useHead({
  title: "DétailsClient",
});

const clientId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

onMounted(async () => {
  if (!clientId) return;
  isLoading.value = true;

  // Utilisation de Promise.all pour charger les données en parallèle
  const [clientRes, comptesRes, pretsRes] = await Promise.all([
    clientStore.fetchClientById(clientId),
    clientStore.fetchComptesForClient(clientId),
    pretStore.fetchPretsForClient(clientId),
  ]);

  if (clientRes.data) {
    client.value = clientRes.data;
  }
  if (comptesRes.data) {
    comptes.value = comptesRes.data;
  }
  if (pretsRes.data) {
    prets.value = pretsRes.data;
  }

  isLoading.value = false;
});

// Fonction pour formater les dates
const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("fr-FR");
};

// Fonction pour formater les montants monétaires
const formatCurrency = (amount?: number) => {
  if (amount === undefined) return "N/A";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
  }).format(amount);
};

const getAvatarFallback = (client: Client | null) => {
  if (!client) return "";
  return `${client.prenom?.[0] ?? ""}${client.nom?.[0] ?? ""}`.toUpperCase();
};
</script>
