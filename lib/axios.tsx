import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
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
      switch (error.response.status) {
        case 401:
          enqueueSnackbar('Unauthorized, please log in again', { variant: 'error', autoHideDuration: 6000 });
        case 403:
          enqueueSnackbar('Access denied', { variant: 'error', autoHideDuration: 6000 });
        case 404:
          enqueueSnackbar('Resource not found', { variant: 'error', autoHideDuration: 6000 });
        case 500:
          enqueueSnackbar('Internal server error', { variant: 'error', autoHideDuration: 6000 });
        default:
          const errorMessage = error.response.data?.message || 'API Request Error';
          enqueueSnackbar(errorMessage, { variant: 'error', autoHideDuration: 6000 });
      }
    } else if (error.request) {
      enqueueSnackbar('No response from server', { variant: 'error', autoHideDuration: 6000 });
    } else {
      enqueueSnackbar(error.message, { variant: 'error', autoHideDuration: 6000 });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;