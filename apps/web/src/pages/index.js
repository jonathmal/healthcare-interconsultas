import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronDown, ChevronUp, AlertTriangle, Clock, CheckCircle2, MessageSquare } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const CollapsibleSection = ({ title, count, children }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <button
        className="w-full px-4 py-3 flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <span className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
            {count}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>
      {isExpanded && <div className="p-4 border-t border-gray-100">{children}</div>}
    </div>
  );
};

const VerInterconsultas = () => {
  const router = useRouter();
  const [interconsultasEnviadas, setInterconsultasEnviadas] = useState([]);
  const [interconsultasRecibidas, setInterconsultasRecibidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [filtros, setFiltros] = useState({
    estado: '',
    prioridad: '',
    servicio: ''
  });

  const formatSignoVitalLabel = (key) => {
    const labels = {
      'presionArterial': 'Presión Arterial',
      'frecuenciaCardiaca': 'Frecuencia Cardíaca',
      'frecuenciaRespiratoria': 'Frecuencia Respiratoria',
      'temperatura': 'Temperatura',
      'saturacionOxigeno': 'Saturación de Oxígeno'
    };
    return labels[key] || key;
  };

  const fetchServicios = async () => {
    try {
      const token = window.localStorage.getItem('token');
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/servicios`;
  
      console.log('Fetching services from:', apiUrl);
      console.log('Using token:', token);
  
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al cargar servicios:', response.status, response.statusText, errorText);
        throw new Error('Error al cargar servicios');
      }
  
      const data = await response.json();
      if (data.exito) {
        setServicios(data.data);
      }
    } catch (error) {
      console.error('Error fetching servicios:', error);
      setError(error.message || 'Error al cargar servicios');
    }
  };

  const fetchInterconsultas = async () => {
    try {
      const token = window.localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
  
      setLoading(true);

      // Get the service ID - THIS IS NEW
      const servicioId = usuario?.servicio?._id || usuario?.servicio;
      
      console.log('Usuario servicio:', {
        completo: usuario?.servicio,
        id: servicioId,
        esperado: '672e05bad3ce20d6407a5143' // ID de Cirugia
      });

      if (!servicioId) {
        console.error('No service ID found for user');
        setError('Error: Usuario sin servicio asignado');
        return;
      }

      const queryParams = new URLSearchParams();
      if (filtros.estado) queryParams.set('estado', filtros.estado);
      if (filtros.prioridad) queryParams.set('prioridad', filtros.prioridad);
      if (filtros.servicio) queryParams.set('servicio', filtros.servicio);

      const enviadasUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/interconsultas/filtrar?${queryParams}&tipoFiltro=enviadas&servicioSolicitante=${servicioId}`;
      const recibidasUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/interconsultas/filtrar?${queryParams}&tipoFiltro=recibidas&servicioDestino=${servicioId}`;

      console.log('URLs:', {
        enviadas: enviadasUrl,
        recibidas: recibidasUrl
      });

      const [responseEnviadas, responseRecibidas] = await Promise.all([
        fetch(enviadasUrl, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(recibidasUrl, {
          headers: { 'Authorization': `Bearer ${token}` },
        })
      ]);

      const [dataEnviadas, dataRecibidas] = await Promise.all([
        responseEnviadas.json(),
        responseRecibidas.json()
      ]);

      // Add verification of service IDs in results - THIS IS NEW
      console.log('Verificación de servicios:', {
        enviadas: dataEnviadas.data?.map(ic => ({
          id: ic.servicioSolicitante?._id,
          nombre: ic.servicioSolicitante?.nombre,
          coincide: ic.servicioSolicitante?._id === servicioId
        })),
        recibidas: dataRecibidas.data?.map(ic => ({
          id: ic.servicioDestino?._id,
          nombre: ic.servicioDestino?.nombre,
          coincide: ic.servicioDestino?._id === servicioId
        }))
      });

      setInterconsultasEnviadas(Array.isArray(dataEnviadas.data) ? dataEnviadas.data : []);
      setInterconsultasRecibidas(Array.isArray(dataRecibidas.data) ? dataRecibidas.data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching interconsultas:', err);
      setError(err.message || 'Error al cargar las interconsultas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const usuarioData = JSON.parse(usuarioGuardado);
        setUsuario(usuarioData);
        console.log('Usuario servicio:', usuarioData.servicio);
        if (usuarioData.rol === 'ADMIN') {
          fetchServicios();
        }
      } catch (error) {
        console.error('Error al procesar datos del usuario:', error);
        setError('Error al cargar la información del usuario');
      }
    } else {
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    if (usuario) {
      fetchInterconsultas();
    }
  }, [filtros, usuario]);

  const InterconsultaCard = ({ interconsulta, onStatusChange }) => {
    const [expanded, setExpanded] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState(null);

    const handleRespuestaVirtual = (e) => {
      e.preventDefault();
      e.stopPropagation();
      router.push(`/interconsultas/${interconsulta._id}/respuesta-virtual`);
    };

    const handleRespuestaFisica = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Respuesta Física clickeada');
    };

    if (loading && interconsultasEnviadas.length === 0 && interconsultasRecibidas.length === 0) {
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto p-4">
            <div className="text-center py-6">Cargando interconsultas...</div>
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto p-4">
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }  
  
const handleStatusChange = async (newStatus) => {
  if (updating) return;
  
  try {
    setUpdating(true);
    setUpdateError(null);
    const token = window.localStorage.getItem('token');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/interconsultas/${interconsulta._id}/estado`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ estado: newStatus })
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el estado');
    }

    const data = await response.json();
    if (data.exito) {
      onStatusChange();
    }
  } catch (error) {
    console.error('Error:', error);
    setUpdateError('Error al actualizar el estado');
  } finally {
    setUpdating(false);
  }
};

    const getStatusColor = (estado) => {
      const colors = {
        'PENDIENTE': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'EN_PROCESO': 'bg-blue-100 text-blue-800 border-blue-200',
        'COMPLETADA': 'bg-green-100 text-green-800 border-green-200'
      };
      return colors[estado] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getPriorityIcon = (prioridad) => {
      switch (prioridad) {
        case 'ALTA':
          return <AlertTriangle className="h-5 w-5 text-red-500" />;
        case 'MEDIA':
          return <Clock className="h-5 w-5 text-yellow-500" />;
        case 'BAJA':
          return <CheckCircle2 className="h-5 w-5 text-green-500" />;
        default:
          return null;
      }
    };

    const formatFecha = (fecha) => {
      try {
        return new Date(fecha).toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return 'Fecha inválida';
      }
    };

    if (!interconsulta || !interconsulta.paciente) {
      return null;
    }

    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
        <div className="p-4">
          <div className="cursor-pointer select-none" onClick={() => setExpanded(!expanded)}>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h2 className="text-black font-semibold">
                    {interconsulta.paciente?.nombre}
                  </h2>
                  {getPriorityIcon(interconsulta.prioridad)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-800">
                    HC: {interconsulta.paciente?.numeroHistoria}
                  </p>
                  <p className="text-sm text-gray-800">
                    De: {interconsulta.servicioSolicitante?.nombre}
                  </p>
                  <p className="text-sm text-gray-800">
                    Para: {interconsulta.servicioDestino?.nombre}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(interconsulta.estado)}`}>
                  {interconsulta.estado}
                </span>
                <span className="text-xs text-gray-500">
                  {formatFecha(interconsulta.fechaCreacion)}
                </span>
                {expanded ? 
                  <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                }
              </div>
            </div>
          </div>

          {expanded && (
  <div className="mt-4 pt-4 border-t border-gray-100">
    <div className="grid gap-6">
      {/* Buttons section - only show for EN_PROCESO status */}
      {interconsulta.estado === 'EN_PROCESO' && (
        <div className="border-b border-gray-100 pb-4">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              onClick={handleRespuestaFisica}
            >
              <CheckCircle2 className="h-4 w-4" />
              Respuesta Física
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              onClick={handleRespuestaVirtual}
            >
              <MessageSquare className="h-4 w-4" />
              Respuesta Virtual
            </button>
          </div>
        </div>
      )}

                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-gray-900">Estado de la Interconsulta</h3>
                    <p className="text-sm text-gray-800">Estado actual: {interconsulta.estado}</p>
                    {updateError && (
                      <p className="text-sm text-red-600">{updateError}</p>
                    )}
                  </div>
                  <select
                    value={interconsulta.estado}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={updating}
                    className={`
                      rounded-md border border-gray-300 px-3 py-2 text-gray-700 
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${updating ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="EN_PROCESO">En Proceso</option>
                    <option value="COMPLETADA">Completada</option>
                  </select>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Objetivo de la Consulta</h3>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                    {interconsulta.objetivoConsulta}
                  </p>
                </div>

                {interconsulta.estadoClinico && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Estado Clínico</h3>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                        {interconsulta.estadoClinico.subjetivo}
                      </p>
                    </div>

                    {interconsulta.estadoClinico.signosVitales && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Signos Vitales</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {Object.entries(interconsulta.estadoClinico.signosVitales).map(([key, value]) => (
                            <div key={key} className="bg-gray-50 p-3 rounded">
                              <p className="text-xs text-gray-700 mb-1">
                                {formatSignoVitalLabel(key)}
                              </p>
                              <p className="text-sm font-medium text-black">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {(interconsulta.laboratorios || interconsulta.imagenologia) && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {interconsulta.laboratorios && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Laboratorios</h3>
                        <div className="bg-gray-50 p-3 rounded space-y-2">
                          <p className="text-sm text-black">{interconsulta.laboratorios.resultados}</p>
                          {interconsulta.laboratorios.observaciones && (
                            <p className="text-sm text-black">
                              Nota: {interconsulta.laboratorios.observaciones}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {interconsulta.imagenologia && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Imagenología</h3>
                        <div className="bg-gray-50 p-3 rounded space-y-2">
                        <p className="text-sm font-medium text-black">{interconsulta.imagenologia.tipo}</p>
                          <p className="text-sm text-black">{interconsulta.imagenologia.hallazgosRelevantes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading && interconsultasEnviadas.length === 0 && interconsultasRecibidas.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4">
          <div className="text-center py-6">Cargando interconsultas...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="mb-6 flex flex-wrap gap-4 relative z-50">
          <Select
            value={filtros.estado}
            onValueChange={(value) => setFiltros(prev => ({ 
              ...prev, 
              estado: value === "todos" ? "" : value 
            }))}
          >
            <SelectTrigger className="w-[200px] bg-white border-gray-200">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent 
              className="bg-white border border-gray-200 shadow-lg" 
              style={{ backgroundColor: 'white' }}
            >
              <SelectItem value="todos" className="text-gray-900 hover:bg-gray-100 bg-white">
                Mostrar Todo
              </SelectItem>
              <SelectItem value="PENDIENTE" className="text-gray-900 hover:bg-gray-100 bg-white">
                Pendiente
              </SelectItem>
              <SelectItem value="EN_PROCESO" className="text-gray-900 hover:bg-gray-100 bg-white">
                En Proceso
              </SelectItem>
              <SelectItem value="COMPLETADA" className="text-gray-900 hover:bg-gray-100 bg-white">
                Completada
              </SelectItem>
              <SelectItem value="CANCELADA" className="text-gray-900 hover:bg-gray-100 bg-white">
                Cancelada
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filtros.prioridad}
            onValueChange={(value) => setFiltros(prev => ({ 
              ...prev, 
              prioridad: value === "todos" ? "" : value 
            }))}
          >
            <SelectTrigger className="w-[200px] bg-white border-gray-200">
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent 
              className="bg-white border border-gray-200 shadow-lg"
              style={{ backgroundColor: 'white' }}
            >
              <SelectItem value="todos" className="text-gray-900 hover:bg-gray-100 bg-white">
                Mostrar Todo
              </SelectItem>
              <SelectItem value="ALTA" className="text-gray-900 hover:bg-gray-100 bg-white">
                Alta
              </SelectItem>
              <SelectItem value="MEDIA" className="text-gray-900 hover:bg-gray-100 bg-white">
                Media
              </SelectItem>
              <SelectItem value="BAJA" className="text-gray-900 hover:bg-gray-100 bg-white">
                Baja
              </SelectItem>
            </SelectContent>
          </Select>

          {usuario?.rol === 'ADMIN' && (
            <Select
              value={filtros.servicio}
              onValueChange={(value) => setFiltros(prev => ({ 
                ...prev, 
                servicio: value === "todos" ? "" : value 
              }))}
            >
              <SelectTrigger className="w-[200px] bg-white border-gray-200">
                <SelectValue placeholder="Servicio" />
              </SelectTrigger>
              <SelectContent 
                className="bg-white border border-gray-200 shadow-lg"
                style={{ backgroundColor: 'white' }}
              >
                <SelectItem value="todos" className="text-gray-900 hover:bg-gray-100 bg-white">
                  Mostrar Todo
                </SelectItem>
                {servicios.map((servicio) => (
                  <SelectItem 
                    key={servicio._id} 
                    value={servicio._id}
                    className="text-gray-900 hover:bg-gray-100 bg-white"
                  >
                    {servicio.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="relative z-0 space-y-6">
          <CollapsibleSection 
            title="Interconsultas Enviadas" 
            count={interconsultasEnviadas.length}
          >
            {interconsultasEnviadas.length === 0 ? (
              <div className="text-center py-4 text-gray-600">
                No hay interconsultas enviadas para mostrar
              </div>
            ) : (
              <div className="space-y-4">
                {interconsultasEnviadas.map(interconsulta => (
                  interconsulta && interconsulta._id ? (
                    <InterconsultaCard 
                      key={interconsulta._id} 
                      interconsulta={interconsulta}
                      onStatusChange={fetchInterconsultas}
                    />
                  ) : null
                ))}
              </div>
            )}
          </CollapsibleSection>

          <CollapsibleSection 
            title="Interconsultas Recibidas" 
            count={interconsultasRecibidas.length}
          >
            {interconsultasRecibidas.length === 0 ? (
              <div className="text-center py-4 text-gray-600">
                No hay interconsultas recibidas para mostrar
              </div>
            ) : (
              <div className="space-y-4">
                {interconsultasRecibidas.map(interconsulta => (
                  interconsulta && interconsulta._id ? (
                    <InterconsultaCard 
                      key={interconsulta._id} 
                      interconsulta={interconsulta}
                      onStatusChange={fetchInterconsultas}
                    />
                  ) : null
                ))}
              </div>
            )}
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
};

export default VerInterconsultas;