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
import { useRouter } from 'vue-router';
import Web3 from 'web3'
import carRentalJson from '../../../build/contracts/CarRentalContract.json'
import API from '@/axios';


const clientRentals = ref([])
const columns = computed(() => {
    const col = [[], [], []]
    let currentColumnIndex = 0
    clientRentals.value.forEach((rental) => {
        const rentalToBeAdded = {
            plate: rental[0],
            price: rental[1].toString(),
            dailyCharge: rental[2].toString(),
            funds: rental[3].toString(),
            charges: rental[4].toString(),
            phone: rental[5],
            owner: rental[6],
            client: rental[7],
            imageUrl: rental[8],
            model: rental[9]
        }
        col[currentColumnIndex].push(rentalToBeAdded)
        currentColumnIndex = (currentColumnIndex + 1) % 3
    })
    return col
})

const router = useRouter()
// const goToCarRegister = () => router.push('/cars/register')

const carRentalABI = carRentalJson.abi
const carRentalAddress = import.meta.env.VITE_CAR_RENTAL_CONTRACT_ADDRESS

async function returnCar(plate) {
    try {
    // Creamos la instancia del contrato 
    const contract  = new window.web3.eth.Contract(carRentalABI,  carRentalAddress)
    const accounts = await window.web3.eth.getAccounts()
    const account = accounts[0]

    await contract.methods.deleteRental(plate).send({ from: account })
    console.log('Rental contract deleted successfully')

    await API.patch(`cars/${plate}`)
    console.log('Car availability updated succesfully in API')

    await getOwnerCars()
    } catch (error) {
        console.error('Failed to return car: ', error)
    }
}

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
        const contract = new window.web3.eth.Contract(carRentalABI, carRentalAddress)
 
        // Solicitamos las matrículas de los coches publicados por el usuario
        const clientRentalCarPlates = await contract.methods.getClientRentalCarPlates(account).call()
        clientRentals.value = await Promise.all(clientRentalCarPlates.map(async (currentCarPlate) => {
            const rental = await contract.methods.getRental(currentCarPlate).call()
            const { data: car } = await API.get(`/cars/${currentCarPlate}`)
            rental[8] = car.imageUrl
            rental[9] = car.model

            return rental
        }))
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