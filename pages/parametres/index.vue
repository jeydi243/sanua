<template>
    <div>
        
    </div>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const dataChart = {
    labels: ['January', 'February', 'March'],
    datasets: [{ data: [40, 20, 12] }]
}
const optionChart = {
    responsive: true
}
</script>

<style scoped></style>