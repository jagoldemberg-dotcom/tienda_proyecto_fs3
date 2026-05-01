import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { TiendaFacadeService } from '../../services/tienda-facade.service';

describe('NavbarComponent', () => {
  const facadeSpy = jasmine.createSpyObj('TiendaFacadeService', ['logout'], {
    usuarioActual: { id: 1, nombreCompleto: 'Admin', correo: 'admin@tienda.cl', password: 'Admin123!', rol: 'ADMIN', activo: 1 },
    esAdmin: true
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([]), { provide: TiendaFacadeService, useValue: facadeSpy }]
    }).compileComponents();
  });

  it('debe cerrar sesión y navegar al login', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.componentInstance.cerrarSesion();
    expect(facadeSpy.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
