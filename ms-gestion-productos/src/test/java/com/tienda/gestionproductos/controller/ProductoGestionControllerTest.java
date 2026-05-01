package com.tienda.gestionproductos.controller;

import com.tienda.gestionproductos.model.Producto;
import com.tienda.gestionproductos.service.ProductoGestionService;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductoGestionControllerTest {

    private final ProductoGestionService productoGestionService = mock(ProductoGestionService.class);
    private final ProductoGestionController controller = new ProductoGestionController(productoGestionService);

    @Test
    void listarProductosRetornaOk() {
        when(productoGestionService.obtenerTodos()).thenReturn(List.of(producto()));

        ResponseEntity<List<Producto>> response = controller.listarProductos();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void obtenerProductoRetornaOk() {
        when(productoGestionService.obtenerPorId(1L)).thenReturn(producto());

        ResponseEntity<Producto> response = controller.obtenerProducto(1L);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("Notebook", response.getBody().getNombre());
    }

    @Test
    void buscarPorCategoriaRetornaOk() {
        when(productoGestionService.buscarPorCategoria("Tecnologia")).thenReturn(List.of(producto()));

        ResponseEntity<List<Producto>> response = controller.buscarPorCategoria("Tecnologia");

        assertEquals(200, response.getStatusCode().value());
        verify(productoGestionService).buscarPorCategoria("Tecnologia");
    }

    @Test
    void buscarPorEstadoRetornaOk() {
        when(productoGestionService.buscarPorEstado(1)).thenReturn(List.of(producto()));

        ResponseEntity<List<Producto>> response = controller.buscarPorEstado(1);

        assertEquals(200, response.getStatusCode().value());
        verify(productoGestionService).buscarPorEstado(1);
    }

    @Test
    void crearProductoRetornaCreated() {
        Producto producto = producto();
        when(productoGestionService.guardar(producto)).thenReturn(producto);

        ResponseEntity<Producto> response = controller.crearProducto(producto);

        assertEquals(201, response.getStatusCode().value());
        assertEquals(producto, response.getBody());
    }

    @Test
    void actualizarProductoRetornaOk() {
        Producto producto = producto();
        when(productoGestionService.actualizar(1L, producto)).thenReturn(producto);

        ResponseEntity<Producto> response = controller.actualizarProducto(1L, producto);

        assertEquals(200, response.getStatusCode().value());
        verify(productoGestionService).actualizar(1L, producto);
    }

    @Test
    void cambiarEstadoRetornaOk() {
        Producto producto = producto();
        when(productoGestionService.cambiarEstado(1L, 0)).thenReturn(producto);

        ResponseEntity<Producto> response = controller.cambiarEstado(1L, 0);

        assertEquals(200, response.getStatusCode().value());
        verify(productoGestionService).cambiarEstado(1L, 0);
    }

    @Test
    void eliminarProductoRetornaNoContent() {
        ResponseEntity<Void> response = controller.eliminarProducto(1L);

        assertEquals(204, response.getStatusCode().value());
        verify(productoGestionService).eliminar(1L);
    }

    private Producto producto() {
        return new Producto(1L, "Notebook", "Notebook oficina", "Tecnologia", BigDecimal.valueOf(99990), 10, 1);
    }
}
