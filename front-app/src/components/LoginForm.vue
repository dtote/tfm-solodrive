<template>
  <v-container>
    <v-sheet class="mx-auto" width="400">
      <v-form fast-fail @submit.prevent="registerUser">
        <v-text-field v-model="email" :rules="emailRules" label="Email" placeholder="user@example.com"></v-text-field>

        <!-- El tipo password no parece dejar que se comprueben las reglas -->
        <v-text-field type="password" v-model="password" :rules="passwordRules" label="Password"></v-text-field>
        <v-btn color="primary" class="mt-2" type="submit" block>Login</v-btn>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import Web3 from 'web3'

console.log('Login component is being mounted')

const email = ref('')
const password = ref('')


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

// TODO: repensar todo esto para el login, probablemente sea un get.
const contractABI = []
const contractAddress = '0x..'

async function connectToMetaMask() {
  // Detectamos proveedor de metamask
  if (window.ethereum !== undefined) {
    console.log('Metamask is installed')
    window.web3 = new Web3(window.ethereum)
    try {
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
  } catch (error) {
    console.error('Error registering user:', error)
  }
}

</script>