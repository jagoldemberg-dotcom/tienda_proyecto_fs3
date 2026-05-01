import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ProductoDataService } from './producto-data.service';
import { API_CONFIG } from '../config/api.config';

describe('ProductoDataService', () => {
  let service: ProductoDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(ProductoDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debe obtener productos desde la API y agregar icono', done => {
    service.obtenerProductos().subscribe(productos => {
      expect(productos.length).toBe(1);
      expect(productos[0].imagen).toBe('💻');
      done();
    });

    httpMock.expectOne(`${API_CONFIG.productosUrl}/productos`).flush([
      { id: 1, nombre: 'Notebook', descripcion: 'Equipo', categoria: 'Tecnologia', precio: 1000, stock: 2, activo: 1 }
    ]);
  });

  it('debe filtrar productos activos', done => {
    service.obtenerProductosActivos().subscribe(productos => {
      expect(productos.length).toBe(1);
      expect(productos[0].activo).toBe(1);
      done();
    });

    httpMock.expectOne(`${API_CONFIG.productosUrl}/productos`).flush([
      { id: 1, nombre: 'Activo', descripcion: 'A', categoria: 'Audio', precio: 1000, stock: 2, activo: 1 },
      { id: 2, nombre: 'Inactivo', descripcion: 'B', categoria: 'Audio', precio: 1000, stock: 2, activo: 0 }
    ]);
  });

  it('debe guardar producto usando microservicio de gestión', done => {
    service.guardarProducto({ id: 0, nombre: 'Nuevo', descripcion: 'Desc', categoria: 'Audio', precio: 2000, stock: 3, activo: 1, imagen: '🎧' }).subscribe(producto => {
      expect(producto.id).toBe(10);
      expect(producto.imagen).toBe('🎧');
      done();
    });

    const req = httpMock.expectOne(`${API_CONFIG.gestionProductosUrl}/productos`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.imagen).toBeUndefined();
    req.flush({ id: 10, nombre: 'Nuevo', descripcion: 'Desc', categoria: 'Audio', precio: 2000, stock: 3, activo: 1 });
  });

  it('debe comprar producto y registrar compra', done => {
    service.comprarProducto(1, 'Cliente', 'cliente@tienda.cl', 2).subscribe(result => {
      expect(result.ok).toBeTrue();
      expect(result.mensaje).toContain('Compra');
      done();
    });

    httpMock.expectOne(`${API_CONFIG.productosUrl}/productos/1/comprar`).flush({
      compraId: 5, productoId: 1, nombreProducto: 'Notebook', clienteNombre: 'Cliente', clienteCorreo: 'cliente@tienda.cl', cantidad: 2, total: 2000, fechaCompra: new Date().toISOString(), mensaje: 'Compra realizada con éxito.'
    });
  });

  it('debe comprar con fallback cuando API falla', done => {
    service.comprarProducto(1, 'Camila Soto', 'camila@tienda.cl', 1).subscribe(result => {
      expect(result.ok).toBeTrue();
      expect(service.obtenerComprasFallback().length).toBe(1);
      done();
    });

    httpMock.expectOne(`${API_CONFIG.productosUrl}/productos/1/comprar`).error(new ProgressEvent('error'));
  });

  it('debe obtener productos de administración desde la API', done => {
    service.obtenerProductosAdmin().subscribe(productos => {
      expect(productos.length).toBe(1);
      expect(productos[0].imagen).toBe('🖥️');
      expect(productos[0].precio).toBe(129990);
      done();
    });

    const req = httpMock.expectOne(`${API_CONFIG.gestionProductosUrl}/productos`);
    expect(req.request.method).toBe('GET');
    req.flush([
      { id: 4, nombre: 'Monitor Samsung', descripcion: 'Monitor', categoria: 'Monitores', precio: 129990, stock: 10, activo: 1 }
    ]);
  });

  it('debe actualizar producto existente usando PUT', done => {
    service.guardarProducto({ id: 2, nombre: 'Mouse', descripcion: 'Gamer', categoria: 'Accesorios', precio: 24990, stock: 20, activo: 1, imagen: '🖱️' }).subscribe(producto => {
      expect(producto.id).toBe(2);
      expect(producto.imagen).toBe('🖱️');
      done();
    });

    const req = httpMock.expectOne(`${API_CONFIG.gestionProductosUrl}/productos/2`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.imagen).toBeUndefined();
    req.flush({ id: 2, nombre: 'Mouse', descripcion: 'Gamer', categoria: 'Accesorios', precio: 24990, stock: 20, activo: 1 });
  });

  it('debe eliminar producto usando API y actualizar almacenamiento local', done => {
    expect(service.obtenerProductosFallback().some(producto => producto.id === 1)).toBeTrue();

    service.eliminarProducto(1).subscribe(() => {
      expect(service.obtenerProductosFallback().some(producto => producto.id === 1)).toBeFalse();
      done();
    });

    const req = httpMock.expectOne(`${API_CONFIG.gestionProductosUrl}/productos/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('debe eliminar producto con fallback cuando la API falla', done => {
    service.eliminarProducto(2).subscribe(() => {
      expect(service.obtenerProductosFallback().some(producto => producto.id === 2)).toBeFalse();
      done();
    });

    httpMock.expectOne(`${API_CONFIG.gestionProductosUrl}/productos/2`).error(new ProgressEvent('error'));
  });

  it('debe obtener compras desde la API y normalizar id faltante', done => {
    service.obtenerCompras().subscribe(compras => {
      expect(compras.length).toBe(1);
      expect(compras[0].id).toBe(0);
      done();
    });

    const req = httpMock.expectOne(`${API_CONFIG.productosUrl}/compras`);
    expect(req.request.method).toBe('GET');
    req.flush([
      { productoId: 1, nombreProducto: 'Notebook', clienteNombre: 'Cliente', clienteCorreo: 'cliente@tienda.cl', cantidad: 1, total: 1000, fechaCompra: '2026-01-01T00:00:00' }
    ]);
  });

  it('debe usar productos locales cuando falla la API de productos', done => {
    service.obtenerProductos().subscribe(productos => {
      expect(productos.length).toBeGreaterThan(0);
      expect(productos[0].nombre).toContain('Notebook');
      done();
    });

    httpMock.expectOne(`${API_CONFIG.productosUrl}/productos`).error(new ProgressEvent('error'));
  });

  it('debe rechazar compra fallback si el producto no existe', done => {
    service.comprarProducto(999, 'Cliente', 'cliente@tienda.cl', 1).subscribe(result => {
      expect(result.ok).toBeFalse();
      expect(result.mensaje).toContain('no está disponible');
      done();
    });

    httpMock.expectOne(`${API_CONFIG.productosUrl}/productos/999/comprar`).error(new ProgressEvent('error'));
  });

  it('debe rechazar compra fallback si la cantidad supera el stock', done => {
    service.comprarProducto(1, 'Cliente', 'cliente@tienda.cl', 999).subscribe(result => {
      expect(result.ok).toBeFalse();
      expect(result.mensaje).toContain('stock');
      done();
    });

    httpMock.expectOne(`${API_CONFIG.productosUrl}/productos/1/comprar`).error(new ProgressEvent('error'));
  });

  it('debe asignar icono genérico a categorías no reconocidas', done => {
    service.obtenerProductos().subscribe(productos => {
      expect(productos[0].imagen).toBe('🛒');
      done();
    });

    httpMock.expectOne(`${API_CONFIG.productosUrl}/productos`).flush([
      { id: 20, nombre: 'Producto especial', descripcion: 'Otro', categoria: 'Otros', precio: 1000, stock: 1, activo: 1 }
    ]);
  });

});
