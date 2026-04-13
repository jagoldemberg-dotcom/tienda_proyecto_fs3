import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../models/producto.model';
import { TiendaFacadeService } from '../../services/tienda-facade.service';
@Component({ selector: 'app-admin-productos', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './admin-productos.component.html' })
export class AdminProductosComponent { mensaje=''; editandoId:number|null=null; formulario: Producto={ id:0,nombre:'',descripcion:'',categoria:'',precio:0,stock:0,activo:1,imagen:'🛒' }; constructor(public facade:TiendaFacadeService){} get productos(): Producto[] { return this.facade.obtenerProductosAdmin(); } editar(producto: Producto): void { this.editandoId=producto.id; this.formulario={...producto}; } limpiar(): void { this.editandoId=null; this.formulario={ id:0,nombre:'',descripcion:'',categoria:'',precio:0,stock:0,activo:1,imagen:'🛒' }; } guardar(): void { this.facade.guardarProducto({...this.formulario}); this.mensaje=this.editandoId?'Producto actualizado correctamente.':'Producto creado correctamente.'; this.limpiar(); } eliminar(id:number): void { this.facade.eliminarProducto(id); this.mensaje='Producto eliminado correctamente.'; if(this.editandoId===id){ this.limpiar(); } } }
