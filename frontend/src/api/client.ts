import axios from 'axios'
import type { AxiosInstance,  InternalAxiosRequestConfig } from 'axios'

const axiosInstance: AxiosInstance = axios.create({
    baseURL: "/api",
    withCredentials: true // this is because browsers are shy to send cookies or session info
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;  //otherwise site will hang
    },
    (error) => {        
        return Promise.reject(error);
    }
)

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('authUser');
            window.location.href = '/login';  //this is a property of the global window object that can be used to redirect the user to a different URL. By setting window.location.href to '/login', we are instructing the browser to navigate to the login page.
        }
        return Promise.reject(error); // this is important to propagate the error to the calling code, allowing it to handle the error appropriately (e.g., showing an error message to the user). If we don't return Promise.reject(error), the calling code will not receive the error and may assume that the request was successful, leading to potential issues in error handling.
    }
);
export default axiosInstance;