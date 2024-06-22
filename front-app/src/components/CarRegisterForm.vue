<template>
  <v-container>
    <v-sheet class="mx-auto" width="400">
      <v-form ref="form" v-model="valid" fast-fail @submit.prevent="publishCar">
        <v-text-field v-model="car.model" :rules="modelRules" label="Model" placeholder="Tesla Model Y"></v-text-field>
        <v-text-field v-model="car.plate" :rules="plateRules" label="Plate" placeholder="1234-ABC"></v-text-field>
        <v-text-field v-model="car.autonomy" :rules="autonomyRules" label="Autonomy (km)" placeholder="250"></v-text-field>
        <v-text-field v-model="car.price" :rules="priceRules" label="Price ($)" placeholder="40"></v-text-field>
        <v-text-field v-model="car.dailyCharge" :rules="dailyChargeRules" label="Daily charge ($)" placeholder="20"></v-text-field>
        <v-btn :disabled="!valid" color="primary" class="mt-2" type="submit" block>Publish</v-btn>
        <v-btn color="red" class="mt-2" @click="goToAvailableCars" block>Cancel</v-btn>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import Web3 from 'web3'
import { useRouter } from 'vue-router'
import carRegistryJson from '../../../build/contracts/CarRegistry.json'
import API from '../axios'

// Variables de estado
const car = ref({
  model: '',
  plate: '',
  autonomy: '',
  price: '',
  dailyCharge: '',
})
const valid = ref(false)
const router = useRouter()

// Reglas formulario
const modelRules = [value => !!value || 'Car model is required']
const plateRules = [
  value => !!value || 'Car plate is required',
  value => /^\d{4}-[A-Z]{3}/.test(value) || 'Car plate must be in the formate 1234-ABC'
]
const autonomyRules = [
  value => !!value || 'Car autonomy is required',
  value => /^\d*$/.test(value) || 'Car autonomy must be a number'
]
const priceRules = [
  value => !!value || 'Car price is required',
  value => /^\d*$/.test(value) || 'Car price must be a number'
]
const dailyChargeRules = [
  value => !!value || 'Car daily charge is required',
  value => /^\d*$/.test(value) || 'Car daily charge must be a number'
]
const goToAvailableCars = () => router.push('/cars/available')

async function connectToMetaMask() {
  // Detectamos proveedor de metamask
  if (window.ethereum !== undefined) {
    console.log('Metamask is installed')
    try {
      window.web3 = new Web3(window.ethereum)
      // Solicitamos acceso a la cuenta de metamask
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      console.log('Connected to metamask')

      // Solicitamos acceso a las direcciones
      const accounts = await window.web3.eth.getAccounts()
      const account = accounts[0]
      return account
    } catch (error) {
      console.error('User denied account access: ', error)
      throw new Error('User denied account access')
    }
  } else {
    console.error('Metamask is not installed. Please install MetaMask and try again.')
    throw new Error('Metamask is not installed')
  }
}

// Contrato de registro de coches
const contractABI = carRegistryJson.abi
const contractAddress = import.meta.env.VITE_CAR_REGISTRY_CONTRACT_ADDRESS
console.log({contractAddress})
async function publishCar() {
  try {
    // Registro de coche en blockchain
    const account = await connectToMetaMask()
    const contract = new window.web3.eth.Contract(contractABI, contractAddress)
    const isAlreadyRegistered = await contract.methods.isCarRegistered(car.value.plate).call()
    console.log({ isAlreadyRegistered})
    console.log({ car: car.value })
    if (isAlreadyRegistered) {
      console.error('Car already registered')
      alert('This car is already registered')
      return
    }

    await contract.methods.registerCar(car.value.model, car.value.plate, car.value.autonomy, car.value.price, car.value.dailyCharge).send({ from: account })
    console.log('User registered succesfully in blockchain')
    
    // Registro de coche en bbdd
    console.log("Valor de car: ", car.value)
    const response = await API.post('/cars', car.value)
    if (response.status === 201) {
      console.log('Car registered succesfully in API')
      alert('Car published succesfully!')
      router.replace('available')
    } else {
      console.error('Error registering car in API: ', response)
      throw new Error('Registration failed due to API error')
    }
  } catch (error) {
    console.error('Car publication failed:', error.response ? error.response.data : error)
    alert('Car publication error: ' + (error.response ? error.response.data.error : 'Unknown error'))
    throw new Error('Failed to complete the car publication process')
  }
}

</script>