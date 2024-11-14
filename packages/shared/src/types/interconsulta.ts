// packages/shared/src/types/interconsulta.ts
export interface Paciente {
    nombre: string;
    edad: number;
    numeroHistoria: string;
  }
  
  export interface SignosVitales {
    presionArterial?: string;
    frecuenciaCardiaca?: string;
    frecuenciaRespiratoria?: string;
    temperatura?: string;
    saturacionOxigeno?: string;
  }
  
  export interface EstadoClinico {
    subjetivo: string;
    signosVitales: SignosVitales;
  }
  
  export interface Laboratorios {
    fechaUltimos: Date;
    resultados: string;
    observaciones?: string;
  }
  
  export interface Imagenologia {
    fecha: Date;
    tipo: string;
    descripcion: string;
    hallazgosRelevantes: string;
  }
  
  export interface Medicamentos {
    preHospitalarios: string;
    hospitalarios: string;
  }
  
  export interface Nota {
    contenido: string;
    servicio: string; // ID del servicio
    autor: string;
    fecha: Date;
  }
  
  export interface Notificacion {
    mensaje: string;
    fecha: Date;
    leida: boolean;
  }
  
  export type EstadoInterconsulta = 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADA' | 'CANCELADA';
  export type PrioridadInterconsulta = 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  
  export interface Interconsulta {
    id?: string;
    paciente: Paciente;
    servicioSolicitante: string; // ID del servicio
    servicioDestino: string; // ID del servicio
    objetivoConsulta: string;
    historiaClinica: string;
    estadoClinico: EstadoClinico;
    laboratorios: Laboratorios;
    imagenologia: Imagenologia;
    antecedentesPersonales: string;
    antecedentesFamiliares: string;
    alergias: string;
    medicamentos: Medicamentos;
    estado: EstadoInterconsulta;
    prioridad: PrioridadInterconsulta;
    notas: Nota[];
    notificaciones: Notificacion[];
    fechaCreacion: Date;
    fechaActualizacion: Date;
  }