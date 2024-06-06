import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json'
    }
})

API.interceptors.request.use(function (config) {
    const token = localStorage.getItem('jwtToken')
    config.headers.Authorization = token ? `Bearer ${token}` : ''
    return config
})

export default API