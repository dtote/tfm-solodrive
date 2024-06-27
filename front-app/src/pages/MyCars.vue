<template>
<v-container>
    <PagesBar/>
    <v-container>
        <v-row justify="center" class="mb-5">
            <v-btn color="primary" @click="goToCarRegister">Publish new car</v-btn>
        </v-row>
        <v-row dense>
            <v-col class="text-center" cols="12" sm="6" md="4" v-for="(column, index) in columns" :key="index">
                <v-card variant="outlined" class="car-card mx-2 my-2" v-for="car in column" :key="car.plate">
                    <v-img :src="car.imageUrl" class="car-image" aspect-ratio="2.5">
                    </v-img>
                    <v-card-title class="justify-center">{{ car.model }} - {{ car.price }}$ / day</v-card-title>
                    <v-card-text class="text-center">
                        <div class="mb-1">Plate: <strong>{{ car.plate }}</strong></div>
                        <div>Autonomy: <strong>{{ car.autonomy }}km</strong></div>
                    </v-card-text>
                    <v-btn flat color="red" class="mb-2" :disabled="!car.available" @click="deleteOwnerCar(car.plate)">
                        <template v-if="car.available">
                            Delete
                            <v-icon class="ml-2">mdi-trash-can-outline</v-icon>
                        </template>
                        <template v-else>
                            Currently in use
                            <v-icon class="ml-2">mdi-lock-outline</v-icon>
                        </template>
                    </v-btn>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import Web3 from 'web3'
import API from '@/axios';

const ownerCars = ref([])
const columns = computed(() => {
    const col = [[], [], []]
    let currentColumnIndex = 0
    ownerCars.value.forEach((car) => {
        col[currentColumnIndex].push(car)
        currentColumnIndex = (currentColumnIndex + 1) % 3
    })
    return col
})

const router = useRouter()
const goToCarRegister = () => router.push('/cars/register')

async function getOwnerAccount() {
    if (!window.ethereum) {
        console.error("Please install MetaMask!");
        return;
    }
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    return account
}

async function deleteOwnerCar(plate) {
    try {
        const owner = await getOwnerAccount()

        await API.delete(`cars/${plate}`, { params: { owner }})
        await getOwnerCars();
    } catch (error) {
        console.error('Failed deleting car: ', error)
    }
}

async function getOwnerCars() {
    try {
        const owner = await getOwnerAccount()

        const { data: cars } = await API.get(`cars/owned/${owner}`)
        ownerCars.value = cars
    } catch (error) {
        console.error('Failed to load owner cars: ', error)
    }
}

onMounted(async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await getOwnerCars();
    } else {
        console.error("Please install MetaMask!");
    }
})
</script>