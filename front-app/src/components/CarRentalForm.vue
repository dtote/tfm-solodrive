<template>
  <v-container>
    <v-sheet class="mx-auto" width="400">
      <v-form ref="form" v-model="valid" fast-fail @submit.prevent="createRental(car.plate, car.price, car.dailyCharge, contactPhone, car.owner)">
        <h2 class="text-center">{{ car.model }}</h2>
        <p class="my-3">
          By confirming the rental, you agree to an initial charge of <strong>{{ car.price }}$</strong>. 
          Additionally, a daily charge of <strong>{{ car.dailyCharge }}$</strong> will be applied throughout the rental period.
        </p>
        <v-text-field 
          v-model="contactPhone"
          :rules="contactPhoneRules" 
          label="Phone" 
          outlined 
          placeholder="606606606"
          class="mb-2"
        ></v-text-field>
        <v-btn :disabled="!valid" color="primary" class="mt-4" type="submit" block>Confirm Rental</v-btn>
        <v-btn color="red" class="mt-2" @click="goToAvailableCars" block>Cancel</v-btn>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Web3 from 'web3'
import carRegistryJson from '../../../build/contracts/CarRegistry.json'
import carRentalJson from '../../../build/contracts/CarRentalContract.json'
import API from '../axios'
import cc from 'cryptocompare'

// Variables de estado
const car = ref({
  model: '',
  plate: '',
  autonomy: '',
  price: '',
  dailyCharge: '',
  owner: ''
})
const contactPhone = ref('')
const valid = ref(false)

const router = useRouter()
const route = useRoute()

// Reglas formulario
const contactPhoneRules = [
  value => !!value || 'Contact information is required',
  value => /^\d{9}/.test(value) || 'Phone must have 9 digits'
]


const goToAvailableCars = () => router.push('/cars/available')

// Contrato de registro de coches
const carRegistryABI = carRegistryJson.abi
const carRegistryAddress = import.meta.env.VITE_CAR_REGISTRY_CONTRACT_ADDRESS
const carRentalABI = carRentalJson.abi
const carRentalAddress = import.meta.env.VITE_CAR_RENTAL_CONTRACT_ADDRESS

async function convertUSDtoETH(amountInUsd) {
  try {
        // Obtener el precio actual de ETH en USD
        const prices = await cc.price('ETH', ['USD']);
        const ethPriceInUsd = prices.USD;

        // Calcular la cantidad de ETH que puedes comprar con la cantidad especificada de USD
        const amountInEth = amountInUsd / ethPriceInUsd;
        
        return amountInEth;
    } catch (error) {
        console.error('Error fetching ETH price:', error);
        return null;
    }
}

async function setCarDetails() {
    try {
        // Creamos la instancia del contrato
        const contract = new window.web3.eth.Contract(carRegistryABI, carRegistryAddress)
 
        // Solicitamos los datos del coche que se quiere alquilar
        const carPlate = route.params.plate
        const carToBeRented = await contract.methods.getCar(carPlate).call()
        car.value = {
          model: carToBeRented[0],
          plate: carToBeRented[1],
          autonomy: carToBeRented[2].toString(),
          price: carToBeRented[3].toString(),
          dailyCharge: carToBeRented[4].toString(),
          available: carToBeRented[5],
          owner: carToBeRented[6],
        }
    } catch (error) {
        console.error('Failed to load available cars: ', error)
    }
}

async function createRental(plate, price, dailyCharge, phone, owner) {

  try {
    const amountInEther = await convertUSDtoETH(price)

    // Creamos la instancia del contrato 
    const contract  = new window.web3.eth.Contract(carRentalABI,  carRentalAddress)
    const accounts = await window.web3.eth.getAccounts()
    const account = accounts[0]

    console.log({ account })
    await contract.methods.createRental(plate, price, dailyCharge, phone, owner).send({ from: account, value: window.web3.utils.toWei(amountInEther.toString(), 'ether')  })
    console.log('Rental contract created successfully')
  
    await API.patch(`cars/${plate}`)
    console.log('Car availability updated succesfully in API')
    
    router.push('/cars/available')
    } catch (error) {
    console.error('Rental contract failed: ', error)
  }


  
}



onMounted(async () => {
  if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await setCarDetails();
    } else {
        console.error("Please install MetaMask!");
    }
  console.log(await convertUSDtoETH(20))
  
})
</script>