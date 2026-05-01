import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { InicioComponent } from './inicio.component';
import { TiendaFacadeService } from '../../services/tienda-facade.service';

describe('InicioComponent', () => {
  const facadeSpy = jasmine.createSpyObj('TiendaFacadeService', ['obtenerProductosDestacados']);

  beforeEach(async () => {
    facadeSpy.obtenerProductosDestacados.and.returnValue(of([{ id: 1, nombre: 'Notebook', descripcion: 'Equipo', categoria: 'Tecnologia', precio: 1000, stock: 2, activo: 1, imagen: '💻' }]));
    await TestBed.configureTestingModule({
      imports: [InicioComponent],
      providers: [provideRouter([]), { provide: TiendaFacadeService, useValue: facadeSpy }]
    }).compileComponents();
  });

  it('debe cargar productos destacados', () => {
    const fixture = TestBed.createComponent(InicioComponent);
    fixture.componentInstance.ngOnInit();
    expect(fixture.componentInstance.productosDestacados.length).toBe(1);
  });
});
