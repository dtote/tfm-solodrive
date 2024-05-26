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
        <v-container class="text-center">
            <v-btn color="primary" @click="publishCarDialog = true">Añadir vehículo {{ publishCarDialog }}</v-btn>
            <v-dialog v-model="publishCarDialog" max-width="600px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Formulario de Alquiler</span>
                    </v-card-title>
                </v-card>
                <v-card-text>
                    <v-form ref="form">
                        <v-text-field label="Identificador" v-model="formData.id" required></v-text-field>
                        <v-text-field label="Modelo" v-model="formData.model" required></v-text-field>
                        <v-text-field label="Precio/día en $" v-model="formData.price" required></v-text-field>
                        <v-text-field label="Autonomía en km" v-model="formData.autonomy" required></v-text-field>
                        <v-text-field label="Asientos" v-model="formData.seats" required></v-text-field>
                        <v-text-field label="Propietario" v-model="formData.owner" required></v-text-field>
                    </v-form>
                </v-card-text>
                <v-menu ref="menu" v-model="menu" :close-on-content-click="false">
                    <v-space></v-space>
                    <v-btn @click="publishCardDialog = false">Cancelar</v-btn>
                    <v-btn @click="submitForm">Añadir</v-btn>
                </v-menu>
            </v-dialog>
        </v-container>

        <v-container>
            <v-row dense>
                <v-col class="text-center" cols="4" v-for="(column, index) in columns" :key="index">
                    <v-card 
                        variant="outlined"
                        v-for="car in column" 
                        :key="car.id" 
                        class="mx-4 my-4 pa-2"
                    >
                    <v-card-title>{{ car.model }}</v-card-title>
                    <v-card-subtitle>{{ car.price }}$ / día</v-card-subtitle>
                    <v-card-text>
                        Este vehículo dispone de {{ car.seats }} asientos y tiene una autonomía {{ car.autonomy }} de kilómetros.
                    </v-card-text>
                    <v-btn flat variant="tonal">Alquilar</v-btn>
                </v-card>
                
                </v-col>
            </v-row>
        </v-container>
    </v-main>

</template>

<script setup>
import { computed, ref } from 'vue';

const publishCarDialog = ref(false)
const menu = ref(false)
const formData = ref({
    id: '',
    model: '',
    price: '',
    autonomy: '',
    seats: '',
    owner: '',
})
const submitForm = () => {
    cars.value.push(...formData.value)
    publishCarDialog.value = false
}

const cars = ref([
    { id: 1, model: "Tesla Model S", price: 50, autonomy: 567, seats: 4, owner: "Someone", available: false },
    { id: 1, model: "Tesla Model S", price: 50, autonomy: 567, seats: 4, owner: "Someone", available: true },
    // { id: 1, model: "Tesla Model S", price: 50, autonomy: 567, seats: 4, owner: "Someone", available: true },
    // { id: 1, model: "Tesla Model S", price: 50, autonomy: 567, seats: 4, owner: "Someone", available: true },
    // { id: 1, model: "Tesla Model S", price: 50, autonomy: 567, seats: 4, owner: "Someone", available: true },
    // { id: 1, model: "Tesla Model S", price: 50, autonomy: 567, seats: 4, owner: "Someone", available: true },
])

const columns = computed(() => {
    const col = [[], [], []]
    let currentColumnIndex = 0
    cars.value.forEach((car) => {
        // Sólo se muestra el coche si está disponible
        if (car.available) {
            col[currentColumnIndex].push(car)
            currentColumnIndex = (currentColumnIndex + 1) % 3
        }
    })
    return col
})


</script>