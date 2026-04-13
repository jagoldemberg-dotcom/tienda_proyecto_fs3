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
    cantidades: Record<number, number> = {};

    productos: Producto[] = [];
    productosFiltrados: Producto[] = [];
    categorias: string[] = [];

    constructor(public facade: TiendaFacadeService) {}

    ngOnInit(): void {
        this.cargarProductos();
    }

    cargarProductos(): void {
        this.productos = this.facade.obtenerProductos() || [];
        this.categorias = [...new Set(this.productos.map(p => p.categoria))];
        this.productosFiltrados = [...this.productos];

        this.productos.forEach(producto => {
            if (!this.cantidades[producto.id]) {
                this.cantidades[producto.id] = 1;
            }
        });
    }

    filtrar(): void {
        const nombre = this.filtroNombre.toLowerCase().trim();
        const categoria = this.filtroCategoria;

        this.productosFiltrados = this.productos.filter(p =>
            p.nombre.toLowerCase().includes(nombre) &&
            (!categoria || p.categoria === categoria)
        );
    }

    comprar(productoId: number): void {
        const cantidad = this.cantidades[productoId] ?? 1;
        const r = this.facade.comprarProducto(productoId, cantidad);
        this.mensaje = r.mensaje;

        if (r.ok) {
            this.cantidades[productoId] = 1;
            this.cargarProductos();
            this.filtrar();
        }
    }
}