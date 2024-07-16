import { Alert, Snackbar } from '@mui/material';
import axios from 'axios';

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
      const errorMessage = error.response.data?.message || 'API Request Error';
      // console.error(errorMessage);
      // showToast(errorMessage);

      switch (error.response.status) {
        case 401:
          // ...

          switch (error.response.status) {
            case 401:
              return (
                <Snackbar open={true} autoHideDuration={6000}>
                  <Alert severity="error">Unauthorized, please log in again</Alert>
                </Snackbar>
              );
            case 403:
              return (
                <Snackbar open={true} autoHideDuration={6000}>
                  <Alert severity="error">Access denied</Alert>
                </Snackbar>
              );
            case 404:
              return (
                <Snackbar open={true} autoHideDuration={6000}>
                  <Alert severity="error">Requested resource not found</Alert>
                </Snackbar>
              );
            case 500:
              return (
                <Snackbar open={true} autoHideDuration={6000}>
                  <Alert severity="error">Server error</Alert>
                </Snackbar>
              );
            default:
              return (
                <Snackbar open={true} autoHideDuration={6000}>
                  <Alert severity="error">{`An error occurred: ${error.response.data.message}`}</Alert>
                </Snackbar>
              );
          }
      }
    } else if (error.request) {
      console.error('Server not responding');
    } else {
      console.error('Request error', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
