import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RecuperarPasswordComponent } from './recuperar-password.component';
import { TiendaFacadeService } from '../../services/tienda-facade.service';

describe('RecuperarPasswordComponent', () => {
  const facadeSpy = jasmine.createSpyObj('TiendaFacadeService', ['recuperarPassword']);

  beforeEach(async () => {
    facadeSpy.recuperarPassword.and.returnValue(of('Correo enviado'));
    await TestBed.configureTestingModule({
      imports: [RecuperarPasswordComponent],
      providers: [provideRouter([]), { provide: TiendaFacadeService, useValue: facadeSpy }]
    }).compileComponents();
  });

  it('debe procesar recuperación', () => {
    const fixture = TestBed.createComponent(RecuperarPasswordComponent);
    const component = fixture.componentInstance;
    component.correo = 'camila@tienda.cl';
    component.recuperar();
    expect(component.mensaje).toBe('Correo enviado');
  });

  it('debe mostrar error cuando falla recuperación', () => {
    facadeSpy.recuperarPassword.and.returnValue(throwError(() => new Error('error')));
    const fixture = TestBed.createComponent(RecuperarPasswordComponent);
    const component = fixture.componentInstance;
    component.correo = 'camila@tienda.cl';
    component.recuperar();
    expect(component.mensaje).toContain('No fue posible');
  });

});
