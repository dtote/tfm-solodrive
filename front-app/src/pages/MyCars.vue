<template>
<v-container>
    <PagesBar/>
    <v-container>
        <v-row justify="center" class="mb-5">
            <v-btn color="primary" @click="goToCarRegister">Publish new car</v-btn>
        </v-row>
        <v-row dense>
            <v-col class="text-center" cols="4" v-for="(column, index) in columns" :key="index">
                <v-card variant="outlined" v-for="car in column" :key="car.plate" class="car-card mx-2 pa-4">
                    <v-img :src="car.imageUrl" class="car-image" height="200px" width="100%">
                        <v-card-title>{{ car.model }}</v-card-title>
                    </v-img>
                    <v-card-subtitle class="text-left">Price: <strong>{{ car.price }}$</strong> / Daily charge:
                        <strong>{{ car.dailyCharge }}$</strong></v-card-subtitle>
                    <v-card-subtitle class="mt-2 text-left">Car plate: <strong>{{ car.plate
                            }}</strong></v-card-subtitle>
                    <v-card-subtitle class="mt-2 text-left">Autonomy: <strong>{{ car.price
                            }}km</strong></v-card-subtitle>
                    <v-card-subtitle class="mt-2 text-left">Available:
                        <v-icon :color="car.available ? 'green' : 'red'" size="16">
                            mdi-circle
                        </v-icon>
                    </v-card-subtitle>
                    <v-btn flat color="red" class="mt-2" :disabled="!car.available" @click="deleteOwnerCar(car.plate)">
                        Delete
                        <v-icon class="ml-2">mdi-trash-can-outline</v-icon>
                    </v-btn>
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
import API from '@/axios';

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
            imageUrl: car[7]
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

async function getOwnerAccount() {
    if (!window.ethereum) {
        console.error("Please install MetaMask!");
        return;
    }
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts(); // Obtiene la dirección actual de MetaMask
    const account = accounts[0]; // Asume que queremos la primera cuenta

    return account
}

async function deleteOwnerCar(plate) {
    const account = await getOwnerAccount()

    try {
        const contract = new window.web3.eth.Contract(contractABI, contractAddress)
        await contract.methods.deleteCar(plate).send({ from: account })
        console.log('Car deleted succesfully from blockchain')

        await API.delete(`cars/${plate}`)
        console.log('Car deleted succesfully from API')

        await getOwnerCars();
    } catch (error) {
        console.error('Error deleting car: ', error)
    }
}

async function getOwnerCars() {

    const account = await getOwnerAccount()
    try {
        // Creamos la instancia del contrato
        const contract = new window.web3.eth.Contract(contractABI, contractAddress)

        // Solicitamos las matrículas de los coches publicados por el usuario
        const ownerCarPlates = await contract.methods.getOwnerCarPlates().call({ from: account })
        
        ownerCars.value = await Promise.all(ownerCarPlates.map(async (currentCarPlate) => {
            const car = await contract.methods.getCar(currentCarPlate).call()
            const imageUrl = await getCarImage(currentCarPlate)
            car[7] = imageUrl
            return car
        }))
    } catch (error) {
        console.error('Failed to load owner cars: ', error)
        alert(`Error loading owner cars: ${error.message}`);
    }
}

const getCarImage = async (plate) => {
    const { data: car } = await API.get(`/cars/${plate}`);

    if (car && car.imageUrl) {
      return car.imageUrl;
    } 
    return 'http://localhost:8000/uploads/default.png';
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

<style scoped>
.car-card {
  height: 380px; /* Ajustar según sea necesario */
}

.car-image {
    object-fit: cover;
}
</style>