import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Compra } from '../../models/producto.model';
import { TiendaFacadeService } from '../../services/tienda-facade.service';

@Component({
  selector: 'app-mis-compras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-compras.component.html'
})
export class MisComprasComponent implements OnInit {
  compras: Compra[] = [];
  cargando = false;

  constructor(public facade: TiendaFacadeService) {}

  ngOnInit(): void {
    this.cargarCompras();
  }

  cargarCompras(): void {
    this.cargando = true;
    this.facade.obtenerMisCompras().subscribe(compras => {
      this.compras = compras;
      this.cargando = false;
    });
  }
}
