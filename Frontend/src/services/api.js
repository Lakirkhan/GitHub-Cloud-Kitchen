import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_baseUrl}`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

const handleApiError = (error) => {
  console.log(error);
  throw new Error(error.response?.data?.message || "Something went wrong!");
};

export { api, handleApiError };
