import axios from 'axios';
import{ store} from '../app/store.js';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
});


api.interceptors.request.use((config) => {
    const token = store.getState().auth.token;

    
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config; 
}, (error) => {
    
    return Promise.reject(error);
});

export default api;