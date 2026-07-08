import axios from "axios";

const api = axios.create({
  baseURL: "https://reoccupy-evade-hexagon.ngrok-free.dev",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;