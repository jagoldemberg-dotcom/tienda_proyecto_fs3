import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { TiendaFacadeService } from '../services/tienda-facade.service';

describe('authGuard', () => {
  it('debe permitir usuario autenticado', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: TiendaFacadeService, useValue: { usuarioActual: { id: 1 } } }]
    });
    const result = TestBed.runInInjectionContext(() => authGuard());
    expect(result).toBeTrue();
  });

  it('debe redirigir usuario invitado al login', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: TiendaFacadeService, useValue: { usuarioActual: null } }]
    });
    const result = TestBed.runInInjectionContext(() => authGuard());
    expect(result instanceof UrlTree).toBeTrue();
  });
});
