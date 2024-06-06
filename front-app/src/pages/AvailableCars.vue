<template>
    <v-container>
        <PageTitle title="Autonomous Cars for Rental"></PageTitle>
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
                    <v-card-subtitle>Precio: {{ car.price }}$</v-card-subtitle>
                    <v-card-subtitle>Matrícula: {{ car.plate }}</v-card-subtitle>
                    <v-card-text>
                        Este vehículo tiene una autonomía de {{ car.autonomy }} kilómetros.
                    </v-card-text>
                    <v-btn flat variant="tonal">Alquilar</v-btn>
                </v-card>
                
                </v-col>
            </v-row>
    </v-container>
</v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import carRegistry from './../../../build/contracts/CarRegistry.json'

const availableCars = ref([])
const columns = computed(() => {
    const col = [[], [], []]
    let currentColumnIndex = 0
    availableCars.value.forEach((car) => {
        const carToBeAdded = {
            model: car[0],
            plate: car[1],
            autonomy: car[2].toString(),
            price: car[3].toString(),
            available: car[4],
            owner: car[5],
        }
        col[currentColumnIndex].push(carToBeAdded)
        currentColumnIndex = (currentColumnIndex + 1) % 3
    })
    return col
})

const contractABI = carRegistry.abi
const contractAddress = '0x30B1705825fbF1cfb320a48051b2b7FA897a0B38'

async function getAllAvailableCars() {
    try {
        // Creamos la instancia del contrato
        const contract = new window.web3.eth.Contract(contractABI, contractAddress)
 
        // Solicitamos las matrículas de los coches disponibles para alquilar
        const availableCarPlates = await contract.methods.getAvailableCars().call()
        for (let i = 0; i < availableCarPlates.length; i++) {
            const currentCarPlate = availableCarPlates[i]
            const car = await contract.methods.getCar(currentCarPlate).call()
            availableCars.value.push(car)
        }

    } catch (error) {
        console.error('Failed to load available cars: ', error)
    }
}

getAllAvailableCars()
// onMounted(() => {
//     getAllAvailableCars()
// })
</script>