import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { UsuarioDataService } from './usuario-data.service';
import { API_CONFIG } from '../config/api.config';

describe('UsuarioDataService', () => {
  let service: UsuarioDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(UsuarioDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debe iniciar sesión usando el microservicio', done => {
    service.login('admin@tienda.cl', 'Admin123!').subscribe(result => {
      expect(result.ok).toBeTrue();
      expect(result.usuario?.rol).toBe('ADMIN');
      expect(service.obtenerSesion()?.correo).toBe('admin@tienda.cl');
      done();
    });

    const req = httpMock.expectOne(`${API_CONFIG.usuariosUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 1, nombreCompleto: 'Admin', correo: 'admin@tienda.cl', rol: 'ADMIN', mensaje: 'OK' });
  });

  it('debe usar fallback local cuando el backend no responde', done => {
    service.login('camila@tienda.cl', 'Cliente123!').subscribe(result => {
      expect(result.ok).toBeTrue();
      expect(result.usuario?.rol).toBe('CLIENTE');
      done();
    });

    httpMock.expectOne(`${API_CONFIG.usuariosUrl}/auth/login`).error(new ProgressEvent('error'));
  });

  it('debe rechazar credenciales incorrectas en fallback', done => {
    service.login('camila@tienda.cl', 'mala').subscribe(result => {
      expect(result.ok).toBeFalse();
      expect(result.mensaje).toContain('Credenciales');
      done();
    });

    httpMock.expectOne(`${API_CONFIG.usuariosUrl}/auth/login`).error(new ProgressEvent('error'));
  });

  it('debe registrar usuario usando API', done => {
    service.registrarUsuario('Nuevo Cliente', 'nuevo@tienda.cl', 'Cliente123!').subscribe(result => {
      expect(result.ok).toBeTrue();
      expect(result.usuario?.correo).toBe('nuevo@tienda.cl');
      done();
    });

    const req = httpMock.expectOne(`${API_CONFIG.usuariosUrl}/usuarios`);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 4, nombreCompleto: 'Nuevo Cliente', correo: 'nuevo@tienda.cl', password: 'Cliente123!', rol: 'CLIENTE', activo: 1 });
  });

  it('debe recuperar contraseña consultando usuarios', done => {
    service.recuperarPassword('admin@tienda.cl').subscribe(mensaje => {
      expect(mensaje).toContain('enlace');
      done();
    });

    httpMock.expectOne(`${API_CONFIG.usuariosUrl}/usuarios`).flush([{ id: 1, nombreCompleto: 'Admin', correo: 'admin@tienda.cl', password: 'Admin123!', rol: 'ADMIN', activo: 1 }]);
  });

  it('debe cerrar sesión eliminando la sesión local', () => {
    localStorage.setItem('nm_sesion', JSON.stringify({ id: 1, correo: 'admin@tienda.cl' }));
    service.logout();
    expect(service.obtenerSesion()).toBeNull();
  });

  it('debe rechazar usuario inactivo usando fallback local', done => {
    localStorage.setItem('nm_usuarios', JSON.stringify([
      { id: 9, nombreCompleto: 'Usuario Inactivo', correo: 'inactivo@tienda.cl', password: 'Cliente123!', rol: 'CLIENTE', activo: 0 }
    ]));

    service.login('inactivo@tienda.cl', 'Cliente123!').subscribe(result => {
      expect(result.ok).toBeFalse();
      expect(result.mensaje).toContain('inactivo');
      done();
    });

    httpMock.expectOne(`${API_CONFIG.usuariosUrl}/auth/login`).error(new ProgressEvent('error'));
  });

  it('debe registrar usuario con fallback cuando el backend falla', done => {
    service.registrarUsuario('Fallback Cliente', 'fallback@tienda.cl', 'Cliente123!').subscribe(result => {
      expect(result.ok).toBeTrue();
      expect(service.obtenerUsuarioPorCorreoFallback('fallback@tienda.cl')).toBeTruthy();
      done();
    });

    httpMock.expectOne(`${API_CONFIG.usuariosUrl}/usuarios`).error(new ProgressEvent('error'));
  });

  it('debe rechazar registro duplicado con fallback', done => {
    service.registrarUsuario('Camila Soto', 'camila@tienda.cl', 'Cliente123!').subscribe(result => {
      expect(result.ok).toBeFalse();
      expect(result.mensaje).toContain('Ya existe');
      done();
    });

    httpMock.expectOne(`${API_CONFIG.usuariosUrl}/usuarios`).error(new ProgressEvent('error'));
  });

  it('debe actualizar perfil usando API y guardar sesión', done => {
    const usuario = { id: 2, nombreCompleto: 'Camila Actualizada', correo: 'camila@tienda.cl', password: 'Cliente123!', rol: 'CLIENTE' as const, activo: 1 };

    service.actualizarPerfil(usuario).subscribe(result => {
      expect(result.ok).toBeTrue();
      expect(service.obtenerSesion()?.nombreCompleto).toBe('Camila Actualizada');
      done();
    });

    const req = httpMock.expectOne(`${API_CONFIG.usuariosUrl}/usuarios/2`);
    expect(req.request.method).toBe('PUT');
    req.flush(usuario);
  });

  it('debe actualizar perfil con fallback cuando API falla', done => {
    const usuario = { id: 3, nombreCompleto: 'Daniel Actualizado', correo: 'daniel@tienda.cl', password: 'Cliente123!', rol: 'CLIENTE' as const, activo: 1 };

    service.actualizarPerfil(usuario).subscribe(result => {
      expect(result.ok).toBeTrue();
      expect(service.obtenerSesion()?.nombreCompleto).toBe('Daniel Actualizado');
      done();
    });

    httpMock.expectOne(`${API_CONFIG.usuariosUrl}/usuarios/3`).error(new ProgressEvent('error'));
  });

  it('debe informar cuando el correo no existe al recuperar contraseña por API', done => {
    service.recuperarPassword('nadie@tienda.cl').subscribe(mensaje => {
      expect(mensaje).toContain('No existe');
      done();
    });

    httpMock.expectOne(`${API_CONFIG.usuariosUrl}/usuarios`).flush([]);
  });

  it('debe recuperar contraseña con fallback si la API falla', done => {
    service.recuperarPassword('admin@tienda.cl').subscribe(mensaje => {
      expect(mensaje).toContain('enlace');
      done();
    });

    httpMock.expectOne(`${API_CONFIG.usuariosUrl}/usuarios`).error(new ProgressEvent('error'));
  });

});
