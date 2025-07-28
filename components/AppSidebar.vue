<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import { AudioWaveform, BookOpen, Bot, Command, GalleryVerticalEnd, Settings2, SquareTerminal } from 'lucide-vue-next'
import NavMain from '@/components/NavMain.vue'
import NavUser from '@/components/NavUser.vue'
import TeamSwitcher from '@/components/TeamSwitcher.vue'

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'

const props = withDefaults(defineProps<SidebarProps>(), {
    collapsible: 'icon',
})

const user = useSupabaseUser()
const _userTo = { ...user, src: 'https://www.linkedin.com' }
const data = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: 'http://localhost:3000/avatars/shadcn.jpg',
    },
    teams: [
        {
            name: 'Acme Inc',
            logo: GalleryVerticalEnd,
            plan: 'Enterprise',
        },
        {
            name: 'Acme Corp.',
            logo: AudioWaveform,
            plan: 'Startup',
        },
        {
            name: 'Evil Corp.',
            logo: Command,
            plan: 'Free',
        },
    ],
    navMain: [
        {
            title: 'Playground',
            url: '#',
            icon: SquareTerminal,
            isActive: false,
            items: [
                {
                    title: 'History',
                    url: '#',
                },
                {
                    title: 'Starred',
                    url: '#',
                },
                {
                    title: 'Settings',
                    url: '#',
                },
            ],
        },
        {
            title: 'Caissier',
            url: '/',
            icon: Bot,
            items: [
                {
                    title: 'Transactions',
                    icon: 'history',
                    url: '/cashier/transactions',
                },
                {
                    title: 'Tableau de Bord',
                    icon: 'dashboard',
                    url: '/cashier/dashboard',
                },
                { title: 'Enregistrer un Dépôt', url: '/cashier/deposit' },
                { title: 'Enregistrer un Retrait', url: '/cashier/withdrawal' },
                {
                    title: 'Rapports de Caisse Journaliers',
                    icon: 'file-alt',
                    url: '/reports/daily-cash',
                },
            ],
        },
        {
            title: 'Documentation',
            url: '#',
            icon: BookOpen,
            items: [
                {
                    title: 'Introduction',
                    url: '#',
                },
                {
                    title: 'Get Started',
                    url: '#',
                },
                {
                    title: 'Tutorials',
                    url: '#',
                },
                {
                    title: 'Changelog',
                    url: '#',
                },
            ],
        },
        {
            title: 'Parametres',
            url: '#',
            icon: Settings2,
            isActive: true,
            items: [
                {
                    title: 'General',
                    url: '/parametres',
                },
                {
                    title: 'Utilisateurs',
                    url: '/parametres/utilisateurs',
                },
                {
                    title: 'Roles',
                    url: '/parametres/roles',
                },
                {
                    title: 'Lookups',
                    url: '/parametres/lookups',
                },
                {
                    title: 'Clients',
                    url: '/clients',
                },
                {
                    title: 'Organisations',
                    url: '/parametres/organisations',
                },
            ],
        },
    ],
}
</script>

<template>
    <Sidebar v-bind="props">
        <SidebarHeader>
            <TeamSwitcher :teams="data.teams" />
        </SidebarHeader>
        <SidebarContent>
            <NavMain :items="data.navMain" />
        </SidebarContent>
        <SidebarFooter>
            <NavUser :user="data.user" />
        </SidebarFooter>
        <SidebarRail />
    </Sidebar>
</template>
