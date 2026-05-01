package com.tienda.gestionproductos.service;

import com.tienda.gestionproductos.exception.ResourceNotFoundException;
import com.tienda.gestionproductos.model.Producto;
import com.tienda.gestionproductos.repository.ProductoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoGestionServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private ProductoGestionService productoGestionService;

    @Test
    void obtenerTodosRetornaListado() {
        when(productoRepository.findAll()).thenReturn(List.of(producto(1L, 10, 1)));

        List<Producto> resultado = productoGestionService.obtenerTodos();

        assertEquals(1, resultado.size());
        verify(productoRepository).findAll();
    }

    @Test
    void obtenerPorIdCuandoExisteRetornaProducto() {
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto(1L, 10, 1)));

        Producto resultado = productoGestionService.obtenerPorId(1L);

        assertEquals("Notebook", resultado.getNombre());
    }

    @Test
    void obtenerPorIdCuandoNoExisteLanzaExcepcion() {
        when(productoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productoGestionService.obtenerPorId(99L));
    }

    @Test
    void buscarPorCategoriaRetornaProductos() {
        when(productoRepository.findByCategoriaIgnoreCase("Tecnologia")).thenReturn(List.of(producto(1L, 10, 1)));

        List<Producto> resultado = productoGestionService.buscarPorCategoria("Tecnologia");

        assertEquals(1, resultado.size());
        verify(productoRepository).findByCategoriaIgnoreCase("Tecnologia");
    }

    @Test
    void buscarPorEstadoRetornaProductos() {
        when(productoRepository.findByActivo(1)).thenReturn(List.of(producto(1L, 10, 1)));

        List<Producto> resultado = productoGestionService.buscarPorEstado(1);

        assertEquals(1, resultado.size());
        verify(productoRepository).findByActivo(1);
    }

    @Test
    void guardarConActivoNullAsignaActivoUno() {
        Producto producto = producto(null, 5, null);
        Producto guardado = producto(1L, 5, 1);
        when(productoRepository.save(producto)).thenReturn(guardado);

        Producto resultado = productoGestionService.guardar(producto);

        assertEquals(1, producto.getActivo());
        assertEquals(1L, resultado.getId());
    }

    @Test
    void guardarConActivoInformadoLoMantiene() {
        Producto producto = producto(null, 5, 0);
        when(productoRepository.save(producto)).thenReturn(producto);

        Producto resultado = productoGestionService.guardar(producto);

        assertEquals(0, resultado.getActivo());
    }

    @Test
    void actualizarModificaCamposYMantieneActivoSiVieneNull() {
        Producto existente = producto(1L, 10, 1);
        Producto datos = new Producto(null, "Mouse", "Mouse gamer", "Accesorios", BigDecimal.valueOf(19990), 20, null);

        when(productoRepository.findById(1L)).thenReturn(Optional.of(existente));
        when(productoRepository.save(existente)).thenReturn(existente);

        Producto resultado = productoGestionService.actualizar(1L, datos);

        assertEquals("Mouse", resultado.getNombre());
        assertEquals("Mouse gamer", resultado.getDescripcion());
        assertEquals("Accesorios", resultado.getCategoria());
        assertEquals(BigDecimal.valueOf(19990), resultado.getPrecio());
        assertEquals(20, resultado.getStock());
        assertEquals(1, resultado.getActivo());
    }

    @Test
    void actualizarModificaActivoSiVieneInformado() {
        Producto existente = producto(1L, 10, 1);
        Producto datos = producto(null, 8, 0);

        when(productoRepository.findById(1L)).thenReturn(Optional.of(existente));
        when(productoRepository.save(existente)).thenReturn(existente);

        Producto resultado = productoGestionService.actualizar(1L, datos);

        assertEquals(0, resultado.getActivo());
    }

    @Test
    void cambiarEstadoActualizaActivo() {
        Producto producto = producto(1L, 10, 1);
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));
        when(productoRepository.save(producto)).thenReturn(producto);

        Producto resultado = productoGestionService.cambiarEstado(1L, 0);

        assertEquals(0, resultado.getActivo());
        verify(productoRepository).save(producto);
    }

    @Test
    void eliminarBuscaYEliminaProducto() {
        Producto producto = producto(1L, 10, 1);
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));

        productoGestionService.eliminar(1L);

        verify(productoRepository).delete(producto);
    }

    
    void guardarIgnoraIdCeroParaPermitirIdentityDeOracle() {
        Producto producto = producto(0L, 4, 1);
        when(productoRepository.save(producto)).thenReturn(producto);

        productoGestionService.guardar(producto);

        assertNull(producto.getId());
        verify(productoRepository).save(producto);
    }

    private Producto producto(Long id, Integer stock, Integer activo) {
        return new Producto(id, "Notebook", "Notebook oficina", "Tecnologia", BigDecimal.valueOf(99990), stock, activo);
    }
}
