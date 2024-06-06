<template>
  <v-container>
    <v-sheet class="mx-auto" width="400">
      <v-form fast-fail @submit.prevent="loginUser">
        <v-text-field v-model="username" label="Username"></v-text-field>
        <v-text-field 
          v-model="password" 
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" 
          :type="showPassword ? 'text' : 'password'" 
          @click:append="showPassword = !showPassword"
          label="Password"
          required>
        </v-text-field>
        <v-btn :disabled="!canLogin" color="primary" class="mt-2" type="submit" block>Login</v-btn>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router';
import API from '@/axios';

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const router = useRouter()

// Habilitamos el boton de login si se rellenan las credenciales
const canLogin = computed(() => {
  return username.value.trim().length > 0 && password.value.trim().length > 0
})


async function loginUser() {
  try {
    const response = await API.post('auth/login', {
      username: username.value,
      password: password.value
    })

    if (response.data && response.data.access_token) {
      console.log('User logged in succesfully in API')
      console.log(response)
      localStorage.setItem('jwtToken', response.data.access_token)
      router.replace('available-cars')
    } else {
      console.error('Error login user in API: ', response)
      throw new Error('Login failed due to API error')
    }
  } catch (error) {
    console.error('Login failed: ', error.response ? error.response.data : error)
    alert('Login error: ' + (error.response ? error.response.data.error : 'Unknown error'))
    throw new Error('Failed to complete the login process')
  }
}
</script>