import axios from 'axios';

interface DjangoApiResponse<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

interface DjangoApiRequestConfig {
  url: string;
  method: string;
  data?: any;
  headers?: any;
  skipAuth?: boolean; 
}

export const makeDjangoApiRequest = async ({
  url,
  method = 'GET',
  data,
  headers = {},
  skipAuth = false, 
}: DjangoApiRequestConfig): Promise<DjangoApiResponse<any>> => {
  try {
    const accessToken = localStorage.getItem('access_token');
    
    const authHeaders = skipAuth ? {} : {
      'Authorization': `Bearer ${accessToken}`
    };

    // Ensure the URL starts with a slash
    const endpoint = url.startsWith('/') ? url : `/${url}`;
    
    // Get the base URL from environment variables
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://www.vakaden.com/api';
    
    // Construct the full URL, ensuring no double slashes
    const fullUrl = `${API_BASE_URL.replace(/\/+$/, '')}${endpoint}`;

    const response = await axios.request({
      url: fullUrl,
      method,
      data,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...authHeaders,
        ...headers,
      }
    });

    return {
      data: response.data,
      loading: false,
      error: null
    };
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data?.detail || error.response.data?.error || error.response.data?.message || error.response.statusText;
      return {
        data: null,
        loading: false,
        error: `HTTP ${error.response.status}: ${errorMessage}`
      };
    }
    return {
      data: null,
      loading: false,
      error: error.message || 'An error occurred'
    };
  }
};
