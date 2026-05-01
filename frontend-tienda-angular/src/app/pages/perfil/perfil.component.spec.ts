import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PerfilComponent } from './perfil.component';
import { TiendaFacadeService } from '../../services/tienda-facade.service';

describe('PerfilComponent', () => {
  const usuario = { id: 1, nombreCompleto: 'Camila Soto', correo: 'camila@tienda.cl', password: 'Cliente123!', rol: 'CLIENTE' as const, activo: 1 };
  const facadeSpy = jasmine.createSpyObj('TiendaFacadeService', ['actualizarPerfil'], { usuarioActual: usuario });

  beforeEach(async () => {
    facadeSpy.actualizarPerfil.and.returnValue(of({ ok: true, mensaje: 'Perfil actualizado correctamente.', usuario }));
    await TestBed.configureTestingModule({
      imports: [PerfilComponent],
      providers: [{ provide: TiendaFacadeService, useValue: facadeSpy }]
    }).compileComponents();
  });

  it('debe crear copia del usuario actual', () => {
    const fixture = TestBed.createComponent(PerfilComponent);
    expect(fixture.componentInstance.usuario?.correo).toBe('camila@tienda.cl');
  });

  it('debe guardar cambios de perfil', () => {
    const fixture = TestBed.createComponent(PerfilComponent);
    const component = fixture.componentInstance;
    component.guardar();
    expect(component.mensaje).toContain('Perfil actualizado');
  });

  it('no debe guardar si no existe usuario', () => {
    const fixture = TestBed.createComponent(PerfilComponent);
    const component = fixture.componentInstance;
    component.usuario = null;
    component.guardar();
    expect(component.mensaje).toBe('');
  });

  it('debe mostrar error cuando falla actualización de perfil', () => {
    facadeSpy.actualizarPerfil.and.returnValue(throwError(() => new Error('error')));
    const fixture = TestBed.createComponent(PerfilComponent);
    const component = fixture.componentInstance;
    component.guardar();
    expect(component.mensaje).toContain('No fue posible');
  });

});
