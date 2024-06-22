<template>
    <v-container>
        <PagesBar/>
        <v-container>
            <v-row justify="center" class="mt-5">
                <v-btn color="red" @click="logout">Logout</v-btn>
            </v-row>
    </v-container>
</v-container>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()
const goToLogin = () => router.push('/') 

function logout() {
    localStorage.removeItem('jwtToken')
    sessionStorage.clear()
    goToLogin()
}
</script>