<template>
<v-container>
    <PagesBar/>
    <v-container>
        <v-row dense class="mt-11">
            <v-col class="text-center" cols="4" v-for="(column, index) in columns" :key="index">
                <v-card
                    variant="outlined"
                    v-for="rental in column"
                    :key="rental.plate"
                    class="car-card mx-2 pa-4"
                >
                    <v-img :src="rental.imageUrl" class="car-image" height="200px" width="100%">
                        <v-card-title>{{ rental.model }}</v-card-title>
                    </v-img>
                    <v-card-subtitle class="text-left">Plate: <strong>{{ rental.plate }}</strong></v-card-subtitle>
                    <v-card-subtitle class="mt-2 text-left">Next Charge: <strong>{{ rental.dailyCharge }}$</strong></v-card-subtitle>
                    <v-card-subtitle class="mt-2 text-left">Funds: <strong>{{ rental.funds }}$</strong> / Charges:<strong> {{rental.charges}}$</strong></v-card-subtitle>
                    <v-btn color="primary" class="mt-2" block>
                        Add Funds
                        <v-icon class="ml-2">mdi-wallet</v-icon>
                    </v-btn>
                    <v-btn color="red" class="mt-2" block>
                        Return
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