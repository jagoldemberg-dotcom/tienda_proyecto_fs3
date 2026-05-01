import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegistroComponent } from './registro.component';
import { TiendaFacadeService } from '../../services/tienda-facade.service';

describe('RegistroComponent', () => {
  const facadeSpy = jasmine.createSpyObj('TiendaFacadeService', ['registrarUsuario']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroComponent],
      providers: [provideRouter([]), { provide: TiendaFacadeService, useValue: facadeSpy }]
    }).compileComponents();
  });

  it('debe validar reglas de contraseña', () => {
    const fixture = TestBed.createComponent(RegistroComponent);
    const component = fixture.componentInstance;
    component.password = 'Cliente123!';
    expect(component.cumpleLargo).toBeTrue();
    expect(component.cumpleMayuscula).toBeTrue();
    expect(component.cumpleMinuscula).toBeTrue();
    expect(component.cumpleNumero).toBeTrue();
    expect(component.cumpleEspecial).toBeTrue();
    expect(component.passwordValida).toBeTrue();
  });

  it('debe mostrar error si las contraseñas no coinciden', () => {
    const fixture = TestBed.createComponent(RegistroComponent);
    const component = fixture.componentInstance;
    component.password = 'Cliente123!';
    component.confirmarPassword = 'Otra123!';
    component.registrar();
    expect(component.error).toBeTrue();
    expect(component.mensaje).toContain('no coinciden');
  });

  it('debe registrar y volver al login', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    facadeSpy.registrarUsuario.and.returnValue(of({ ok: true, mensaje: 'Usuario registrado' }));
    const fixture = TestBed.createComponent(RegistroComponent);
    const component = fixture.componentInstance;
    component.nombreCompleto = 'Nuevo Cliente';
    component.correo = 'nuevo@tienda.cl';
    component.password = 'Cliente123!';
    component.confirmarPassword = 'Cliente123!';
    component.registrar();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debe rechazar contraseña que no cumple reglas de seguridad', () => {
    const fixture = TestBed.createComponent(RegistroComponent);
    const component = fixture.componentInstance;
    component.password = 'simple';
    component.confirmarPassword = 'simple';
    component.registrar();
    expect(component.error).toBeTrue();
    expect(component.mensaje).toContain('reglas');
  });

  it('debe mostrar error cuando falla el registro', () => {
    facadeSpy.registrarUsuario.and.returnValue(throwError(() => new Error('error')));
    const fixture = TestBed.createComponent(RegistroComponent);
    const component = fixture.componentInstance;
    component.nombreCompleto = 'Nuevo Cliente';
    component.correo = 'nuevo@tienda.cl';
    component.password = 'Cliente123!';
    component.confirmarPassword = 'Cliente123!';
    component.registrar();
    expect(component.error).toBeTrue();
    expect(component.mensaje).toContain('No fue posible');
  });

});
