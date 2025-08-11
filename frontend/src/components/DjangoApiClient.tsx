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

   const fullUrl = url.startsWith('/') ? url : `/${url}`;

    const response = await axios.request({
      url: 'http://0.0.0.0:8000' + fullUrl,
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
