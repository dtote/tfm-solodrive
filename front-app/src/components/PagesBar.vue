<template>
<v-app-bar dense flat>
    <v-container>
    <v-row justify="space-evenly">
        <v-col
        v-for="item in menuItems"
        :key="item.text"
        cols="3"
        @click="navigateTo(item.route)"
        class="text-center py-2"
        :class="{ 'active-item': isActive(item.route) }"
        >
        <v-icon class="pr-1">{{ item.icon }}</v-icon>
        {{ item.text }}
        </v-col>
    </v-row>
    </v-container>
</v-app-bar>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const menuItems = ref([
    { text: 'Rent a car', icon: 'mdi-car', route: '/cars/available' },
    { text: 'Car returns', icon: 'mdi-car-arrow-left', route: '/cars/returns' },
    { text: 'My cars', icon: 'mdi-garage', route: '/cars/mycars' },
    { text: 'Profile', icon: 'mdi-account', route: '/profile' },
]);

const navigateTo = (path) => {
      router.push(path);
    };

const isActive = (path) => {
    return route.path === path;
};

</script>

<style scoped>
.active-item {
  background-color: #1976D2;
  color: white;
}
</style>