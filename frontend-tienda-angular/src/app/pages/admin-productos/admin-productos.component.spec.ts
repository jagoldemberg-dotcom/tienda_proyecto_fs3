import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdminProductosComponent } from './admin-productos.component';
import { TiendaFacadeService } from '../../services/tienda-facade.service';

describe('AdminProductosComponent', () => {
  const producto = { id: 1, nombre: 'Notebook', descripcion: 'Equipo', categoria: 'Tecnologia', precio: 1000, stock: 2, activo: 1, imagen: '💻' };
  let facadeSpy: jasmine.SpyObj<TiendaFacadeService>;

  beforeEach(async () => {
    facadeSpy = jasmine.createSpyObj('TiendaFacadeService', ['obtenerProductosAdmin', 'guardarProducto', 'eliminarProducto']);
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
    expect(component.cargando).toBeFalse();
  });

  it('debe editar, limpiar, guardar y eliminar', () => {
    const fixture = TestBed.createComponent(AdminProductosComponent);
    const component = fixture.componentInstance;
    component.editar(producto);
    expect(component.editandoId).toBe(1);

    component.guardar();
    expect(component.mensaje).toContain('actualizado correctamente en la base de datos');

    component.eliminar(1);
    expect(component.mensaje).toContain('eliminado correctamente de la base de datos');

    component.limpiar();
    expect(component.editandoId).toBeNull();
  });

  it('debe mostrar mensaje de error si falla cargar desde base de datos', () => {
    facadeSpy.obtenerProductosAdmin.and.returnValue(throwError(() => new Error('API caída')));
    const fixture = TestBed.createComponent(AdminProductosComponent);
    const component = fixture.componentInstance;

    component.cargarProductos();

    expect(component.mensaje).toContain('No fue posible cargar');
    expect(component.cargando).toBeFalse();
  });

  it('debe mostrar mensaje de error si falla guardar en base de datos', () => {
    facadeSpy.guardarProducto.and.returnValue(throwError(() => new Error('API caída')));
    const fixture = TestBed.createComponent(AdminProductosComponent);
    const component = fixture.componentInstance;

    component.guardar();

    expect(component.mensaje).toContain('No fue posible guardar');
    expect(component.cargando).toBeFalse();
  });

  it('debe mostrar mensaje de error si falla eliminar en base de datos', () => {
    facadeSpy.eliminarProducto.and.returnValue(throwError(() => new Error('API caída')));
    const fixture = TestBed.createComponent(AdminProductosComponent);
    const component = fixture.componentInstance;

    component.eliminar(1);

    expect(component.mensaje).toContain('No fue posible eliminar');
    expect(component.cargando).toBeFalse();
  });
});
