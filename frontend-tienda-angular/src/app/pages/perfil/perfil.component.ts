import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';
import { TiendaFacadeService } from '../../services/tienda-facade.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent {
  usuario: Usuario | null;
  mensaje = '';
  cargando = false;

  constructor(private facade: TiendaFacadeService) {
    this.usuario = this.facade.usuarioActual ? JSON.parse(JSON.stringify(this.facade.usuarioActual)) as Usuario : null;
  }

  guardar(): void {
    if (!this.usuario) {
      return;
    }

    this.cargando = true;
    this.facade.actualizarPerfil(this.usuario).subscribe({
      next: result => {
        this.mensaje = result.mensaje;
        this.cargando = false;
      },
      error: () => {
        this.mensaje = 'No fue posible actualizar el perfil.';
        this.cargando = false;
      }
    });
  }
}
