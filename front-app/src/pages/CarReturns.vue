<template>
<v-container>
    <PagesBar/>
    <v-container>
        <v-row dense>
            <v-col class="text-center" cols="4" v-for="(column, index) in columns" :key="index">
                <v-card
                    variant="outlined"
                    v-for="rental in column"
                    :key="rental.plate"
                    class="mx-4 my-4 pa-2"
                >
                    <v-card-title>{{ rental.plate }}</v-card-title>
                    <v-card-subtitle>Price: <strong>{{ rental.price }}$</strong></v-card-subtitle>
                    <v-card-subtitle>Daily Charge: <strong>{{ rental.dailyCharge }}$</strong></v-card-subtitle>
                    <v-card-subtitle>Funds: <strong>{{ rental.funds }}$</strong></v-card-subtitle>
                    <v-card-subtitle>Charges: <strong>{{ rental.charges }}$</strong></v-card-subtitle>
                    <v-card-subtitle>Phone: <strong>{{ rental.phone }}</strong></v-card-subtitle>
                    <v-card-subtitle>Owner: <strong>{{ rental.owner }}</strong></v-card-subtitle>
                    <v-card-subtitle>Client: <strong>{{ rental.client }}</strong></v-card-subtitle>
                    <v-btn :disabled="!valid" color="primary" class="mt-2" type="submit" block>
                        Add Funds
                        <v-icon class="ml-2">mdi-wallet</v-icon>
                    </v-btn>
                    <v-btn color="red" class="mt-2" @click="goToAvailableCars" block>
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
        for (let i = 0; i < clientRentalCarPlates.length; i++) {
            const currentRentalCarPlate = clientRentalCarPlates[i]
            const rental = await contract.methods.getRental(currentRentalCarPlate).call()
            clientRentals.value.push(rental)
        }
        console.log({ ownerCarPlates: clientRentalCarPlates })

    } catch (error) {
        console.error('Failed to load owner cars: ', error)
    }
}

// Ahora queda que en la tarjeta salga lo de devolver y lo de añadir fondos

onMounted(async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await getOwnerCars();
    } else {
        console.error("Please install MetaMask!");
    }
})
</script>