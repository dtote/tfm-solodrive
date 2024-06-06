<template>
  <v-container>
    <v-sheet class="mx-auto" width="400">
      <v-form ref="form" v-model="valid" fast-fail @submit.prevent="registerUser">
        <v-text-field v-model="username" :rules="usernameRules" label="Username"></v-text-field>
        <v-text-field v-model="dni" :rules="dniRules" label="DNI" placeholder="12345678-X"></v-text-field>
        <v-text-field 
          v-model="password" 
          :rules="passwordRules" 
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
          label="Password" 
          required>
        </v-text-field>

        <v-btn :disabled="!valid" color="primary" class="mt-2" type="submit" block>Submit</v-btn>
        <v-btn color="secondary" class="mt-2" @click="goToLogin" block>¿Registered already? Log in here</v-btn>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import Web3 from 'web3'
import { useRouter } from 'vue-router'
import userRegistryJson from './../../../build/contracts/UserRegistry.json'
import API from './../axios'

// Variables de estado
const username = ref('')
const dni = ref('')
const password = ref('')
const form = ref(null)
const valid = ref(false)
const showPassword = ref(false)
const router = useRouter()

// Reglas formulario
const usernameRules = [value => value?.length > 3 || 'Username must be at least 3 characters']
const dniRules = [
  value => /^\d{8}-[A-Z]$/.test(value) || 'DNI must be in the format 12345678-X.',
]
const passwordRules = [
  value => !!value || 'Password is required',  // Verifica que el valor no esté vacío.
  value => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value) || 'Passwords must have at least 8 characters, one letter and one number'
]

// Contrato de registro de usuarios
const contractABI = userRegistryJson.abi
const contractAddress = '0x249951775dEdC70844994fa3E00CeEAcc9331712'

async function goToLogin() {
  await connectToMetaMask()
  router.replace('/login')
}

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

async function registerUser() {
  try {
    // Registro de usuario en blockchain
    const account = await connectToMetaMask()
    const contract = new window.web3.eth.Contract(contractABI, contractAddress)

    const isAlreadyRegistered = await contract.methods.isUserRegistered(dni.value).call()
    if (isAlreadyRegistered) {
      console.error('User already registered')
      alert('This user is already registered')
      return
    }

    await contract.methods.registerUser(username.value, dni.value).send({ from: account })
    console.log('User registered succesfully in blockchain')

    // Registro de usuario en bbdd
    const response = await API.post('/auth/register', {
      username: username.value,
      dni: dni.value,
      password: password.value
    })
    if (response.status === 201) {
      console.log('User registered succesfully in API')

      localStorage.setItem('jwtToken', response.data.access_token)
      router.replace('available-cars')
    } else {
      console.error('Error registering user in API:', response)
      throw new Error('Registration failed due to API error')
    }
  } catch (error) {
    console.error('Registration failed:', error.response ? error.response.data : error)
    alert('Register error: ' + (error.response ? error.response.data.error : 'Unknown error'))
    throw new Error('Failed to complete the registration process')
  }
}

</script>