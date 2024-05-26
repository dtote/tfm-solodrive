<template>
  <v-container>
    <v-sheet class="mx-auto" width="400">
      <v-form fast-fail @submit.prevent="registerUser">
        <v-text-field
          v-model="name"
          :rules="nameRules"
          label="Name"
        ></v-text-field>

        <v-text-field
          v-model="dni"
          :rules="dniRules"
          label="DNI"
        ></v-text-field>
        <v-btn color="primary" class="mt-2" type="submit" block>Login</v-btn>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import Web3 from 'web3'

console.log('Login component is being mounted')

const name = ref('')
const dni = ref('')


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

// TODO: finalizar contrato y rellenar esto
const contractABI = []
const contractAddress = '0x..'

async function connectToMetaMask() {
  // Detectamos proveedor de metamask
  if (window.ethereum !== undefined) {
    console.log('Metamask is installed')
    window.web3 = new Web3(window.ethereum)
    try {
      // Solicitamos acceso a la cuenta de metamask
      await window.ethereum.request({ method: 'eth_requestAccounts'})
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
  } catch (error) {
    console.error('Error registering user:', error)
  }
}

</script>