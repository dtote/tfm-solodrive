<template>
    <v-container>
        <v-container class="text-center py-10">
            <h1 class="display-2 font-weight-bold mb-4">SoloDrive, The Future Of Mobility</h1>
            <h2 class="text-center subtitle-1 font-weight-light mb-4"> <br> Rent an autonomous car for seamless travel
                or list your own for extra income. Enjoy secure and effortless transactions
            </h2>
        </v-container>
        <v-parallax height="400" src="@/assets/autonomous-vehicles.png" alt="Autonomous Cars">
            <v-container class="fill-height d-flex justify-center align-center text-center">
                <div>
                    <router-link to="/register">
                        <v-btn large class="white--text" @click="goToRegister">
                            Start Now!
                        </v-btn>
                    </router-link>
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
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const features = ref([
    {
        title: 'Decentralized',
        description: 'Our platform is based on the Ethereum blockchain, ensuring decentralization and security.',
        icon: 'mdi-ethereum',
    },
    {
        title: 'Eco-friendly',
        description: 'We only rent electric autonomous vehicles, taking care of the environment.',
        icon: 'mdi-leaf',
    },
    {
        title: 'Secure',
        description: 'Security is our priority, all our cars are equipped with cutting-edge technology.',
        icon: 'mdi-shield-check',
    },
]);

const router = useRouter()

function goToRegister() {
    router.replace('/register')
}

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
    /* Adjust the last value to change transparency */
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
