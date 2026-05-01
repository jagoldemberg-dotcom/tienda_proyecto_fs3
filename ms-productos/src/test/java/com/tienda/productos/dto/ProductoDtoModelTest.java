package com.tienda.productos.dto;

import com.tienda.productos.exception.ErrorDetails;
import com.tienda.productos.model.Compra;
import com.tienda.productos.model.Producto;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class ProductoDtoModelTest {

    @Test
    void productoPermiteConstructorYSetters() {
        Producto producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Notebook");
        producto.setDescripcion("Notebook oficina");
        producto.setCategoria("Tecnologia");
        producto.setPrecio(BigDecimal.valueOf(99990));
        producto.setStock(10);
        producto.setActivo(1);

        assertEquals(1L, producto.getId());
        assertEquals("Notebook", producto.getNombre());
        assertEquals("Notebook oficina", producto.getDescripcion());
        assertEquals("Tecnologia", producto.getCategoria());
        assertEquals(BigDecimal.valueOf(99990), producto.getPrecio());
        assertEquals(10, producto.getStock());
        assertEquals(1, producto.getActivo());
    }

    @Test
    void productoConstructorCompletoFunciona() {
        Producto producto = new Producto(1L, "Mouse", "Mouse gamer", "Accesorios", BigDecimal.valueOf(19990), 20, 1);

        assertEquals("Mouse", producto.getNombre());
        assertEquals("Accesorios", producto.getCategoria());
    }

    @Test
    void compraPermiteConstructorYSetters() {
        LocalDateTime fecha = LocalDateTime.now();
        Compra compra = new Compra();
        compra.setId(1L);
        compra.setProductoId(2L);
        compra.setNombreProducto("Notebook");
        compra.setClienteNombre("Cliente");
        compra.setClienteCorreo("cliente@tienda.cl");
        compra.setCantidad(3);
        compra.setTotal(BigDecimal.valueOf(3000));
        compra.setFechaCompra(fecha);

        assertEquals(1L, compra.getId());
        assertEquals(2L, compra.getProductoId());
        assertEquals("Notebook", compra.getNombreProducto());
        assertEquals("Cliente", compra.getClienteNombre());
        assertEquals("cliente@tienda.cl", compra.getClienteCorreo());
        assertEquals(3, compra.getCantidad());
        assertEquals(BigDecimal.valueOf(3000), compra.getTotal());
        assertEquals(fecha, compra.getFechaCompra());
    }

    @Test
    void compraConstructorCompletoFunciona() {
        LocalDateTime fecha = LocalDateTime.now();
        Compra compra = new Compra(1L, 2L, "Notebook", "Cliente", "cliente@tienda.cl", 1, BigDecimal.valueOf(1000), fecha);

        assertEquals(1L, compra.getId());
        assertEquals(fecha, compra.getFechaCompra());
    }

    @Test
    void compraRequestPermiteGettersYSetters() {
        CompraRequest request = new CompraRequest();
        request.setClienteNombre("Cliente");
        request.setClienteCorreo("cliente@tienda.cl");
        request.setCantidad(2);

        assertEquals("Cliente", request.getClienteNombre());
        assertEquals("cliente@tienda.cl", request.getClienteCorreo());
        assertEquals(2, request.getCantidad());
    }

    @Test
    void compraResponsePermiteConstructorYSetters() {
        LocalDateTime fecha = LocalDateTime.now();
        CompraResponse response = new CompraResponse(1L, 2L, "Notebook", "Cliente", "cliente@tienda.cl", 2, BigDecimal.valueOf(2000), fecha, "OK");

        response.setCompraId(3L);
        response.setProductoId(4L);
        response.setNombreProducto("Mouse");
        response.setClienteNombre("Otro Cliente");
        response.setClienteCorreo("otro@tienda.cl");
        response.setCantidad(5);
        response.setTotal(BigDecimal.valueOf(5000));
        response.setFechaCompra(fecha.plusDays(1));
        response.setMensaje("Actualizado");

        assertEquals(3L, response.getCompraId());
        assertEquals(4L, response.getProductoId());
        assertEquals("Mouse", response.getNombreProducto());
        assertEquals("Otro Cliente", response.getClienteNombre());
        assertEquals("otro@tienda.cl", response.getClienteCorreo());
        assertEquals(5, response.getCantidad());
        assertEquals(BigDecimal.valueOf(5000), response.getTotal());
        assertEquals(fecha.plusDays(1), response.getFechaCompra());
        assertEquals("Actualizado", response.getMensaje());
    }

    @Test
    void compraResponseConstructorVacioFunciona() {
        CompraResponse response = new CompraResponse();
        response.setMensaje("OK");

        assertEquals("OK", response.getMensaje());
    }

    @Test
    void errorDetailsRetornaDatos() {
        LocalDateTime fecha = LocalDateTime.now();
        ErrorDetails error = new ErrorDetails(fecha, "Mensaje", "Detalle");

        assertEquals(fecha, error.getTimestamp());
        assertEquals("Mensaje", error.getMessage());
        assertEquals("Detalle", error.getDetails());
    }
}
