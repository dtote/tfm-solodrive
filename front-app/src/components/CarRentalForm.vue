<template>
  <v-container>
    <v-sheet class="mx-auto" width="400">
      <v-form ref="form" v-model="valid" fast-fail @submit.prevent="rentCar(car.plate, car.price, contactPhone, car.owner)">
        <h2 class="text-center">{{ car.model }}</h2>
        <p class="my-3">
          By confirming the rental, you agree to pay a charge of <strong>{{ car.price }}$</strong> for one day's use of this vehicle. 
          In addition, when you return the vehicle, you will be charged a processing fee.
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
import carRentalJson from '../../../build/contracts/CarRental.json'
import API from '../axios'
import cc from 'cryptocompare'

// Variables de estado
const car = ref({
  model: '',
  plate: '',
  autonomy: '',
  price: '',
  owner: '',
  available: ''
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

const carRentalABI = carRentalJson.abi
const carRentalAddress = import.meta.env.VITE_CAR_RENTAL_CONTRACT_ADDRESS

const goToAvailableCars = () => router.push('/cars/available')

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
        // Sacamos la matricula del coche de la url 
        const plate = route.params.plate

        // Obtenemos los detalles del coche y los seteamos
        const { data: carToBeRented } = await API.get(`cars/${plate}`)
        car.value = carToBeRented

    } catch (error) {
        console.error('Failed to load car data: ', error)
    }
}


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

async function rentCar(plate, price, contactPhone, owner) {

  try {
    // Obtenemos la wallet del cliente
    const client = await getClientAccount()

    // Creamos la instancia del contrato 
    const contract  = new window.web3.eth.Contract(carRentalABI,  carRentalAddress)

    const amountInEther = await convertUSDtoETH(price)

    await contract.methods.rentCar(plate, price, contactPhone, owner).send({ from: client, value: window.web3.utils.toWei(amountInEther.toString(), 'ether')  })
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
})
</script>