<template>
    <v-container>
        <v-app-bar>
            <template v-slot:prepend>
                <v-app-bar-nav-icon></v-app-bar-nav-icon>
            </template>

            <v-app-bar-title class="text-center">Alquiler de Coches Autónomos</v-app-bar-title>

            <v-btn icon>
                <v-icon>mdi-account</v-icon>
            </v-btn>
      </v-app-bar>
    </v-container>

    <v-main>
        <v-container>
            <v-row dense>
                <v-col class="text-center" cols="4" v-for="(column, index) in columns" :key="index">
                    <v-card 
                        hover
                        v-for="car in column" 
                        :key="car.id" 
                        class="mx-4 my-4 pa-2"
                    >
                    <v-card-title>{{ car.model }}</v-card-title>
                    <v-card-subtitle>{{ car.price }}$ / día</v-card-subtitle>
                    <v-card-text>
                        Este vehículo dispone de {{ car.seats }} asientos y tiene una autonomía {{ car.autonomy }} de kilómetros.
                    </v-card-text>
                </v-card>
                
                </v-col>
            </v-row>
        </v-container>
    </v-main>

</template>

<script setup>
import { computed, ref } from 'vue';


const cars = ref([
    { id: 1, model: "Tesla Model S", price: 50, autonomy: 567, seats: 4 },
    { id: 1, model: "Tesla Model S", price: 50, autonomy: 567, seats: 4 },
    { id: 1, model: "Tesla Model S", price: 50, autonomy: 567, seats: 4 },
    { id: 1, model: "Tesla Model S", price: 50, autonomy: 567, seats: 4 },
    { id: 1, model: "Tesla Model S", price: 50, autonomy: 567, seats: 4 },
    { id: 1, model: "Tesla Model S", price: 50, autonomy: 567, seats: 4 },
])

const columns = computed(() => {
    const col = [[], [], []]
    cars.value.forEach((car, index) => {
        col[index % 3].push(car)
    })
    return col
})


</script>