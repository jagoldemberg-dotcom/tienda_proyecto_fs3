import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { TiendaFacadeService } from '../../services/tienda-facade.service';

describe('LoginComponent', () => {
  const facadeSpy = jasmine.createSpyObj('TiendaFacadeService', ['login']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([]), { provide: TiendaFacadeService, useValue: facadeSpy }]
    }).compileComponents();
  });

  it('debe exigir correo y contraseña', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    component.ingresar();
    expect(component.error).toBeTrue();
    expect(component.mensaje).toContain('completar');
  });

  it('debe redirigir admin a administración', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
    facadeSpy.login.and.returnValue(of({ ok: true, mensaje: 'OK', usuario: { rol: 'ADMIN' } }));
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    component.correo = 'admin@tienda.cl';
    component.password = 'Admin123!';
    component.ingresar();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/admin-productos', { replaceUrl: true });
  });

  it('debe redirigir cliente al catálogo', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
    facadeSpy.login.and.returnValue(of({ ok: true, mensaje: 'OK', usuario: { rol: 'CLIENTE' } }));
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    component.correo = 'cliente@tienda.cl';
    component.password = 'Cliente123!';
    component.ingresar();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/catalogo', { replaceUrl: true });
  });

  it('debe mostrar error cuando falla el login', () => {
    facadeSpy.login.and.returnValue(throwError(() => new Error('error')));
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    component.correo = 'admin@tienda.cl';
    component.password = 'Admin123!';
    component.ingresar();
    expect(component.error).toBeTrue();
    expect(component.mensaje).toContain('No fue posible');
  });

});
