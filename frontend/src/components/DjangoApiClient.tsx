import axios from 'axios';

interface DjangoApiResponse<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

interface DjangoApiRequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
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

    // Remove the /api prefix since we're no longer using it
    const fullUrl = url.startsWith('/') ? url : `/${url}`;

    const response = await axios({
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
