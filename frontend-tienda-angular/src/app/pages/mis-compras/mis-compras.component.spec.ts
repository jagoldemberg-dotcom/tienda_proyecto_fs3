import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MisComprasComponent } from './mis-compras.component';
import { TiendaFacadeService } from '../../services/tienda-facade.service';

describe('MisComprasComponent', () => {
  const facadeSpy = jasmine.createSpyObj('TiendaFacadeService', ['obtenerMisCompras']);

  beforeEach(async () => {
    facadeSpy.obtenerMisCompras.and.returnValue(of([{ id: 1, productoId: 1, nombreProducto: 'Notebook', clienteNombre: 'Cliente', clienteCorreo: 'cliente@tienda.cl', cantidad: 1, total: 1000, fechaCompra: '2026-01-01T00:00:00' }]));
    await TestBed.configureTestingModule({
      imports: [MisComprasComponent],
      providers: [{ provide: TiendaFacadeService, useValue: facadeSpy }]
    }).compileComponents();
  });

  it('debe cargar compras del usuario', () => {
    const fixture = TestBed.createComponent(MisComprasComponent);
    const component = fixture.componentInstance;
    component.ngOnInit();
    expect(component.compras.length).toBe(1);
  });
});
