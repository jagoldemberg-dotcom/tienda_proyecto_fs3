import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `<app-navbar></app-navbar><main class="container py-4 py-lg-5"><router-outlet></router-outlet></main>`
})
export class AppComponent {}
