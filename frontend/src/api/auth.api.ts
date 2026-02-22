import axiosInstance from "./client";

type loginPayload = {
    email: string;
    password: string;
}

type loginResponse = {
    accessToken: string;

    user: {
        username: string;
        email: string;
    }
}

export const loginRequest = async (payload: loginPayload): Promise<loginResponse> => {
    const response = await axiosInstance.post("/users/login", payload);
    return response.data;
}
