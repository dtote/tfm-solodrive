<template>
<v-container>
    <PagesBar/>
    <v-container>
        <v-row justify="center" class="mb-5">
            <v-btn color="primary" @click="goToCarRegister">Publish new car</v-btn>
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
                <v-card-subtitle >Price: <strong>{{ car.price }}$</strong> / Daily charge: <strong>{{ car.dailyCharge }}$</strong></v-card-subtitle>
                <v-card-subtitle class="mt-2">Car plate: <strong>{{ car.plate }}</strong></v-card-subtitle>
                <v-card-subtitle class="mt-2">Autonomy: <strong>{{ car.price }}km</strong></v-card-subtitle>
                <v-card-subtitle class="mt-2">Available: 
                    <v-icon :color="car.available ? 'green' : 'red'" size="16">
                        mdi-circle
                    </v-icon>
                </v-card-subtitle>
            </v-card>
            </v-col>
        </v-row>
    </v-container>
</v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import Web3 from 'web3'
import carRegistry from './../../../build/contracts/CarRegistry.json'

const ownerCars = ref([])
const columns = computed(() => {
    const col = [[], [], []]
    let currentColumnIndex = 0
    ownerCars.value.forEach((car) => {
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

const contractABI = carRegistry.abi
const contractAddress = import.meta.env.VITE_CAR_REGISTRY_CONTRACT_ADDRESS

async function getOwnerCars() {
    if (!window.ethereum) {
        console.error("Please install MetaMask!");
        return;
    }
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts(); // Obtiene la dirección actual de MetaMask
    const account = accounts[0]; // Asume que queremos la primera cuenta

    try {
        // Creamos la instancia del contrato
        const contract = new window.web3.eth.Contract(contractABI, contractAddress)
 
        // Solicitamos las matrículas de los coches publicados por el usuario
        const ownerCarPlates = await contract.methods.getOwnerCarPlates(account).call()
        for (let i = 0; i < ownerCarPlates.length; i++) {
            const currentCarPlate = ownerCarPlates[i]
            const car = await contract.methods.getCar(currentCarPlate).call()
            ownerCars.value.push(car)
        }
        console.log({ ownerCarPlates })

    } catch (error) {
        console.error('Failed to load owner cars: ', error)
    }
}

onMounted(async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await getOwnerCars();
    } else {
        console.error("Please install MetaMask!");
    }
})
</script>