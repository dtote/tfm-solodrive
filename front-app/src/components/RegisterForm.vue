<template>
  <v-container>
    <v-sheet class="mx-auto" width="400">
      <v-form fast-fail @submit.prevent="registerUser">
        <v-text-field v-model="name" :rules="nameRules" label="Name"></v-text-field>

        <v-text-field v-model="dni" :rules="dniRules" label="DNI" placeholder="12345678-X"></v-text-field>

        <v-text-field v-model="email" :rules="emailRules" label="Email" placeholder="user@example.com"></v-text-field>

        <v-text-field type="password" v-model="password" :rules="passwordRules" label="Password"></v-text-field>
        <v-btn color="primary" class="mt-2" type="submit" block>Submit</v-btn>
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
console.log('Register component is being mounted')

const name = ref('')
const dni = ref('')
const email = ref('')
const password = ref('')

const router = useRouter()
function goToLogin() {
  router.replace('/login')
}
const nameRules = [
  value => {
    if (value?.length > 3) return true

    return 'First name must be at least 3 characters'
  },
]

const dniRules = [
  value => {
    if (!/^\d{8}-[A-Z]$/.test(value)) {
      return 'DNI must be in the format 12345678-X.'
    }
    return true
  }
]

const emailRules = [
  value => {
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) return true

    return 'Incorrect email format'
  },
]

const passwordRules = [
  value => {
    if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)) {
      return 'Passwords must have at least 8 characters, one letter and one number'
    }
    return true
  }
]

const contractABI = userRegistryJson.abi
const contractAddress = '0xA3812e0dEd712f41725D39900b2e0D93ac806640'

async function connectToMetaMask() {
  // Detectamos proveedor de metamask
  if (window.ethereum !== undefined) {
    console.log('Metamask is installed')
    try {
      window.web3 = new Web3(window.ethereum)
      // Solicitamos acceso a la cuenta de metamask
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      console.log('Connected to metamask')

      const accounts = await window.web3.eth.getAccounts()
      return accounts[0]

    } catch (error) {
      console.log('User denied account access')
      throw new Error('User denied account access')
    }
  } else {
    console.error('Metamask is not installed. Please install MetaMask and try again.')
    throw new Error('Metamask is not installed')
  }
}

async function registerUser() {
  try {
    const account = await connectToMetaMask()

    // Creamos la instancia del contrato
    const contract = new window.web3.eth.Contract(contractABI, contractAddress)

    // Invocamos la función del contrato que registra el usuario
    await contract.methods.registerUser(name.value, dni.value).send({ from: account })

    console.log('User registered succesfully')

    // Se lleva a cabo el login del usuario
    const newUser = { name: name.value, dni: dni.value, email: email.value, password: password.value }
    localStorage.setItem('user', JSON.stringify(newUser))

    // Se añade a la lista de usuarios
    const users = JSON.parse(localStorage.getItem('users'))
    if (!users) {
      localStorage.setItem('users', JSON.stringify([newUser]))
    } else {
      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
    }

    console.log('User logged in succesfully')
    router.replace('available-cars')
  } catch (error) {
    console.error('Error registering user:', error)
  }
}

</script>