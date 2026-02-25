import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

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


// -------Response Interceptor-------

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(promise => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    })
    failedQueue = [];
}

axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        // Token expired
        console.log("Response interceptor triggered for error:", error);
        if (error.response?.status === 401 && !originalRequest._retry &&  !originalRequest.url?.includes("/users/refresh-token")) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                });
            }

            isRefreshing = true;

            try {
                const res = await axiosInstance.post(
                    "/users/refresh-token",
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = res.data.accessToken;
                localStorage.setItem("accessToken", newAccessToken);

                processQueue(null, newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (err) {
                processQueue(err, null);
                // localStorage.clear();
                localStorage.removeItem("accessToken");
                localStorage.removeItem("authUser");
                window.location.href = "/login";
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;