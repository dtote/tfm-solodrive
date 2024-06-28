<template>
    <v-container>
        <v-container class="text-center py-10">
            <h1 class="display-2 font-weight-bold mb-4">SoloDrive, The Future Of Mobility</h1>
            <h2 class="text-center subtitle-1 font-weight-light mb-4"> <br> Rent an autonomous car for trouble-free, all day trips
                or share your own for extra income. Enjoy fast, secure and effortless transactions.
            </h2>
        </v-container>
        <v-parallax height="400" src="@/assets/autonomous-vehicles.png" alt="Autonomous Cars">
            <v-container class="fill-height d-flex justify-center align-center text-center">
                <div>
                    <v-btn large class="white--text" @click="goToRegister">
                        Start Now!
                    </v-btn>
                </div>
            </v-container>
        </v-parallax>
        <v-container class="my-12">
            <v-row>
                <v-col v-for="feature in features" :key="feature.title" cols="12" md="4" class="text-center">
                    <v-icon large color="primary">
                        {{ feature.icon }}
                    </v-icon>
                    <h2 class="font-weight-medium my-4">{{ feature.title }}</h2>
                    <p>{{ feature.description }}</p>
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const loggedIn = ref(!!localStorage.getItem('user'))
const features = ref([
    {
        title: 'Decentralized',
        description: 'Our platform is based on the blockchain technology, ensuring decentralization and security. All rental payments are secure and processed through the Ethereum blockchain, providing transparency and eliminating the need for intermediaries.',
        icon: 'mdi-ethereum',
    },
    {
        title: 'Eco-friendly',
        description: 'We only rent electric autonomous vehicles, taking care of the environment. We only allow listings for electric vehicles, preferably autonomous, as part of our commitment to the environment, ensuring a greener future.',
        icon: 'mdi-leaf',
    },
    {
        title: 'Secure',
        description: 'Security is our priority. All transactions are protected by blockchain technology, ensuring that rental agreements are immutable and transparent. This provides peace of mind for both renters and owners.',
        icon: 'mdi-shield-check',
    },
]);

const router = useRouter()

function goToRegister() {
    router.replace('/register')
}

onMounted(loggedIn, () => {
    if (loggedIn) {
        router.replace('/available-cars')
    }
})
watch(loggedIn, (newVal) => {
    if (newVal) {
        router.replace('/available-cars')
    }
})
</script>

<style scoped>
.text-center {
    text-align: center;
}

.fill-height {
    height: 100%;
}

.parallax-image {
    position: relative;
}

.parallax-image::before {
    content: "";
    background: rgba(255, 255, 255, 0.5);
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
}

.v-btn {
    font-size: 1.2rem;
}
</style>
