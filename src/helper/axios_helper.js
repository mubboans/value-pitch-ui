import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8008/valuepitch',
    // baseURL: 'https://value-pitch-server.onrender.com/valuepitch'
});

// Add a request interceptor to attach the token
axiosInstance.interceptors.request.use(
    async (config) => {
        // Retrieve the token from local storage
        let token = localStorage.getItem('token');
        if (token) {
            token = token.replace(/"/g, '')
            // Attach the token to the Authorization header if it exists
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Handle the error
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration or other responses
axiosInstance.interceptors.response.use(
    (response) => {
        // Return the response if successful
        return response;
    },
    async (error) => {
        // If the response status is 401 (Unauthorized), it may mean the token is expired
        if (error.response && error.response.status === 401) {
            console.log('Token expired or invalid');
            // Here you could implement token refresh logic if necessary
            // You might also want to log the user out or redirect them to the login page
            // localStorage.removeItem('token'); // Optionally remove the token
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
