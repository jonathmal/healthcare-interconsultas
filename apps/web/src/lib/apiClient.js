// lib/apiClient.js or utils/apiClient.js
const BASE_URL = 'https://sistema-interconsultas-api-4c601dfcf805.herokuapp.com';

export const apiClient = {
  async fetch(endpoint, options = {}) {
    try {
      const token = localStorage.getItem('token');
      
      // Make sure endpoint starts with a slash
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      // Add /api prefix if not present
      const apiEndpoint = cleanEndpoint.startsWith('/api') ? cleanEndpoint : `/api${cleanEndpoint}`;
      // Construct full URL
      const fullUrl = `${BASE_URL}${apiEndpoint}`;
      
      console.log('Making request to:', fullUrl); // Debug log
      
      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers
        }
      });

      console.log('Response status:', response.status); // Debug log

      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error en la petición');
      }

      const data = await response.json();
      console.log('Response data:', data); // Debug log
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  post(endpoint, data) {
    return this.fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};