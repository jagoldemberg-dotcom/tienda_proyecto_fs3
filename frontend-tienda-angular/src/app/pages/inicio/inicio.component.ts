import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TiendaFacadeService } from '../../services/tienda-facade.service';
@Component({ selector: 'app-inicio', standalone: true, imports: [CommonModule, RouterLink], templateUrl: './inicio.component.html' })
export class InicioComponent { constructor(public facade: TiendaFacadeService) {} beneficios = ['2 roles con privilegios distintos','Pantallas responsive con Bootstrap','Validaciones en formularios','Compras simuladas sin pasarela de pago']; get productosDestacados() { return this.facade.obtenerProductos().slice(0,4); } }
