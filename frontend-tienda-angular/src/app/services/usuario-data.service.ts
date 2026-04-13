import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Usuario } from '../models/usuario.model';
const USUARIOS_KEY = 'nm_usuarios';
const SESION_KEY = 'nm_sesion';
@Injectable({ providedIn: 'root' })
export class UsuarioDataService {
  constructor(private storage: StorageService) { this.inicializar(); }
  private inicializar(): void {
    const actuales = this.storage.getItem<Usuario[]>(USUARIOS_KEY, []);
    if (actuales.length > 0) { return; }
    this.storage.setItem<Usuario[]>(USUARIOS_KEY, [
      { id: 1, nombreCompleto: 'Administrador Principal', correo: 'admin@tienda.cl', password: 'Admin123!', rol: 'ADMIN', activo: 1 },
      { id: 2, nombreCompleto: 'Camila Soto', correo: 'camila@tienda.cl', password: 'Cliente123!', rol: 'CLIENTE', activo: 1 },
      { id: 3, nombreCompleto: 'Daniel Fuentes', correo: 'daniel@tienda.cl', password: 'Cliente123!', rol: 'CLIENTE', activo: 1 }
    ]);
  }
  obtenerUsuarios(): Usuario[] { return this.storage.getItem<Usuario[]>(USUARIOS_KEY, []); }
  obtenerUsuarioPorCorreo(correo: string): Usuario | undefined { return this.obtenerUsuarios().find(u => u.correo.toLowerCase() === correo.toLowerCase()); }
  registrarUsuario(nombreCompleto: string, correo: string, password: string): { ok: boolean; mensaje: string } {
    const usuarios = this.obtenerUsuarios();
    if (usuarios.some(u => u.correo.toLowerCase() === correo.toLowerCase())) { return { ok: false, mensaje: 'Ya existe una cuenta registrada con ese correo.' }; }
    usuarios.push({ id: usuarios.length ? Math.max(...usuarios.map(u => u.id)) + 1 : 1, nombreCompleto, correo, password, rol: 'CLIENTE', activo: 1 });
    this.storage.setItem(USUARIOS_KEY, usuarios);
    return { ok: true, mensaje: 'Usuario registrado con éxito.' };
  }
  login(correo: string, password: string): { ok: boolean; mensaje: string; usuario?: Usuario } {
    const correoLimpio = correo.trim().toLowerCase();
    const passwordLimpio = password.trim();

    const usuario = this.obtenerUsuarios().find(
        u => u.correo.trim().toLowerCase() === correoLimpio
    );

    if (!usuario || usuario.password.trim() !== passwordLimpio) {
      return { ok: false, mensaje: 'Credenciales incorrectas.' };
    }

    if (usuario.activo === 0) {
      return { ok: false, mensaje: 'El usuario está inactivo.' };
    }

    this.storage.setItem<Usuario | null>(SESION_KEY, usuario);
    return { ok: true, mensaje: 'Inicio de sesión correcto.', usuario };
  }
  logout(): void { localStorage.removeItem(SESION_KEY); }
  obtenerSesion(): Usuario | null { return this.storage.getItem<Usuario | null>(SESION_KEY, null); }
  actualizarPerfil(usuarioActualizado: Usuario): void {
    const usuarios = this.obtenerUsuarios().map(usuario => usuario.id === usuarioActualizado.id ? usuarioActualizado : usuario);
    this.storage.setItem(USUARIOS_KEY, usuarios); this.storage.setItem<Usuario | null>(SESION_KEY, usuarioActualizado);
  }
  recuperarPassword(correo: string): string { return this.obtenerUsuarioPorCorreo(correo) ? 'Simulación completada: se ha enviado un enlace de recuperación al correo indicado.' : 'No existe una cuenta asociada al correo ingresado.'; }
}
