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
        this.mensaje = 'No fue posible cargar los productos desde la base de datos.';
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
    this.cargando = true;
    this.facade.guardarProducto({ ...this.formulario }).subscribe({
      next: () => {
        this.mensaje = this.editandoId ? 'Producto actualizado correctamente en la base de datos.' : 'Producto creado correctamente en la base de datos.';
        this.limpiar();
        this.cargarProductos();
      },
      error: () => {
        this.mensaje = 'No fue posible guardar el producto en la base de datos. Revisa que ms-gestion-productos esté ejecutándose y conectado a Oracle.';
        this.cargando = false;
      }
    });
  }

  eliminar(id: number): void {
    this.cargando = true;
    this.facade.eliminarProducto(id).subscribe({
      next: () => {
        this.mensaje = 'Producto eliminado correctamente de la base de datos.';
        if (this.editandoId === id) {
          this.limpiar();
        }
        this.cargarProductos();
      },
      error: () => {
        this.mensaje = 'No fue posible eliminar el producto en la base de datos. Revisa el microservicio de gestión y Oracle.';
        this.cargando = false;
      }
    });
  }

  private nuevoProducto(): Producto {
    return { id: 0, nombre: '', descripcion: '', categoria: '', precio: 0, stock: 0, activo: 1, imagen: '🛒' };
  }
}
