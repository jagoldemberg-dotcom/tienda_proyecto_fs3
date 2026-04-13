import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TiendaFacadeService } from '../../services/tienda-facade.service';
@Component({ selector: 'app-mis-compras', standalone: true, imports: [CommonModule], templateUrl: './mis-compras.component.html' })
export class MisComprasComponent { constructor(public facade:TiendaFacadeService){} get compras(){ return this.facade.obtenerMisCompras(); } }
