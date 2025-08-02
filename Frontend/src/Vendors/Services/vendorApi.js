import axios from "axios";

const vendorApi = axios.create({
  baseURL: `${import.meta.env.VITE_baseUrl}`,
});

vendorApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log(token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Token set",config.headers.Authorization);
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

const handleApiError = (error) => {
  console.log(error);
  throw new Error(error.response?.data?.message || "Something went wrong!");
};

export { vendorApi, handleApiError };
