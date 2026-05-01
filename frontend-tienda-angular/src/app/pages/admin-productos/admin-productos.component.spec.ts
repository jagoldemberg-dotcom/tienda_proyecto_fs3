import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminProductosComponent } from './admin-productos.component';
import { TiendaFacadeService } from '../../services/tienda-facade.service';

describe('AdminProductosComponent', () => {
  const producto = { id: 1, nombre: 'Notebook', descripcion: 'Equipo', categoria: 'Tecnologia', precio: 1000, stock: 2, activo: 1, imagen: '💻' };
  const facadeSpy = jasmine.createSpyObj('TiendaFacadeService', ['obtenerProductosAdmin', 'guardarProducto', 'eliminarProducto']);

  beforeEach(async () => {
    facadeSpy.obtenerProductosAdmin.and.returnValue(of([producto]));
    facadeSpy.guardarProducto.and.returnValue(of(producto));
    facadeSpy.eliminarProducto.and.returnValue(of(void 0));
    await TestBed.configureTestingModule({
      imports: [AdminProductosComponent],
      providers: [{ provide: TiendaFacadeService, useValue: facadeSpy }]
    }).compileComponents();
  });

  it('debe cargar productos al iniciar', () => {
    const fixture = TestBed.createComponent(AdminProductosComponent);
    const component = fixture.componentInstance;
    component.ngOnInit();
    expect(component.productos.length).toBe(1);
  });

  it('debe editar, limpiar, guardar y eliminar', () => {
    const fixture = TestBed.createComponent(AdminProductosComponent);
    const component = fixture.componentInstance;
    component.editar(producto);
    expect(component.editandoId).toBe(1);
    component.guardar();
    expect(component.mensaje).toContain('actualizado');
    component.eliminar(1);
    expect(component.mensaje).toContain('eliminado');
    component.limpiar();
    expect(component.editandoId).toBeNull();
  });
});
