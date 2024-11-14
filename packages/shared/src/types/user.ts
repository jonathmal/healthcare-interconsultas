// packages/shared/src/types/user.ts
export type RolUsuario = 'MEDICO' | 'JEFE_SERVICIO' | 'ADMIN';

export interface Usuario {
  id?: string;
  nombre: string;
  email: string;
  servicio: string; // ID del servicio
  rol: RolUsuario;
  activo: boolean;
  ultimoAcceso?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}