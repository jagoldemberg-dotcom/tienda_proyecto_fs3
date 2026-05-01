package com.tienda.productos.controller;

import com.tienda.productos.dto.CompraRequest;
import com.tienda.productos.dto.CompraResponse;
import com.tienda.productos.model.Producto;
import com.tienda.productos.service.ProductoService;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductoControllerTest {

    private final ProductoService productoService = mock(ProductoService.class);
    private final ProductoController controller = new ProductoController(productoService);

    @Test
    void listarProductosRetornaOk() {
        when(productoService.obtenerTodos()).thenReturn(List.of(producto()));

        ResponseEntity<List<Producto>> response = controller.listarProductos();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void obtenerProductoRetornaOk() {
        when(productoService.obtenerPorId(1L)).thenReturn(producto());

        ResponseEntity<Producto> response = controller.obtenerProducto(1L);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("Notebook", response.getBody().getNombre());
    }

    @Test
    void buscarPorNombreRetornaOk() {
        when(productoService.buscarPorNombre("note")).thenReturn(List.of(producto()));

        ResponseEntity<List<Producto>> response = controller.buscarPorNombre("note");

        assertEquals(200, response.getStatusCode().value());
        verify(productoService).buscarPorNombre("note");
    }

    @Test
    void buscarPorCategoriaRetornaOk() {
        when(productoService.buscarPorCategoria("Tecnologia")).thenReturn(List.of(producto()));

        ResponseEntity<List<Producto>> response = controller.buscarPorCategoria("Tecnologia");

        assertEquals(200, response.getStatusCode().value());
        verify(productoService).buscarPorCategoria("Tecnologia");
    }

    @Test
    void crearProductoRetornaCreated() {
        Producto producto = producto();
        when(productoService.guardar(producto)).thenReturn(producto);

        ResponseEntity<Producto> response = controller.crearProducto(producto);

        assertEquals(201, response.getStatusCode().value());
        assertEquals(producto, response.getBody());
    }

    @Test
    void actualizarProductoRetornaOk() {
        Producto producto = producto();
        when(productoService.actualizar(1L, producto)).thenReturn(producto);

        ResponseEntity<Producto> response = controller.actualizarProducto(1L, producto);

        assertEquals(200, response.getStatusCode().value());
        verify(productoService).actualizar(1L, producto);
    }

    @Test
    void eliminarProductoRetornaNoContent() {
        ResponseEntity<Void> response = controller.eliminarProducto(1L);

        assertEquals(204, response.getStatusCode().value());
        verify(productoService).eliminar(1L);
    }

    @Test
    void comprarProductoRetornaOk() {
        CompraRequest request = new CompraRequest();
        CompraResponse compraResponse = new CompraResponse(1L, 1L, "Notebook", "Cliente", "cliente@tienda.cl", 1, BigDecimal.valueOf(99990), LocalDateTime.now(), "OK");
        when(productoService.comprar(1L, request)).thenReturn(compraResponse);

        ResponseEntity<CompraResponse> response = controller.comprarProducto(1L, request);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("OK", response.getBody().getMensaje());
    }

    private Producto producto() {
        return new Producto(1L, "Notebook", "Notebook oficina", "Tecnologia", BigDecimal.valueOf(99990), 10, 1);
    }
}
