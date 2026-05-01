import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../models/producto.model';
import { TiendaFacadeService } from '../../services/tienda-facade.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogo.component.html'
})
export class CatalogoComponent implements OnInit {
  filtroNombre = '';
  filtroCategoria = '';
  mensaje = '';
  cargando = false;
  cantidades: Record<number, number> = {};

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: string[] = [];

  constructor(public facade: TiendaFacadeService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.facade.obtenerProductos().subscribe({
      next: productos => {
        this.productos = productos || [];
        this.categorias = [...new Set(this.productos.map(producto => producto.categoria))];
        this.productos.forEach(producto => {
          if (!this.cantidades[producto.id]) {
            this.cantidades[producto.id] = 1;
          }
        });
        this.filtrar();
        this.cargando = false;
      },
      error: () => {
        this.mensaje = 'No fue posible cargar los productos.';
        this.cargando = false;
      }
    });
  }

  filtrar(): void {
    const nombre = this.filtroNombre.toLowerCase().trim();
    const categoria = this.filtroCategoria;

    this.productosFiltrados = this.productos.filter(producto =>
      producto.nombre.toLowerCase().includes(nombre) &&
      (!categoria || producto.categoria === categoria)
    );
  }

  comprar(productoId: number): void {
    const cantidad = this.cantidades[productoId] ?? 1;
    this.facade.comprarProducto(productoId, cantidad).subscribe(resultado => {
      this.mensaje = resultado.mensaje;
      if (resultado.ok) {
        this.cantidades[productoId] = 1;
        this.cargarProductos();
      }
    });
  }
}
