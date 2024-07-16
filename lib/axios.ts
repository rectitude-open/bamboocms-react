import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const errorMessage = error.response.data?.message || 'API Request Error';
      console.error(errorMessage);
      // showToast(errorMessage);
    } else if (error.request) {
      console.error('Server not responding');
    } else {
      console.error('Request error', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
