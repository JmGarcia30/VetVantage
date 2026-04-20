// Axios setup to talk to your backend
import axios from 'axios';

const API = axios.create({
  // This pulls the URL from your frontend/.env file
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', 
});

// Intercept requests and attach the token if it exists in local storage
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;