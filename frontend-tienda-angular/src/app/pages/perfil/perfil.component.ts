import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TiendaFacadeService } from '../../services/tienda-facade.service';
import { Usuario } from '../../models/usuario.model';
@Component({ selector: 'app-perfil', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './perfil.component.html' })
export class PerfilComponent { usuario: Usuario; mensaje=''; constructor(private facade:TiendaFacadeService){ this.usuario=JSON.parse(JSON.stringify(this.facade.usuarioActual)) as Usuario; } guardar(): void { this.facade.actualizarPerfil(this.usuario); this.mensaje='Perfil actualizado correctamente.'; } }
