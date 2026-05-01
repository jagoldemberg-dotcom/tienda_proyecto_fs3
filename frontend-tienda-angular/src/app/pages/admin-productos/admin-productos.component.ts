import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../models/producto.model';
import { TiendaFacadeService } from '../../services/tienda-facade.service';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-productos.component.html'
})
export class AdminProductosComponent implements OnInit {
  mensaje = '';
  cargando = false;
  editandoId: number | null = null;
  productos: Producto[] = [];
  formulario: Producto = this.nuevoProducto();

  constructor(public facade: TiendaFacadeService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.facade.obtenerProductosAdmin().subscribe({
      next: productos => {
        this.productos = productos;
        this.cargando = false;
      },
      error: () => {
        this.mensaje = 'No fue posible cargar los productos.';
        this.cargando = false;
      }
    });
  }

  editar(producto: Producto): void {
    this.editandoId = producto.id;
    this.formulario = { ...producto };
  }

  limpiar(): void {
    this.editandoId = null;
    this.formulario = this.nuevoProducto();
  }

  guardar(): void {
    this.facade.guardarProducto({ ...this.formulario }).subscribe(() => {
      this.mensaje = this.editandoId ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.';
      this.limpiar();
      this.cargarProductos();
    });
  }

  eliminar(id: number): void {
    this.facade.eliminarProducto(id).subscribe(() => {
      this.mensaje = 'Producto eliminado correctamente.';
      if (this.editandoId === id) {
        this.limpiar();
      }
      this.cargarProductos();
    });
  }

  private nuevoProducto(): Producto {
    return { id: 0, nombre: '', descripcion: '', categoria: '', precio: 0, stock: 0, activo: 1, imagen: '🛒' };
  }
}
