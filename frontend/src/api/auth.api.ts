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


export const getCurrentUser = async (signal?: AbortSignal) => {
    const response = await axiosInstance.get("/users/me", { signal });
  return response.data.user;
};

export const registerRequest = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const response = await axiosInstance.post("/users/register", data);
  return response.data;
};