const {default:axios} = require('axios');
// export const BASE_URL = 'https://alumni-network-app.onrender.com/';
export const BASE_URL = 'https://alumni-network-app-1.onrender.com/'
export const clientServer = axios.create({
    baseURL: BASE_URL,
})
