import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  it('debe guardar y leer valores JSON', () => {
    service.setItem('clave', { nombre: 'Test' });
    expect(service.getItem('clave', { nombre: '' }).nombre).toBe('Test');
  });

  it('debe devolver fallback cuando no existe la clave', () => {
    expect(service.getItem('no_existe', 10)).toBe(10);
  });

  it('debe eliminar valores', () => {
    service.setItem('clave', 'valor');
    service.removeItem('clave');
    expect(service.getItem('clave', null)).toBeNull();
  });
});
