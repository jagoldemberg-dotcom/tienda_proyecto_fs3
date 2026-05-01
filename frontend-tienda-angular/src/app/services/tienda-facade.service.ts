import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Compra, Producto } from '../models/producto.model';
import { Usuario } from '../models/usuario.model';
import { ProductoDataService } from './producto-data.service';
import { OperacionUsuarioResult, UsuarioDataService } from './usuario-data.service';

@Injectable({ providedIn: 'root' })
export class TiendaFacadeService {
  constructor(
    private usuarioDataService: UsuarioDataService,
    private productoDataService: ProductoDataService
  ) {}

  get usuarioActual(): Usuario | null {
    return this.usuarioDataService.obtenerSesion();
  }

  get esAdmin(): boolean {
    return this.usuarioActual?.rol === 'ADMIN';
  }

  login(correo: string, password: string): Observable<OperacionUsuarioResult> {
    return this.usuarioDataService.login(correo, password);
  }

  logout(): void {
    this.usuarioDataService.logout();
  }

  registrarUsuario(nombreCompleto: string, correo: string, password: string): Observable<OperacionUsuarioResult> {
    return this.usuarioDataService.registrarUsuario(nombreCompleto, correo, password);
  }

  recuperarPassword(correo: string): Observable<string> {
    return this.usuarioDataService.recuperarPassword(correo);
  }

  actualizarPerfil(usuario: Usuario): Observable<OperacionUsuarioResult> {
    return this.usuarioDataService.actualizarPerfil(usuario);
  }

  obtenerProductos(): Observable<Producto[]> {
    return this.productoDataService.obtenerProductosActivos();
  }

  obtenerProductosDestacados(): Observable<Producto[]> {
    return this.obtenerProductos().pipe(map(productos => productos.slice(0, 4)));
  }

  obtenerProductosAdmin(): Observable<Producto[]> {
    return this.productoDataService.obtenerProductosAdmin();
  }

  guardarProducto(producto: Producto): Observable<Producto> {
    return this.productoDataService.guardarProducto(producto);
  }

  eliminarProducto(id: number): Observable<void> {
    return this.productoDataService.eliminarProducto(id);
  }

  comprarProducto(productoId: number, cantidad: number): Observable<{ ok: boolean; mensaje: string }> {
    const usuario = this.usuarioActual;
    return usuario
      ? this.productoDataService.comprarProducto(productoId, usuario.nombreCompleto, usuario.correo, cantidad)
      : of({ ok: false, mensaje: 'Debes iniciar sesión para comprar.' });
  }

  obtenerMisCompras(): Observable<Compra[]> {
    const usuario = this.usuarioActual;
    if (!usuario) {
      return of([]);
    }

    return this.productoDataService.obtenerCompras().pipe(
      map(compras => compras
        .filter(compra => compra.clienteCorreo.toLowerCase() === usuario.correo.toLowerCase())
        .sort((a, b) => b.fechaCompra.localeCompare(a.fechaCompra)))
    );
  }
}
