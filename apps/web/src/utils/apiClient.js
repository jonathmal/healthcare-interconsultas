// healthcare-interconsultas/apps/web/src/utils/apiClient.js

const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  }
  // Client-side
  return window.ENV_CONFIG?.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
};

export const apiClient = {
  async fetch(endpoint, options = {}) {
    // Move token access inside try block since localStorage is only available client-side
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      const baseUrl = getBaseUrl();
      const fullUrl = `${baseUrl}/api${endpoint}`;
      
      console.log('Making request to:', fullUrl);
      console.log('Request options:', {
        ...options,
        headers: {
          ...defaultHeaders,
          ...(options.headers || {})
        }
      });

      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...(options.headers || {})
        }
      });

      console.log('Response status:', response.status);
      const responseData = await response.text();
      console.log('Response data:', responseData);

      if (response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return {};
      }

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status} - ${responseData}`);
      }

      return responseData ? JSON.parse(responseData) : null;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  get(endpoint) {
    return this.fetch(endpoint);
  },

  post(endpoint, data) {
    return this.fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  put(endpoint, data) {
    return this.fetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  delete(endpoint) {
    return this.fetch(endpoint, {
      method: 'DELETE'
    });
  }
};