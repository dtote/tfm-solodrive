<template>
  <v-container>
    <v-sheet class="mx-auto" width="400">
      <v-form ref="form" v-model="valid" fast-fail @submit.prevent="publishCar">
        <v-text-field v-model="car.model" :rules="modelRules" label="Model" placeholder="Tesla Model Y"></v-text-field>
        <v-text-field v-model="car.plate" :rules="plateRules" label="Plate" placeholder="1234-ABC"></v-text-field>
        <v-text-field v-model="car.autonomy" :rules="autonomyRules" label="Autonomy (km)" placeholder="250"></v-text-field>
        <v-text-field v-model="car.price" :rules="priceRules" label="Price ($)" placeholder="40"></v-text-field>
        <v-file-input 
          label="Upload a clear clear photo of the vehicule" 
          variant="underlined" 
          accept="image/*"
          prepend-icon="mdi-camera"
          @change="handleFileUpload">
        </v-file-input>
        <div v-if="previewSrc">
          <img :src="previewSrc" alt="Image Preview" style="max-width: 100%">
        </div>
        <v-btn :disabled="!valid || !isFileUploaded" color="primary" class="mt-2" type="submit" block>Publish</v-btn>
        <v-btn color="red" class="mt-2" @click="goToAvailableCars" block>Cancel</v-btn>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import Web3 from 'web3'
import { useRouter } from 'vue-router'
import API from '../axios'

// Variables de estado
const car = ref({
  model: '',
  plate: '',
  autonomy: '',
  price: '',
  owner: '',
  imageUrl: ''
})
const file = ref(null)
const isFileUploaded = ref(null)
const previewSrc = ref(null)
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
  value => /^\d*$/.test(value) || 'Car autonomy must be a number',
  value => value > 0 || 'Car autonomy must be greater than 0'
]
const priceRules = [
  value => !!value || 'Car price is required',
  value => /^\d*$/.test(value) || 'Car price must be a number'
]

const goToAvailableCars = () => router.push('/cars/available')

const handleFileUpload = (event) => {
  const selectedFile = event.target.files[0]
  if (selectedFile) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewSrc.value = e.target.result
    }
    reader.readAsDataURL(selectedFile)

    file.value = selectedFile
    isFileUploaded.value = true
  } else {
    isFileUploaded.value = false
  }
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

const createFormData = (file, newFileName) => {
  const formData = new FormData()
  formData.append('file', new Blob([file.value], { type: file.value.type }), newFileName)
  return formData
}

async function publishCar() {
  try {
    // Establecemos el propietario del vehiculo
    const account = await connectToMetaMask()
    car.value.owner = account
    
    // Subimos la imagen del coche
    const filename = `${car.value.plate}.${file.value.name.split('.').pop()}`
    await API.post('/cars/image', createFormData(file, filename), { headers: { 'Content-Type': 'multipart/form-data' }})

    // Seteamos la url de la imagen subida
    car.value.imageUrl = `${API.defaults.baseURL}/uploads/${filename}`

    // Registramos el coche en la bbdd
    await API.post('/cars', car.value)

    // Redirigimos a pantalla de vehiculos disponibles
    router.replace('available')

  } catch (error) {
    console.error('Car publication error:', error.response ? error.response.data : error)
    alert('Car publication error: ' + (error.response ? error.response.data.message : 'Unknown error'))
  }
}

</script>