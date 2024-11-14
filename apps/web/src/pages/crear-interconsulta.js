import Layout from '../components/Layout';
import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Clock, CheckCircle2, MessageSquare } from 'lucide-react';

const CrearInterconsulta = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const servicios = [
    { id: '672e05bad3ce20d6407a5143', nombre: 'Cirugía' },
    { id: '672e099e636c9f5552583436', nombre: 'Medicina Interna' }
  ];

  const [formData, setFormData] = useState({
    paciente: {
      nombre: '',
      edad: '',
      numeroHistoria: ''
    },
    servicioSolicitante: '',
    servicioDestino: '',
    objetivoConsulta: '',
    historiaClinica: '',
    estadoClinico: {
      subjetivo: '',
      signosVitales: {
        presionArterial: '',
        frecuenciaCardiaca: '',
        frecuenciaRespiratoria: '',
        temperatura: '',
        saturacionOxigeno: ''
      }
    },
    laboratorios: {
      resultados: '',
      observaciones: ''
    },
    imagenologia: {
      tipo: '',
      descripcion: '',
      hallazgosRelevantes: ''
    },
    antecedentesPersonales: '',
    antecedentesFamiliares: '',
    alergias: '',
    medicamentos: {
      preHospitalarios: '',
      hospitalarios: ''
    },
    prioridad: 'ALTA'
  });

  const handleChange = (e, section, subsection) => {
    const { name, value } = e.target;
    
    if (section && subsection) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subsection]: {
            ...prev[section][subsection],
            [name]: value
          }
        }
      }));
    } else if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:3000/api/interconsultas/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al crear la interconsulta');
      }

      setSuccess(true);
      setFormData({
        paciente: { nombre: '', edad: '', numeroHistoria: '' },
        servicioSolicitante: '',
        servicioDestino: '',
        objetivoConsulta: '',
        historiaClinica: '',
        estadoClinico: {
          subjetivo: '',
          signosVitales: {
            presionArterial: '',
            frecuenciaCardiaca: '',
            frecuenciaRespiratoria: '',
            temperatura: '',
            saturacionOxigeno: ''
          }
        },
        laboratorios: { resultados: '', observaciones: '' },
        imagenologia: { tipo: '', descripcion: '', hallazgosRelevantes: '' },
        antecedentesPersonales: '',
        antecedentesFamiliares: '',
        alergias: '',
        medicamentos: { preHospitalarios: '', hospitalarios: '' },
        prioridad: 'ALTA'
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Crear Nueva Interconsulta</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          Interconsulta creada exitosamente
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-sm rounded-lg p-6">
          {/* Datos del Paciente */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Datos del Paciente</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.paciente.nombre}
                  onChange={(e) => handleChange(e, 'paciente')}
                  className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Edad</label>
                <input
                  type="number"
                  name="edad"
                  value={formData.paciente.edad}
                  onChange={(e) => handleChange(e, 'paciente')}
                  className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">N° de Historia Clínica</label>
                <input
                  type="text"
                  name="numeroHistoria"
                  value={formData.paciente.numeroHistoria}
                  onChange={(e) => handleChange(e, 'paciente')}
                  className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                  required
                />
              </div>
            </div>
          </div>

          {/* Servicios */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Servicios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Servicio Solicitante</label>
                <select
                  name="servicioSolicitante"
                  value={formData.servicioSolicitante}
                  onChange={(e) => setFormData(prev => ({ ...prev, servicioSolicitante: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                  required
                >
                  <option value="">Seleccione un servicio</option>
                  {servicios.map(servicio => (
                    <option key={servicio.id} value={servicio.id}>
                      {servicio.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Servicio Destino</label>
                <select
                  name="servicioDestino"
                  value={formData.servicioDestino}
                  onChange={(e) => setFormData(prev => ({ ...prev, servicioDestino: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                  required
                >
                  <option value="">Seleccione un servicio</option>
                  {servicios.map(servicio => (
                    <option key={servicio.id} value={servicio.id}>
                      {servicio.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Detalles de la Interconsulta */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Detalles de la Interconsulta</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Objetivo de la Consulta</label>
              <textarea
                name="objetivoConsulta"
                value={formData.objetivoConsulta}
                onChange={(e) => setFormData(prev => ({ ...prev, objetivoConsulta: e.target.value }))}
                rows="3"
                className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Historia Clínica</label>
              <textarea
                name="historiaClinica"
                value={formData.historiaClinica}
                onChange={(e) => setFormData(prev => ({ ...prev, historiaClinica: e.target.value }))}
                rows="3"
                className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                required
              />
            </div>
          </div>

          {/* Estado Clínico */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Estado Clínico</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Evaluación Subjetiva</label>
              <textarea
                name="subjetivo"
                value={formData.estadoClinico.subjetivo}
                onChange={(e) => handleChange(e, 'estadoClinico')}
                rows="3"
                className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                required
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Presión Arterial</label>
                <input
                  type="text"
                  name="presionArterial"
                  value={formData.estadoClinico.signosVitales.presionArterial}
                  onChange={(e) => handleChange(e, 'estadoClinico', 'signosVitales')}
                  className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">FC</label>
                <input
                  type="text"
                  name="frecuenciaCardiaca"
                  value={formData.estadoClinico.signosVitales.frecuenciaCardiaca}
                  onChange={(e) => handleChange(e, 'estadoClinico', 'signosVitales')}
                  className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">FR</label>
                <input
                  type="text"
                  name="frecuenciaRespiratoria"
                  value={formData.estadoClinico.signosVitales.frecuenciaRespiratoria}
                  onChange={(e) => handleChange(e, 'estadoClinico', 'signosVitales')}
                  className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Temperatura</label>
                <input
                  type="text"
                  name="temperatura"
                  value={formData.estadoClinico.signosVitales.temperatura}
                  onChange={(e) => handleChange(e, 'estadoClinico', 'signosVitales')}
                  className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">SatO2</label>
                <input
                  type="text"
                  name="saturacionOxigeno"
                  value={formData.estadoClinico.signosVitales.saturacionOxigeno}
                  onChange={(e) => handleChange(e, 'estadoClinico', 'signosVitales')}
                  className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                  required
                />
              </div>
            </div>
          </div>

          {/* Antecedentes */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Antecedentes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Antecedentes Personales</label>
                <textarea
                  name="antecedentesPersonales"
                  value={formData.antecedentesPersonales}
                  onChange={(e) => setFormData(prev => ({ ...prev, antecedentesPersonales: e.target.value }))}
                  rows="3"
                  className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Antecedentes Familiares</label>
                <textarea
                  name="antecedentesFamiliares"
                  value={formData.antecedentesFamiliares}
                  onChange={(e) => setFormData(prev => ({ ...prev, antecedentesFamiliares: e.target.value }))}
                  rows="3"
                  className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Alergias y Medicamentos */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Alergias y Medicamentos</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Alergias</label>
              <textarea
                name="alergias"
                value={formData.alergias}
                onChange={(e) => setFormData(prev => ({ ...prev, alergias: e.target.value }))}
                rows="2"
                className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Medicamentos Pre-hospitalarios</label>
                <textarea
                  name="preHospitalarios"
                  value={formData.medicamentos.preHospitalarios}
                  onChange={(e) => handleChange(e, 'medicamentos')}
                  rows="3"
                  className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Medicamentos Hospitalarios</label>
                <textarea
                  name="hospitalarios"
                  value={formData.medicamentos.hospitalarios}
                  onChange={(e) => handleChange(e, 'medicamentos')}
                  rows="3"
                  className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Laboratorios e Imagenología */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Estudios Complementarios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-2">Laboratorios</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Resultados</label>
                    <textarea
                      name="resultados"
                      value={formData.laboratorios.resultados}
                      onChange={(e) => handleChange(e, 'laboratorios')}
                      rows="3"
                      className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                    <textarea
                      name="observaciones"
                      value={formData.laboratorios.observaciones}
                      onChange={(e) => handleChange(e, 'laboratorios')}
                      rows="2"
                      className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-2">Imagenología</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Estudio</label>
                    <input
                      type="text"
                      name="tipo"
                      value={formData.imagenologia.tipo}
                      onChange={(e) => handleChange(e, 'imagenologia')}
                      className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                      name="descripcion"
                      value={formData.imagenologia.descripcion}
                      onChange={(e) => handleChange(e, 'imagenologia')}
                      rows="2"
                      className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hallazgos Relevantes</label>
                    <textarea
                      name="hallazgosRelevantes"
                      value={formData.imagenologia.hallazgosRelevantes}
                      onChange={(e) => handleChange(e, 'imagenologia')}
                      rows="2"
                      className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prioridad */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Prioridad</label>
            <select
              name="prioridad"
              value={formData.prioridad}
              onChange={(e) => setFormData(prev => ({ ...prev, prioridad: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-gray-300 text-black px-3 py-2"
              required
            >
              <option value="ALTA">Alta</option>
              <option value="MEDIA">Media</option>
              <option value="BAJA">Baja</option>
            </select>
          </div>

          {/* Botón de envío */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`
                px-4 py-2 rounded-md text-white font-medium
                ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}
                transition-colors duration-200
              `}
            >
              {loading ? 'Creando...' : 'Crear Interconsulta'}
            </button>
          </div>
          </form>
    </div>
  );
};

export default CrearInterconsulta;