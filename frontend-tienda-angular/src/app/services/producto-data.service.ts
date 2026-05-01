import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Compra, CompraResponse, Producto } from '../models/producto.model';
import { StorageService } from './storage.service';

const PRODUCTOS_KEY = 'nm_productos';
const COMPRAS_KEY = 'nm_compras';

@Injectable({ providedIn: 'root' })
export class ProductoDataService {
  constructor(private storage: StorageService, private http: HttpClient) {
    this.inicializarFallback();
  }

  private inicializarFallback(): void {
    if (this.storage.getItem<Producto[]>(PRODUCTOS_KEY, []).length === 0) {
      this.storage.setItem<Producto[]>(PRODUCTOS_KEY, [
        { id: 1, nombre: 'Notebook Lenovo IdeaPad', descripcion: 'Notebook de 15 pulgadas con 16GB RAM y SSD.', categoria: 'Tecnologia', precio: 549990, stock: 8, activo: 1, imagen: '💻' },
        { id: 2, nombre: 'Mouse Logitech G203', descripcion: 'Mouse gamer RGB con 6 botones.', categoria: 'Accesorios', precio: 24990, stock: 20, activo: 1, imagen: '🖱️' },
        { id: 3, nombre: 'Teclado Mecanico Redragon', descripcion: 'Teclado mecánico con switches blue.', categoria: 'Accesorios', precio: 42990, stock: 15, activo: 1, imagen: '⌨️' },
        { id: 4, nombre: 'Monitor Samsung 24', descripcion: 'Monitor Full HD de 24 pulgadas.', categoria: 'Monitores', precio: 129990, stock: 10, activo: 1, imagen: '🖥️' },
        { id: 5, nombre: 'Audifonos HyperX Cloud', descripcion: 'Audífonos gamer con micrófono.', categoria: 'Audio', precio: 69990, stock: 12, activo: 1, imagen: '🎧' }
      ]);
    }

    if (this.storage.getItem<Compra[]>(COMPRAS_KEY, []).length === 0) {
      this.storage.setItem<Compra[]>(COMPRAS_KEY, []);
    }
  }

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${API_CONFIG.productosUrl}/productos`).pipe(
      map(productos => productos.map(producto => this.conImagen(producto))),
      tap(productos => this.storage.setItem(PRODUCTOS_KEY, productos)),
      catchError(() => of(this.obtenerProductosFallback()))
    );
  }

  obtenerProductosActivos(): Observable<Producto[]> {
    return this.obtenerProductos().pipe(
      map(productos => productos.filter(producto => producto.activo === 1))
    );
  }

  obtenerProductosAdmin(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${API_CONFIG.gestionProductosUrl}/productos`).pipe(
      map(productos => productos.map(producto => this.conImagen(producto))),
      tap(productos => this.storage.setItem(PRODUCTOS_KEY, productos)),
      catchError(error => {
        console.error('No fue posible cargar productos desde la API de gestión.', error);
        return throwError(() => error);
      })
    );
  }

  guardarProducto(producto: Producto): Observable<Producto> {
    const esEdicion = !!(producto.id && producto.id > 0);
    const request = this.crearProductoRequest(producto, esEdicion);
    const operacion = esEdicion
      ? this.http.put<Producto>(`${API_CONFIG.gestionProductosUrl}/productos/${producto.id}`, request)
      : this.http.post<Producto>(`${API_CONFIG.gestionProductosUrl}/productos`, request);

    return operacion.pipe(
      map(productoGuardado => this.conImagen(productoGuardado)),
      tap(productoGuardado => this.guardarProductoFallback(productoGuardado)),
      catchError(error => {
        console.error('No fue posible guardar el producto en la API de gestión.', error);
        return throwError(() => error);
      })
    );
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${API_CONFIG.gestionProductosUrl}/productos/${id}`).pipe(
      tap(() => this.eliminarProductoFallback(id)),
      catchError(error => {
        console.error('No fue posible eliminar el producto en la API de gestión.', error);
        return throwError(() => error);
      })
    );
  }

  comprarProducto(productoId: number, clienteNombre: string, clienteCorreo: string, cantidad: number): Observable<{ ok: boolean; mensaje: string }> {
    const request = { clienteNombre, clienteCorreo, cantidad };
    return this.http.post<CompraResponse>(`${API_CONFIG.productosUrl}/productos/${productoId}/comprar`, request).pipe(
      map(response => {
        this.guardarCompraFallback(this.mapearCompra(response));
        this.descontarStockFallback(productoId, cantidad);
        return { ok: true, mensaje: response.mensaje || 'Compra realizada con éxito.' };
      }),
      catchError(() => of(this.comprarProductoFallback(productoId, clienteNombre, clienteCorreo, cantidad)))
    );
  }

  obtenerCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${API_CONFIG.productosUrl}/compras`).pipe(
      map(compras => compras.map(compra => ({ ...compra, id: compra.id ?? 0 }))),
      tap(compras => this.storage.setItem(COMPRAS_KEY, compras)),
      catchError(() => of(this.obtenerComprasFallback()))
    );
  }

  obtenerProductosFallback(): Producto[] {
    return this.storage.getItem<Producto[]>(PRODUCTOS_KEY, []);
  }

  obtenerProductosActivosFallback(): Producto[] {
    return this.obtenerProductosFallback().filter(producto => producto.activo === 1);
  }

  obtenerComprasFallback(): Compra[] {
    return this.storage.getItem<Compra[]>(COMPRAS_KEY, []);
  }

  private guardarProductoFallback(producto: Producto): Producto {
    const productos = this.obtenerProductosFallback();
    const indice = productos.findIndex(item => item.id === producto.id);
    const productoConImagen = this.conImagen(producto);

    if (indice >= 0) {
      productos[indice] = productoConImagen;
    } else {
      productoConImagen.id = productos.length ? Math.max(...productos.map(item => item.id)) + 1 : 1;
      productos.push(productoConImagen);
    }

    this.storage.setItem(PRODUCTOS_KEY, productos);
    return productoConImagen;
  }

  private eliminarProductoFallback(id: number): void {
    this.storage.setItem(PRODUCTOS_KEY, this.obtenerProductosFallback().filter(producto => producto.id !== id));
  }

  private comprarProductoFallback(productoId: number, clienteNombre: string, clienteCorreo: string, cantidad: number): { ok: boolean; mensaje: string } {
    const productos = this.obtenerProductosFallback();
    const producto = productos.find(item => item.id === productoId);

    if (!producto || producto.activo === 0) {
      return { ok: false, mensaje: 'El producto seleccionado no está disponible.' };
    }

    if (cantidad < 1 || cantidad > producto.stock) {
      return { ok: false, mensaje: 'La cantidad solicitada supera el stock disponible.' };
    }

    producto.stock -= cantidad;
    const compras = this.obtenerComprasFallback();
    compras.push({
      id: compras.length ? Math.max(...compras.map(item => item.id)) + 1 : 1,
      productoId: producto.id,
      nombreProducto: producto.nombre,
      clienteNombre,
      clienteCorreo,
      cantidad,
      total: producto.precio * cantidad,
      fechaCompra: new Date().toISOString()
    });

    this.storage.setItem(PRODUCTOS_KEY, productos);
    this.storage.setItem(COMPRAS_KEY, compras);
    return { ok: true, mensaje: 'Compra simulada realizada con éxito.' };
  }

  private guardarCompraFallback(compra: Compra): void {
    const compras = this.obtenerComprasFallback();
    if (!compras.some(item => item.id === compra.id)) {
      compras.push(compra);
      this.storage.setItem(COMPRAS_KEY, compras);
    }
  }

  private descontarStockFallback(productoId: number, cantidad: number): void {
    const productos = this.obtenerProductosFallback();
    const producto = productos.find(item => item.id === productoId);
    if (producto) {
      producto.stock = Math.max(0, producto.stock - cantidad);
      this.storage.setItem(PRODUCTOS_KEY, productos);
    }
  }

  private mapearCompra(response: CompraResponse): Compra {
    return {
      id: response.compraId ?? response.id ?? Date.now(),
      productoId: response.productoId,
      nombreProducto: response.nombreProducto,
      clienteNombre: response.clienteNombre,
      clienteCorreo: response.clienteCorreo,
      cantidad: response.cantidad,
      total: Number(response.total),
      fechaCompra: response.fechaCompra
    };
  }

  private conImagen(producto: Producto): Producto {
    return {
      ...producto,
      precio: Number(producto.precio),
      imagen: producto.imagen || this.obtenerIcono(producto.categoria)
    };
  }

  private crearProductoRequest(producto: Producto, incluirId: boolean): Partial<Producto> {
    const { imagen, id, ...productoApi } = producto;
    return incluirId ? { id, ...productoApi } : productoApi;
  }

  private obtenerIcono(categoria: string): string {
    const categoriaNormalizada = categoria.toLowerCase();
    if (categoriaNormalizada.includes('tecnologia')) return '💻';
    if (categoriaNormalizada.includes('accesorio')) return '🖱️';
    if (categoriaNormalizada.includes('monitor')) return '🖥️';
    if (categoriaNormalizada.includes('audio')) return '🎧';
    return '🛒';
  }
}
