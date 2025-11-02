import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Add ngrok bypass header for all requests
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

// Don't send credentials with CORS requests (required for wildcard origin)
axios.defaults.withCredentials = false;

// Request queue to limit concurrent requests (ngrok free tier limitation)
let requestQueue = [];
let activeRequests = 0;
const MAX_CONCURRENT = 2; // Limit to 2 concurrent requests for ngrok free

const processQueue = () => {
  while (activeRequests < MAX_CONCURRENT && requestQueue.length > 0) {
    const { config, resolve } = requestQueue.shift();
    activeRequests++;
    
    axios.request(config)
      .then(resolve)
      .catch(resolve)
      .finally(() => {
        activeRequests--;
        processQueue();
      });
  }
};

// Add request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add delay between requests for ngrok
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor with retry logic for 403/429 errors
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // Handle 403/429 - Rate limit (ngrok free tier)
    if ((error.response?.status === 403 || error.response?.status === 429) && !config._retry) {
      config._retry = true;
      config._retryCount = (config._retryCount || 0) + 1;
      
      // Max 2 retries
      if (config._retryCount <= 2) {
        // Wait before retry (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, config._retryCount), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return axios(config);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axios;
