import axios from "axios";

export const httpClient = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {

    return Promise.reject(error);
  }
);
