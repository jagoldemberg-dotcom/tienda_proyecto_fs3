import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TiendaFacadeService } from '../../services/tienda-facade.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './login.component.html'
})
export class LoginComponent {
    correo = '';
    password = '';
    mensaje = '';
    error = false;

    constructor(
        private facade: TiendaFacadeService,
        private router: Router
    ) {}

    ingresar(): void {
        const correoLimpio = this.correo.trim().toLowerCase();
        const passwordLimpio = this.password.trim();

        if (!correoLimpio || !passwordLimpio) {
            this.mensaje = 'Debes completar correo y contraseña.';
            this.error = true;
            return;
        }

        const r = this.facade.login(correoLimpio, passwordLimpio);
        this.mensaje = r.mensaje;
        this.error = !r.ok;

        if (r.ok) {
            const destino = r.usuario?.rol === 'ADMIN' ? '/admin-productos' : '/catalogo';
            this.router.navigateByUrl(destino, { replaceUrl: true });
        }
    }
}