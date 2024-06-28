<template>
<v-container>
    <PagesBar/>
    <v-container>
        <v-row dense class="mt-11">
            <v-col class="text-center" cols="12" sm="6" md="4" v-for="(column, index) in columns" :key="index">
                <v-card variant="outlined" class="mx-2 my-2" v-for="rental in column" :key="rental.plate">
                    <v-img :src="rental.imageUrl" class="car-image" aspect-ratio="2.5">
                    </v-img>
                    <v-card-title class="justify-center">{{ rental.model }}</v-card-title>
                    <v-card-text>
                        <div>Plate: <strong>{{ rental.plate }}</strong></div>
                    </v-card-text>
                    <v-btn flat color="red"  class="mb-2" @click="returnCar(rental.plate)">
                        Return car
                        <v-icon class="ml-2">mdi-car-arrow-left</v-icon>
                    </v-btn>            
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Web3 from 'web3'
import carRentalJson from '../../../build/contracts/CarRental.json'
import API from '@/axios';


const clientRentals = ref([])
const columns = computed(() => {
    const col = [[], [], []]
    let currentColumnIndex = 0
    clientRentals.value.forEach((rental) => {
        col[currentColumnIndex].push(rental)
        currentColumnIndex = (currentColumnIndex + 1) % 3
    })
    return col
})

const carRentalABI = carRentalJson.abi
const carRentalAddress = import.meta.env.VITE_CAR_RENTAL_CONTRACT_ADDRESS

async function getClientAccount() {
    if (!window.ethereum) {
        console.error("Please install MetaMask!");
        return;
    }
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    return account
}

async function returnCar(plate) {
    const client = await getClientAccount()

    try {
    // Creamos la instancia del contrato 
    const contract  = new window.web3.eth.Contract(carRentalABI,  carRentalAddress)

    await contract.methods.returnCar(plate).send({ from: client })
    console.log('Rental contract deleted successfully')

    await API.patch(`cars/${plate}`)
    console.log('Car availability updated succesfully in API')

    await getClientCars()
    } catch (error) {
        console.error('Failed to return car: ', error)
    }
}



async function getClientCars() {
    const client = await getClientAccount()

    try {
        // Creamos la instancia del contrato
        const contract = new window.web3.eth.Contract(carRentalABI, carRentalAddress)
 
        // Obtenemos los coches alquilados por el cliente
        const clientActiveRentals = await contract.methods.getActiveRentalsByClient(client).call()
        clientRentals.value = await Promise.all(clientActiveRentals.map(async (rental) => {
            const { data: car } = await API.get(`cars/${rental.plate}`)

            rental.model = car.model
            rental.imageUrl = car.imageUrl

            return rental;
        }))
    } catch (error) {
        console.error('Failed to load rented cars: ', error)
    }
}

onMounted(async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await getClientCars();
    } else {
        console.error("Please install MetaMask!");
    }
})
</script>