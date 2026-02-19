import axios from 'axios'
import type { AxiosInstance,  InternalAxiosRequestConfig } from 'axios'

const axiosInstance: AxiosInstance = axios.create({
    baseURL: "/",
    withCredentials: true // this is because browsers are shy to send cookies or session info
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;  //otherwise site will hang
    },
    (error) => {        
        return Promise.reject(error);
    }
)

export default axiosInstance