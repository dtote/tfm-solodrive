<template>
    <v-container class="text-center">
        <v-row>
            <v-col>
                <h1>{{title || 'No props passed yet'}}</h1>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
const props = defineProps({
    title: String
})
</script>