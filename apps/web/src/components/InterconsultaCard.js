import { useState } from 'react';
import { useRouter } from 'next/router';
import { ChevronDown, ChevronUp, AlertTriangle, Clock, CheckCircle2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InterconsultaCard({ interconsulta, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  const handleRespuestaVirtual = () => {
    router.push(`/interconsultas/${interconsulta._id}/respuesta-virtual`);
  };

  const getStatusColor = (estado) => {
    const colors = {
      'PENDIENTE': 'bg-amber-100 text-amber-900',
      'EN_PROCESO': 'bg-blue-100 text-blue-800',
      'COMPLETADA': 'bg-green-100 text-green-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="p-4">
        <div 
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {interconsulta.paciente?.nombre}
                </h3>
                {interconsulta.prioridad === 'ALTA' && (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <p className="text-sm text-gray-600">
                HC: {interconsulta.numeroHistoria}
              </p>
              <p className="text-sm text-gray-600">
                De: {interconsulta.servicioSolicitante?.nombre}
              </p>
              <p className="text-sm text-gray-600">
                Para: {interconsulta.servicioDestino?.nombre}
              </p>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(interconsulta.estado)}`}>
                {interconsulta.estado}
              </span>
              <span className="text-sm text-gray-500">
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
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Estado de la Interconsulta</h4>
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  <select
                    value={interconsulta.estado}
                    onChange={(e) => onStatusChange(interconsulta._id, e.target.value)}
                    disabled={updating}
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="EN_PROCESO">En Proceso</option>
                    <option value="COMPLETADA">Completada</option>
                  </select>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700">Objetivo de la Consulta</h4>
                <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  {interconsulta.objetivoConsulta}
                </p>
              </div>

              {interconsulta.estadoClinico && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Estado Clínico</h4>
                  <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    {interconsulta.estadoClinico}
                  </p>
                </div>
              )}

              {/* Only show buttons when status is EN_PROCESO */}
              {interconsulta.estado === 'EN_PROCESO' && (
                <div className="mt-6 flex justify-end space-x-4">
                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Respuesta Física');
                    }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Respuesta Física
                  </Button>
                  <Button
                    variant="default"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRespuestaVirtual();
                    }}
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Respuesta Virtual
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}