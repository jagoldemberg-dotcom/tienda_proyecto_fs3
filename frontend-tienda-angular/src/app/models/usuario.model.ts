export type RolUsuario = 'ADMIN' | 'CLIENTE';

export interface Usuario {
  id: number;
  nombreCompleto: string;
  correo: string;
  password: string;
  rol: RolUsuario;
  activo: number;
}

export interface LoginResponse {
  id: number;
  nombreCompleto: string;
  correo: string;
  rol: RolUsuario;
  mensaje: string;
}
