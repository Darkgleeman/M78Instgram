import axios from 'axios';

// Create a custom instance of Axios
const axiosInstance = axios.create();

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('appToken');
      if (error.response.data.error === 'Token Expired') {
        window.location = '/expired_token';
      } else if (error.response.data.error === 'Invalid Token') {
        window.location = '/invalid_token';
      }
    }
    if (error.response && error.response.status === 413) {
      window.location = '/invalid_file';
    }
    // Return any error which is not due to authentication back to the caller
    // console.log(error);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('appToken');
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `${token}`;
    } else {
      const isLoginRequest = config.url.includes('/api/login') && config.method === 'post';
      const isRegisterRequest = config.url.includes('/api/Users') && config.method === 'post';
      const isUpload = config.url.includes('/api/Posts/UploadMedia') && config.method === 'post';
      if (isLoginRequest || isRegisterRequest || isUpload) {
        return config;
      }
      window.location = '/invalid_token';
    }
    return config;
  },
  (error) => Promise.reject(error),
);

const setHeaders = () => {
  const token = localStorage.getItem('appToken');
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = token;
  } else {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};

const addHeadersToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = token;
  }
};

const removeHeadersToken = () => {
  if (axiosInstance.defaults.headers.common.Authorization) {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};
export {
  axiosInstance, setHeaders, addHeadersToken, removeHeadersToken,
};
