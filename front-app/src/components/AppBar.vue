<template>
    <v-container class="text-center">
        <v-app-bar v-if="!isLandingPage" color="primary" class="text-center">
            <v-app-bar-title>SoloDrive</v-app-bar-title>
        </v-app-bar>
    </v-container>
</template>
<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const isLandingPage = computed(() => route.path === '/')
</script>