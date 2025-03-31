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
        case 403:
          enqueueSnackbar('Access denied', { variant: 'error', autoHideDuration: 6000 });
          break;
        case 404:
          enqueueSnackbar('Page not found', { variant: 'error', autoHideDuration: 6000 });
          break;
        case 422: {
          const errorMessages = (error.response.data?.error?.messages as string[]) || ['Validation Error'];
          enqueueSnackbar(errorMessages.join('\n'), {
            variant: 'error',
            autoHideDuration: 7000,
            style: { whiteSpace: 'pre-line' },
          });
          break;
        }
        case 500:
          enqueueSnackbar('Internal server error', { variant: 'error', autoHideDuration: 6000 });
          break;
        default: {
          const errorMessage = error.response.data?.message || 'API Request Error';
          enqueueSnackbar(errorMessage, { variant: 'error', autoHideDuration: 6000 });
        }
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
