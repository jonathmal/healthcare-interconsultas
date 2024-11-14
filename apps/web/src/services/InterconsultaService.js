// src/services/interconsultaService.js

export const obtenerInterconsultas = async (filtros) => {
  try {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      throw new Error('No hay usuario autenticado');
    }

    const usuarioData = JSON.parse(usuario);
    if (!usuarioData.servicio?._id) {
      throw new Error('No hay servicio asociado al usuario');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    let url = '/api/interconsultas';

    // Construcción de URL según filtros
    if (filtros.tipo === 'enviadas') {
      url = `/api/interconsultas/enviadas/${usuarioData.servicio._id}`;
    } else if (filtros.tipo === 'recibidas') {
      url = `/api/interconsultas/recibidas/${usuarioData.servicio._id}`;
    }

    // Añadir estado si existe
    if (filtros.estado) {
      url += `${url.includes('?') ? '&' : '?'}estado=${filtros.estado}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error del servidor: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.exito) {
      throw new Error(data.error || 'Error al procesar los datos');
    }

    return data.data || [];

  } catch (error) {
    console.error('Error en obtenerInterconsultas:', error);
    throw error; // Re-lanzamos el error para manejarlo en el componente
  }
};