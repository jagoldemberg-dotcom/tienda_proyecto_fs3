import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { LoginResponse, Usuario } from '../models/usuario.model';
import { StorageService } from './storage.service';

const USUARIOS_KEY = 'nm_usuarios';
const SESION_KEY = 'nm_sesion';

export interface OperacionUsuarioResult {
  ok: boolean;
  mensaje: string;
  usuario?: Usuario;
}

@Injectable({ providedIn: 'root' })
export class UsuarioDataService {
  constructor(private storage: StorageService, private http: HttpClient) {
    this.inicializarFallback();
  }

  private inicializarFallback(): void {
    const actuales = this.storage.getItem<Usuario[]>(USUARIOS_KEY, []);
    if (actuales.length > 0) {
      return;
    }

    this.storage.setItem<Usuario[]>(USUARIOS_KEY, [
      { id: 1, nombreCompleto: 'Administrador Principal', correo: 'admin@tienda.cl', password: 'Admin123!', rol: 'ADMIN', activo: 1 },
      { id: 2, nombreCompleto: 'Camila Soto', correo: 'camila@tienda.cl', password: 'Cliente123!', rol: 'CLIENTE', activo: 1 },
      { id: 3, nombreCompleto: 'Daniel Fuentes', correo: 'daniel@tienda.cl', password: 'Cliente123!', rol: 'CLIENTE', activo: 1 }
    ]);
  }

  obtenerUsuariosFallback(): Usuario[] {
    return this.storage.getItem<Usuario[]>(USUARIOS_KEY, []);
  }

  obtenerUsuarioPorCorreoFallback(correo: string): Usuario | undefined {
    return this.obtenerUsuariosFallback().find(u => u.correo.toLowerCase() === correo.toLowerCase());
  }

  login(correo: string, password: string): Observable<OperacionUsuarioResult> {
    return this.http.post<LoginResponse>(`${API_CONFIG.usuariosUrl}/auth/login`, { correo, password }).pipe(
      map(response => {
        const usuario: Usuario = {
          id: response.id,
          nombreCompleto: response.nombreCompleto,
          correo: response.correo,
          password,
          rol: response.rol,
          activo: 1
        };
        return { ok: true, mensaje: response.mensaje || 'Inicio de sesión correcto.', usuario };
      }),
      tap(result => this.storage.setItem<Usuario | null>(SESION_KEY, result.usuario ?? null)),
      catchError(() => of(this.loginFallback(correo, password)))
    );
  }

  private loginFallback(correo: string, password: string): OperacionUsuarioResult {
    const correoLimpio = correo.trim().toLowerCase();
    const passwordLimpio = password.trim();
    const usuario = this.obtenerUsuariosFallback().find(u => u.correo.trim().toLowerCase() === correoLimpio);

    if (!usuario || usuario.password.trim() !== passwordLimpio) {
      return { ok: false, mensaje: 'Credenciales incorrectas.' };
    }

    if (usuario.activo === 0) {
      return { ok: false, mensaje: 'El usuario está inactivo.' };
    }

    this.storage.setItem<Usuario | null>(SESION_KEY, usuario);
    return { ok: true, mensaje: 'Inicio de sesión correcto.', usuario };
  }

  logout(): void {
    this.storage.removeItem(SESION_KEY);
  }

  obtenerSesion(): Usuario | null {
    return this.storage.getItem<Usuario | null>(SESION_KEY, null);
  }

  registrarUsuario(nombreCompleto: string, correo: string, password: string): Observable<OperacionUsuarioResult> {
    const usuario = { nombreCompleto, correo, password, rol: 'CLIENTE', activo: 1 };

    return this.http.post<Usuario>(`${API_CONFIG.usuariosUrl}/usuarios`, usuario).pipe(
      map(usuarioCreado => {
        this.guardarUsuarioFallback(usuarioCreado);
        return { ok: true, mensaje: 'Usuario registrado con éxito.', usuario: usuarioCreado };
      }),
      catchError(() => of(this.registrarUsuarioFallback(nombreCompleto, correo, password)))
    );
  }

  private registrarUsuarioFallback(nombreCompleto: string, correo: string, password: string): OperacionUsuarioResult {
    const usuarios = this.obtenerUsuariosFallback();
    if (usuarios.some(u => u.correo.toLowerCase() === correo.toLowerCase())) {
      return { ok: false, mensaje: 'Ya existe una cuenta registrada con ese correo.' };
    }

    const nuevoUsuario: Usuario = {
      id: usuarios.length ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
      nombreCompleto,
      correo,
      password,
      rol: 'CLIENTE',
      activo: 1
    };
    usuarios.push(nuevoUsuario);
    this.storage.setItem(USUARIOS_KEY, usuarios);
    return { ok: true, mensaje: 'Usuario registrado con éxito.', usuario: nuevoUsuario };
  }

  actualizarPerfil(usuario: Usuario): Observable<OperacionUsuarioResult> {
    return this.http.put<Usuario>(`${API_CONFIG.usuariosUrl}/usuarios/${usuario.id}`, usuario).pipe(
      map(usuarioActualizado => {
        this.guardarUsuarioFallback(usuarioActualizado);
        this.storage.setItem<Usuario | null>(SESION_KEY, usuarioActualizado);
        return { ok: true, mensaje: 'Perfil actualizado correctamente.', usuario: usuarioActualizado };
      }),
      catchError(() => of(this.actualizarPerfilFallback(usuario)))
    );
  }

  private actualizarPerfilFallback(usuarioActualizado: Usuario): OperacionUsuarioResult {
    const usuarios = this.obtenerUsuariosFallback().map(usuario => usuario.id === usuarioActualizado.id ? usuarioActualizado : usuario);
    this.storage.setItem(USUARIOS_KEY, usuarios);
    this.storage.setItem<Usuario | null>(SESION_KEY, usuarioActualizado);
    return { ok: true, mensaje: 'Perfil actualizado correctamente.', usuario: usuarioActualizado };
  }

  recuperarPassword(correo: string): Observable<string> {
    return this.http.get<Usuario[]>(`${API_CONFIG.usuariosUrl}/usuarios`).pipe(
      map(usuarios => usuarios.some(u => u.correo.toLowerCase() === correo.toLowerCase())
        ? 'Simulación completada: se ha enviado un enlace de recuperación al correo indicado.'
        : 'No existe una cuenta asociada al correo ingresado.'),
      catchError(() => of(this.obtenerUsuarioPorCorreoFallback(correo)
        ? 'Simulación completada: se ha enviado un enlace de recuperación al correo indicado.'
        : 'No existe una cuenta asociada al correo ingresado.'))
    );
  }

  private guardarUsuarioFallback(usuario: Usuario): void {
    const usuarios = this.obtenerUsuariosFallback();
    const index = usuarios.findIndex(item => item.id === usuario.id || item.correo.toLowerCase() === usuario.correo.toLowerCase());
    if (index >= 0) {
      usuarios[index] = usuario;
    } else {
      usuarios.push(usuario);
    }
    this.storage.setItem(USUARIOS_KEY, usuarios);
  }
}
