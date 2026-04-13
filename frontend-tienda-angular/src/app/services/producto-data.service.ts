import { Injectable } from '@angular/core';
import { Compra, Producto } from '../models/producto.model';
import { StorageService } from './storage.service';
const PRODUCTOS_KEY = 'nm_productos';
const COMPRAS_KEY = 'nm_compras';
@Injectable({ providedIn: 'root' })
export class ProductoDataService {
  constructor(private storage: StorageService) { this.inicializar(); }
  private inicializar(): void {
    if (this.storage.getItem<Producto[]>(PRODUCTOS_KEY, []).length === 0) {
      this.storage.setItem<Producto[]>(PRODUCTOS_KEY, [
        { id: 1, nombre: 'Notebook Lenovo IdeaPad', descripcion: 'Notebook de 15 pulgadas con 16GB RAM y SSD.', categoria: 'Tecnología', precio: 549990, stock: 8, activo: 1, imagen: '💻' },
        { id: 2, nombre: 'Mouse Logitech G203', descripcion: 'Mouse gamer RGB con 6 botones.', categoria: 'Accesorios', precio: 24990, stock: 20, activo: 1, imagen: '🖱️' },
        { id: 3, nombre: 'Teclado Mecánico Redragon', descripcion: 'Teclado mecánico con switches blue.', categoria: 'Accesorios', precio: 42990, stock: 15, activo: 1, imagen: '⌨️' },
        { id: 4, nombre: 'Monitor Samsung 24"', descripcion: 'Monitor Full HD de 24 pulgadas.', categoria: 'Monitores', precio: 129990, stock: 10, activo: 1, imagen: '🖥️' },
        { id: 5, nombre: 'Audífonos HyperX Cloud', descripcion: 'Audífonos gamer con micrófono.', categoria: 'Audio', precio: 69990, stock: 12, activo: 1, imagen: '🎧' }
      ]);
    }
    if (this.storage.getItem<Compra[]>(COMPRAS_KEY, []).length === 0) { this.storage.setItem<Compra[]>(COMPRAS_KEY, []); }
  }
  obtenerProductos(): Producto[] { return this.storage.getItem<Producto[]>(PRODUCTOS_KEY, []); }
  obtenerProductosActivos(): Producto[] { return this.obtenerProductos().filter(producto => producto.activo === 1); }
  guardarProducto(producto: Producto): void {
    const productos = this.obtenerProductos();
    const indice = productos.findIndex(item => item.id === producto.id);
    if (indice >= 0) { productos[indice] = producto; }
    else { producto.id = productos.length ? Math.max(...productos.map(item => item.id)) + 1 : 1; productos.push(producto); }
    this.storage.setItem(PRODUCTOS_KEY, productos);
  }
  eliminarProducto(id: number): void { this.storage.setItem(PRODUCTOS_KEY, this.obtenerProductos().filter(p => p.id !== id)); }
  comprarProducto(productoId: number, clienteNombre: string, clienteCorreo: string, cantidad: number): { ok: boolean; mensaje: string } {
    const productos = this.obtenerProductos();
    const producto = productos.find(item => item.id === productoId);
    if (!producto || producto.activo === 0) { return { ok: false, mensaje: 'El producto seleccionado no está disponible.' }; }
    if (cantidad < 1 || cantidad > producto.stock) { return { ok: false, mensaje: 'La cantidad solicitada supera el stock disponible.' }; }
    producto.stock -= cantidad;
    const compras = this.obtenerCompras();
    compras.push({ id: compras.length ? Math.max(...compras.map(item => item.id)) + 1 : 1, productoId: producto.id, nombreProducto: producto.nombre, clienteNombre, clienteCorreo, cantidad, total: producto.precio * cantidad, fechaCompra: new Date().toISOString() });
    this.storage.setItem(PRODUCTOS_KEY, productos); this.storage.setItem(COMPRAS_KEY, compras);
    return { ok: true, mensaje: 'Compra simulada realizada con éxito.' };
  }
  obtenerCompras(): Compra[] { return this.storage.getItem<Compra[]>(COMPRAS_KEY, []); }
}
