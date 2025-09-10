. Architecture et conventions
Framework: Nuxt 3 (basé sur Vue 3).

Langage: TypeScript (strictement utilisé pour tous les fichiers .ts et <script setup> dans les composants Vue).

Gestion d'état: Pinia est utilisé pour la gestion de l'état global. Les stores sont situés dans le répertoire stores/.

Nommage des fichiers:

Les composants doivent être en PascalCase (ex: MyComponent.vue).

Les pages et les layouts sont en kebab-case (ex: index.vue, user-profile.vue).

Les fichiers de plugins et de middlewares sont également en kebab-case.

Composants: Les composants sont dans le répertoire components/. Les composants réutilisables doivent être créés et utilisés de manière modulaire.

3. Tâches courantes
Lors de la proposition de code ou de la modification de fichiers, les agents IA doivent respecter les points suivants :

Écriture de code:

Toujours utiliser script setup pour les composants Vue.

Privilégier la composition API de Vue.

Utiliser TypeScript pour la sécurité des types.

Formater le code en utilisant Prettier ou une convention similaire pour maintenir la cohérence.

Révision de code:

Identifier les opportunités de refactorisation pour améliorer la performance ou la lisibilité.

Vérifier la conformité aux conventions de nommage et aux bonnes pratiques de Nuxt.

Assurer que les nouvelles fonctionnalités sont testables.

Ajout de nouvelles fonctionnalités:

Créer des composants modulaires plutôt que d'ajouter du code dans des composants existants qui deviennent trop grands.

Si une nouvelle fonctionnalité nécessite un état global, un store Pinia doit être créé.

4. Directives spécifiques
Imports: Utiliser les alias de chemin Nuxt (#) pour les imports (ex: import { useUserStore } from '#stores/user';).

Styles: Préférer les styles scoped dans les composants (<style scoped>). L'utilisation de classes utilitaires de Tailwind CSS est encouragée si nécessaire.

API Fetch: Utiliser la fonction useFetch de Nuxt pour les appels API.