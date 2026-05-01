package com.tienda.gestionproductos.model;

import com.tienda.gestionproductos.exception.ErrorDetails;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class ProductoGestionModelTest {

    @Test
    void productoPermiteConstructorVacioYSetters() {
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
    void errorDetailsRetornaDatos() {
        LocalDateTime fecha = LocalDateTime.now();
        ErrorDetails error = new ErrorDetails(fecha, "Mensaje", "Detalle");

        assertEquals(fecha, error.getTimestamp());
        assertEquals("Mensaje", error.getMessage());
        assertEquals("Detalle", error.getDetails());
    }
}
