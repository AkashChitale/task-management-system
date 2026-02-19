import axios from 'axios'
import type { AxiosInstance,  InternalAxiosRequestConfig } from 'axios'

const axiosInstance: AxiosInstance = axios.create({
    baseURL: "/api",
    withCredentials: true // this is because browsers are shy to send cookies or session info
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTgzNGU0ODE1MTliYWJmMWU4ZjMyOTciLCJlbWFpbCI6ImFrYXNoMUBnbWFpbC5jb20iLCJpYXQiOjE3NzE1MTA5NDUsImV4cCI6MTc3MTU5NzM0NX0.vEJJJ1d9rmuDVNLrtA7CMx9r4H1suvspRn2_gix6m-8"
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