const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sistema-interconsultas-api-4c601dfcf805.herokuapp.com';

export const apiClient = {
  async fetch(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };

    try {
      const fullUrl = `${BASE_URL}${endpoint}`;
      console.log('Making request to:', fullUrl); // For debugging
      
      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error en la petición');
      }

      return await response.json();
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