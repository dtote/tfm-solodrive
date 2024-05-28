<template>
  <v-container>
    <v-sheet class="mx-auto" width="400">
      <v-form fast-fail @submit.prevent="loginUser">
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
// import userRegistryJson from './../../../build/contracts/UserRegistry.json'
import { useRouter } from 'vue-router';

console.log('Login component is being mounted')

const email = ref('')
const password = ref('')


const router = useRouter()

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

// const contractABI = userRegistryJson.abi
// const contractAddress = '0xA3812e0dEd712f41725D39900b2e0D93ac806640'

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

async function loginUser() {
  try {
    
    
    // Se establece conexión con metamask
    await connectToMetaMask()

    // Creamos la instancia del contrato
    // const contract = new window.web3.eth.Contract(contractABI, contractAddress)

    const users = JSON.parse(localStorage.getItem('users'))
    const found = users.find((user) => user.email === email.value && user.password === password.value)
    if (!found) {
      throw new Error('User not found')
    }

    // TODO: realmente no creo que sea necesario obtener los datos del usuario a traves del contrato
    // a no ser que todo se almacene alli, pero a priori no es recomendable
    // Invocamos la función del contrato que obtiene el usuario
    // await contract.methods.getUser(found.dni).send({ from: account })

    console.log('User logged in succesfully')
    router.replace('available-cars')
  } catch (error) {
    console.error('Error login user:', error)
  }
}

</script>