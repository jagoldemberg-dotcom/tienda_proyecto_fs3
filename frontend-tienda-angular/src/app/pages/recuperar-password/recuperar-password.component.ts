import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TiendaFacadeService } from '../../services/tienda-facade.service';
@Component({ selector: 'app-recuperar-password', standalone: true, imports: [CommonModule, FormsModule, RouterLink], templateUrl: './recuperar-password.component.html' })
export class RecuperarPasswordComponent { correo=''; mensaje=''; constructor(private facade:TiendaFacadeService){} recuperar(): void { this.mensaje=this.facade.recuperarPassword(this.correo); } }
