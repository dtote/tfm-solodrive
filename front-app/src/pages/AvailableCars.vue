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
import autonomousCarRegistry from './../../../build/contracts/AutonomousCarRegistry.json'

const contractABI = autonomousCarRegistry.abi
const contractAddress = '0x1381cc565d123de0089DcabD5AaaFffFAF8F58dE'

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

// async function connectToMetaMask() {
//   // Detectamos proveedor de metamask
//   if (window.ethereum !== undefined) {
//     console.log('Metamask is installed')
//     try {
//       window.web3 = new Web3(window.ethereum)
//       // Solicitamos acceso a la cuenta de metamask
//       await window.ethereum.request({ method: 'eth_requestAccounts' })
//       console.log('Connected to metamask')

//       const accounts = await window.web3.eth.getAccounts()
//       return accounts[0]

//     } catch (error) {
//       console.log('User denied account access')
//       throw new Error('User denied account access')
//     }
//   } else {
//     console.error('Metamask is not installed. Please install MetaMask and try again.')
//     throw new Error('Metamask is not installed')
//   }
// }

async function getAllAvailableCars() {
    try {
        // // Conectamos con metamask
        // await connectToMetaMask()

        // Creamos la instancia del contrato
        const contract = new window.web3.eth.Contract(contractABI, contractAddress)
 
        // Solicitamos las matrículas de los coches disponibles para alquilar
        const availableCarPlates = await contract.methods.getAvailableCars().call()
        // console.log(availableCarPlates)
        for (let i = 0; i < availableCarPlates.length; i++) {
            const currentCarPlate = availableCarPlates[i]
            const car = await contract.methods.getCar(currentCarPlate).call()
            availableCars.value.push(car)
        }

        // console.log(availableCars.value)
    } catch (error) {
        console.error('Failed to load available cars: ', error)
    }
}

getAllAvailableCars()
// onMounted(() => {
//     getAllAvailableCars()
// })
</script>