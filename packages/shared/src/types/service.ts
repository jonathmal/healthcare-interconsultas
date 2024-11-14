// packages/shared/src/types/service.ts
export type TipoServicio = 'MEDICINA_INTERNA' | 'CIRUGIA' | 'PEDIATRIA' | 'GINECOLOGIA' | 
                          'CARDIOLOGIA' | 'NEUROLOGIA' | 'TRAUMATOLOGIA' | 'PSIQUIATRIA';

export interface JefeServicio {
  nombre: string;
  email: string;
  telefono: string;
}

export interface Servicio {
  id?: string;
  nombre: string;
  descripcion: string;
  jefe: JefeServicio;
  tipo: TipoServicio;
  activo: boolean;
  createdAt: Date;
}