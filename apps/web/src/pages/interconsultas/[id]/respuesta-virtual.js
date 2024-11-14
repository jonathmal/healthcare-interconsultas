import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AlertTriangle } from 'lucide-react';

export default function RespuestaVirtual() {
  const router = useRouter();
  const { id } = router.query;
  const [interconsulta, setInterconsulta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [respuesta, setRespuesta] = useState('');

  useEffect(() => {
    if (id) {
      fetchInterconsulta();
    }
  }, [id]);

  const fetchInterconsulta = async () => {
    try {
      const token = window.localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/interconsultas/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      setInterconsulta(data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching interconsulta:', err);
      setError(err.message || 'Error al cargar la interconsulta');
    } finally {
      setLoading(false);
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
        minute: '2-digit',
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  if (loading || !interconsulta) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4">
          <div className="text-center py-6">Cargando interconsulta...</div>
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
        <h1 className="text-2xl font-semibold mb-6">
          Respuesta Virtual a la Interconsulta
        </h1>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <h2 className="text-xl font-semibold">
              {interconsulta.paciente?.nombre || 'Nombre no disponible'}
            </h2>
            {interconsulta.prioridad === 'ALTA' && (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <p className="text-gray-700">
              <span className="font-medium">HC:</span> {interconsulta.paciente?.numeroHistoria || 'No disponible'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">De:</span> {interconsulta.servicioSolicitante?.nombre || 'No especificado'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Para:</span> {interconsulta.servicioDestino?.nombre || 'No especificado'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Prioridad:</span> {interconsulta.prioridad || 'No especificada'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Fecha:</span> {formatFecha(interconsulta.fechaCreacion)}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Objetivo de la Consulta
              </h3>
              <p className="bg-gray-50 p-4 rounded-lg">
                {interconsulta.objetivoConsulta || 'No especificado'}
              </p>
            </div>

            {interconsulta.estadoClinico && (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Estado Clínico
                </h3>
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  {interconsulta.estadoClinico.signosVitales && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Signos Vitales</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <p className="text-gray-700">
                          <span className="font-medium">Presión Arterial:</span>{' '}
                          {interconsulta.estadoClinico.signosVitales.presionArterial}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Frecuencia Cardíaca:</span>{' '}
                          {interconsulta.estadoClinico.signosVitales.frecuenciaCardiaca}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Frecuencia Respiratoria:</span>{' '}
                          {interconsulta.estadoClinico.signosVitales.frecuenciaRespiratoria}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Temperatura:</span>{' '}
                          {interconsulta.estadoClinico.signosVitales.temperatura}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Saturación O2:</span>{' '}
                          {interconsulta.estadoClinico.signosVitales.saturacionOxigeno}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {interconsulta.estadoClinico.subjetivo && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Evaluación Subjetiva</h4>
                      <p className="text-gray-700">
                        {interconsulta.estadoClinico.subjetivo}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Área de respuesta */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Escribir Respuesta Virtual
            </h2>
            <textarea
              className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Escriba su respuesta aquí..."
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => {
                console.log('Respuesta:', respuesta);
                // Aquí irá la lógica para enviar la respuesta
              }}
            >
              Enviar Respuesta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
