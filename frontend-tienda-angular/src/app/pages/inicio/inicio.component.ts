import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Producto } from '../../models/producto.model';
import { TiendaFacadeService } from '../../services/tienda-facade.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.component.html'
})
export class InicioComponent implements OnInit {
  productosDestacados: Producto[] = [];
  beneficios = [
    '2 roles con privilegios distintos',
    'Pantallas responsive con Bootstrap',
    'Validaciones en formularios',
    'Comunicación con APIs Spring Boot'
  ];

  constructor(public facade: TiendaFacadeService) {}

  ngOnInit(): void {
    this.facade.obtenerProductosDestacados().subscribe(productos => this.productosDestacados = productos);
  }
}
