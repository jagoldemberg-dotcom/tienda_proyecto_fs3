import { Injectable } from '@angular/core';
import { Compra, Producto } from '../models/producto.model';
import { Usuario } from '../models/usuario.model';
import { ProductoDataService } from './producto-data.service';
import { UsuarioDataService } from './usuario-data.service';
@Injectable({ providedIn: 'root' })
export class TiendaFacadeService {
  constructor(private usuarioDataService: UsuarioDataService, private productoDataService: ProductoDataService) {}
  get usuarioActual(): Usuario | null { return this.usuarioDataService.obtenerSesion(); }
  get esAdmin(): boolean { return this.usuarioActual?.rol === 'ADMIN'; }
  login(correo: string, password: string) { return this.usuarioDataService.login(correo, password); }
  logout(): void { this.usuarioDataService.logout(); }
  registrarUsuario(nombreCompleto: string, correo: string, password: string) { return this.usuarioDataService.registrarUsuario(nombreCompleto, correo, password); }
  recuperarPassword(correo: string) { return this.usuarioDataService.recuperarPassword(correo); }
  actualizarPerfil(usuario: Usuario): void { this.usuarioDataService.actualizarPerfil(usuario); }
  obtenerProductos(): Producto[] { return this.productoDataService.obtenerProductosActivos(); }
  obtenerProductosAdmin(): Producto[] { return this.productoDataService.obtenerProductos(); }
  guardarProducto(producto: Producto): void { this.productoDataService.guardarProducto(producto); }
  eliminarProducto(id: number): void { this.productoDataService.eliminarProducto(id); }
  comprarProducto(productoId: number, cantidad: number) { const u = this.usuarioActual; return u ? this.productoDataService.comprarProducto(productoId, u.nombreCompleto, u.correo, cantidad) : { ok: false, mensaje: 'Debes iniciar sesión para comprar.' }; }
  obtenerMisCompras(): Compra[] { const u = this.usuarioActual; return u ? this.productoDataService.obtenerCompras().filter(c => c.clienteCorreo.toLowerCase() === u.correo.toLowerCase()).sort((a,b) => b.fechaCompra.localeCompare(a.fechaCompra)) : []; }
}
