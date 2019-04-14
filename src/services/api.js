import axios from 'axios'

const api = axios.create({
    baseURL: 'https://semana-omnistack-backend.herokuapp.com/'
})

export default api