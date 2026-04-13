import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TiendaFacadeService } from '../../services/tienda-facade.service';
@Component({ selector: 'app-navbar', standalone: true, imports: [CommonModule, RouterLink, RouterLinkActive], templateUrl: './navbar.component.html' })
export class NavbarComponent { constructor(public facade: TiendaFacadeService, private router: Router) {} cerrarSesion(): void { this.facade.logout(); this.router.navigate(['/login']); } }
