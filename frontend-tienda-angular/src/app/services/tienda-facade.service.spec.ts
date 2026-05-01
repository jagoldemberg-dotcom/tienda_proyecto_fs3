import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TiendaFacadeService } from './tienda-facade.service';
import { UsuarioDataService } from './usuario-data.service';
import { ProductoDataService } from './producto-data.service';

describe('TiendaFacadeService', () => {
  let service: TiendaFacadeService;
  const usuario = { id: 1, nombreCompleto: 'Admin', correo: 'admin@tienda.cl', password: 'Admin123!', rol: 'ADMIN' as const, activo: 1 };
  const usuarioDataSpy = jasmine.createSpyObj('UsuarioDataService', ['obtenerSesion', 'login', 'logout', 'registrarUsuario', 'recuperarPassword', 'actualizarPerfil']);
  const productoDataSpy = jasmine.createSpyObj('ProductoDataService', ['obtenerProductosActivos', 'obtenerProductosAdmin', 'guardarProducto', 'eliminarProducto', 'comprarProducto', 'obtenerCompras']);

  beforeEach(() => {
    usuarioDataSpy.obtenerSesion.and.returnValue(usuario);
    productoDataSpy.obtenerProductosActivos.and.returnValue(of([{ id: 1, nombre: 'Producto', descripcion: 'D', categoria: 'Audio', precio: 1000, stock: 1, activo: 1 }]));
    productoDataSpy.obtenerCompras.and.returnValue(of([{ id: 1, productoId: 1, nombreProducto: 'Producto', clienteNombre: 'Admin', clienteCorreo: 'admin@tienda.cl', cantidad: 1, total: 1000, fechaCompra: '2026-01-01T00:00:00' }]));
    TestBed.configureTestingModule({
      providers: [
        TiendaFacadeService,
        { provide: UsuarioDataService, useValue: usuarioDataSpy },
        { provide: ProductoDataService, useValue: productoDataSpy }
      ]
    });
    service = TestBed.inject(TiendaFacadeService);
  });

  it('debe identificar usuario admin', () => {
    expect(service.usuarioActual?.correo).toBe('admin@tienda.cl');
    expect(service.esAdmin).toBeTrue();
  });

  it('debe obtener productos destacados', done => {
    service.obtenerProductosDestacados().subscribe(productos => {
      expect(productos.length).toBe(1);
      done();
    });
  });

  it('debe comprar producto con usuario autenticado', done => {
    productoDataSpy.comprarProducto.and.returnValue(of({ ok: true, mensaje: 'OK' }));
    service.comprarProducto(1, 1).subscribe(result => {
      expect(result.ok).toBeTrue();
      expect(productoDataSpy.comprarProducto).toHaveBeenCalled();
      done();
    });
  });

  it('debe filtrar compras del usuario actual', done => {
    service.obtenerMisCompras().subscribe(compras => {
      expect(compras.length).toBe(1);
      expect(compras[0].clienteCorreo).toBe('admin@tienda.cl');
      done();
    });
  });

  it('debe delegar operaciones de usuario', done => {
    usuarioDataSpy.login.and.returnValue(of({ ok: true, mensaje: 'Login OK', usuario }));
    usuarioDataSpy.registrarUsuario.and.returnValue(of({ ok: true, mensaje: 'Registro OK', usuario }));
    usuarioDataSpy.recuperarPassword.and.returnValue(of('Correo enviado'));
    usuarioDataSpy.actualizarPerfil.and.returnValue(of({ ok: true, mensaje: 'Perfil OK', usuario }));

    service.login('admin@tienda.cl', 'Admin123!').subscribe(result => expect(result.ok).toBeTrue());
    service.registrarUsuario('Admin', 'admin@tienda.cl', 'Admin123!').subscribe(result => expect(result.mensaje).toContain('Registro'));
    service.recuperarPassword('admin@tienda.cl').subscribe(mensaje => expect(mensaje).toContain('Correo'));
    service.actualizarPerfil(usuario).subscribe(result => {
      expect(result.mensaje).toContain('Perfil');
      done();
    });
  });

  it('debe delegar operaciones administrativas de productos', done => {
    const producto = { id: 1, nombre: 'Producto', descripcion: 'D', categoria: 'Audio', precio: 1000, stock: 1, activo: 1 };
    productoDataSpy.obtenerProductosAdmin.and.returnValue(of([producto]));
    productoDataSpy.guardarProducto.and.returnValue(of(producto));
    productoDataSpy.eliminarProducto.and.returnValue(of(void 0));

    service.obtenerProductosAdmin().subscribe(productos => expect(productos.length).toBe(1));
    service.guardarProducto(producto).subscribe(resultado => expect(resultado.id).toBe(1));
    service.eliminarProducto(1).subscribe(() => {
      expect(productoDataSpy.eliminarProducto).toHaveBeenCalledWith(1);
      done();
    });
  });

  it('debe responder error al comprar sin usuario autenticado', done => {
    usuarioDataSpy.obtenerSesion.and.returnValue(null);
    productoDataSpy.comprarProducto.calls.reset();

    service.comprarProducto(1, 1).subscribe(result => {
      expect(result.ok).toBeFalse();
      expect(result.mensaje).toContain('iniciar sesión');
      expect(productoDataSpy.comprarProducto).not.toHaveBeenCalled();
      done();
    });
  });

  it('debe devolver lista vacía de compras si no hay usuario autenticado', done => {
    usuarioDataSpy.obtenerSesion.and.returnValue(null);
    productoDataSpy.obtenerCompras.calls.reset();

    service.obtenerMisCompras().subscribe(compras => {
      expect(compras).toEqual([]);
      expect(productoDataSpy.obtenerCompras).not.toHaveBeenCalled();
      done();
    });
  });

  it('debe cerrar sesión delegando al servicio de usuarios', () => {
    service.logout();
    expect(usuarioDataSpy.logout).toHaveBeenCalled();
  });

});
