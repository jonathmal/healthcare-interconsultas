// healthcare-interconsultas/packages/shared/src/utils/apiClient.js

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';  // Changed port and removed /api

export const apiClient = {
  async fetch(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    try {
      // Add /api here
      const fullUrl = `${BASE_URL}/api${endpoint}`;
      console.log('Making request to:', fullUrl);
      console.log('Request options:', {
        ...options,
        headers: {
          ...defaultHeaders,
          ...(options.headers || {})
        }
      });

      const response = await fetch(fullUrl, {  // Use fullUrl here
        ...options,
        headers: {
          ...defaultHeaders,
          ...(options.headers || {})
        }
      });

      console.log('Response status:', response.status);
      const responseData = await response.text();
      console.log('Response data:', responseData);

      if (response.status === 401) {
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
      console.error('Request details:', {
        url: fullUrl,  // Use fullUrl here too
        options: {
          ...options,
          headers: {
            ...defaultHeaders,
            ...(options.headers || {})
          }
        }
      });
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