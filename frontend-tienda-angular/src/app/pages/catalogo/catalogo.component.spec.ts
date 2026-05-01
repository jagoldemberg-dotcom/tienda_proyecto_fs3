import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CatalogoComponent } from './catalogo.component';
import { TiendaFacadeService } from '../../services/tienda-facade.service';

describe('CatalogoComponent', () => {
  const productos = [
    { id: 1, nombre: 'Notebook', descripcion: 'Equipo', categoria: 'Tecnologia', precio: 1000, stock: 2, activo: 1, imagen: '💻' },
    { id: 2, nombre: 'Audifonos', descripcion: 'Audio', categoria: 'Audio', precio: 2000, stock: 3, activo: 1, imagen: '🎧' }
  ];
  const facadeSpy = jasmine.createSpyObj('TiendaFacadeService', ['obtenerProductos', 'comprarProducto'], { usuarioActual: { rol: 'CLIENTE' } });

  beforeEach(async () => {
    facadeSpy.obtenerProductos.and.returnValue(of(productos));
    facadeSpy.comprarProducto.and.returnValue(of({ ok: true, mensaje: 'Compra OK' }));
    await TestBed.configureTestingModule({
      imports: [CatalogoComponent],
      providers: [{ provide: TiendaFacadeService, useValue: facadeSpy }]
    }).compileComponents();
  });

  it('debe cargar y filtrar productos', () => {
    const fixture = TestBed.createComponent(CatalogoComponent);
    const component = fixture.componentInstance;
    component.ngOnInit();
    component.filtroNombre = 'note';
    component.filtrar();
    expect(component.productosFiltrados.length).toBe(1);
    expect(component.categorias).toContain('Tecnologia');
  });

  it('debe comprar y recargar productos', () => {
    const fixture = TestBed.createComponent(CatalogoComponent);
    const component = fixture.componentInstance;
    component.ngOnInit();
    component.comprar(1);
    expect(component.mensaje).toBe('Compra OK');
    expect(facadeSpy.comprarProducto).toHaveBeenCalledWith(1, 1);
  });
});
