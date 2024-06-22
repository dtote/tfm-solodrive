<template>
    <v-container>
        <PagesBar/>
        <!-- <PageTitle title="Available Cars for Rental"></PageTitle> -->
        <v-container>
            <v-row justify="center" class="mb-5">
                <v-btn color="primary" @click="goToCarRegister">¿Wanna publish your car? Click me!</v-btn>
            </v-row>
            <v-row dense>
                <v-col class="text-center" cols="4" v-for="(column, index) in columns" :key="index">
                    <v-card 
                        variant="outlined"
                        v-for="car in column" 
                        :key="car.plate" 
                        class="mx-4 my-4 pa-2"
                    >
                    <v-card-title>{{ car.model }}</v-card-title>
                    <v-card-subtitle class="mt-2 text-left">Price: <strong>{{ car.price }}$</strong> / Daily charge: <strong>{{ car.dailyCharge }}$</strong></v-card-subtitle>
                    <v-card-subtitle class="mt-2 text-left">Car plate: <strong>{{ car.plate }}</strong></v-card-subtitle>
                    <v-card-subtitle class="mt-2 text-left">Autonomy: <strong>{{ car.price }}km</strong></v-card-subtitle>
                    <v-card-subtitle class="mt-2 text-left">Available: 
                        <v-icon :color="car.available ? 'green' : 'red'" size="16">
                            mdi-circle
                        </v-icon>
                    </v-card-subtitle>
                    <v-btn flat color="cyan-lighten-3" class="mt-2" @click="goToRentalForm(car.plate)">
                        Rent  
                        <v-icon class="ml-2">mdi-credit-card</v-icon>
                    </v-btn>
                </v-card>
                
                </v-col>
            </v-row>
    </v-container>
</v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Web3 from 'web3'
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
            dailyCharge: car[4].toString(),
            available: car[5],
            owner: car[6],
        }
        col[currentColumnIndex].push(carToBeAdded)
        currentColumnIndex = (currentColumnIndex + 1) % 3
    })
    return col
})

const router = useRouter()
const goToCarRegister = () => router.push('/cars/register')
const goToRentalForm = (plate) => router.push({ name: 'CarRental', params: { plate} })

const contractABI = carRegistry.abi
const contractAddress = import.meta.env.VITE_CAR_REGISTRY_CONTRACT_ADDRESS

async function getAllAvailableCars() {
    try {
        // Creamos la instancia del contrato
        const contract = new window.web3.eth.Contract(contractABI, contractAddress)
 
        // Solicitamos las matrículas de los coches disponibles para alquilar
        const availableCarPlates = await contract.methods.getAvailableCarPlates().call()
        for (let i = 0; i < availableCarPlates.length; i++) {
            const currentCarPlate = availableCarPlates[i]
            const car = await contract.methods.getCar(currentCarPlate).call()
            availableCars.value.push(car)
        }

    } catch (error) {
        console.error('Failed to load available cars: ', error)
    }
}

onMounted(async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await getAllAvailableCars();
    } else {
        console.error("Please install MetaMask!");
    }
})
</script>