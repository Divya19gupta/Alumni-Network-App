const {default:axios} = require('axios');
// export const BASE_URL = 'https://alumni-network-app.onrender.com/';
export const BASE_URL = 'http://localhost:9090'
export const clientServer = axios.create({
    baseURL: BASE_URL,
})
