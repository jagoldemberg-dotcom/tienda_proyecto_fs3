import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UrlTree } from '@angular/router';
import { adminGuard } from './admin.guard';
import { TiendaFacadeService } from '../services/tienda-facade.service';

describe('adminGuard', () => {
  it('debe permitir admin autenticado', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: TiendaFacadeService, useValue: { usuarioActual: { id: 1 }, esAdmin: true } }]
    });
    const result = TestBed.runInInjectionContext(() => adminGuard());
    expect(result).toBeTrue();
  });

  it('debe redirigir cliente no admin', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: TiendaFacadeService, useValue: { usuarioActual: { id: 2 }, esAdmin: false } }]
    });
    const result = TestBed.runInInjectionContext(() => adminGuard());
    expect(result instanceof UrlTree).toBeTrue();
  });
});
