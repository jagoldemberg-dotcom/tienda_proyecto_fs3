import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TiendaFacadeService } from '../../services/tienda-facade.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.component.html'
})
export class RegistroComponent {
  nombreCompleto = '';
  correo = '';
  password = '';
  confirmarPassword = '';
  mensaje = '';
  error = false;
  cargando = false;

  constructor(private facade: TiendaFacadeService, private router: Router) {}

  get cumpleLargo(): boolean { return this.password.length >= 8; }
  get cumpleMayuscula(): boolean { return /[A-Z]/.test(this.password); }
  get cumpleMinuscula(): boolean { return /[a-z]/.test(this.password); }
  get cumpleNumero(): boolean { return /\d/.test(this.password); }
  get cumpleEspecial(): boolean { return /[^A-Za-z\d]/.test(this.password); }

  get passwordValida(): boolean {
    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,20}$/.test(this.password);
  }

  registrar(): void {
    if (this.password !== this.confirmarPassword) {
      this.mensaje = 'Las contraseñas no coinciden.';
      this.error = true;
      return;
    }

    if (!this.passwordValida) {
      this.mensaje = 'La contraseña no cumple las reglas de seguridad.';
      this.error = true;
      return;
    }

    this.cargando = true;
    this.facade.registrarUsuario(this.nombreCompleto.trim(), this.correo.trim().toLowerCase(), this.password).subscribe({
      next: result => {
        this.mensaje = result.mensaje;
        this.error = !result.ok;
        this.cargando = false;
        if (result.ok) {
          this.router.navigate(['/login']);
        }
      },
      error: () => {
        this.mensaje = 'No fue posible registrar el usuario.';
        this.error = true;
        this.cargando = false;
      }
    });
  }
}
