package com.tienda.productos.controller;

import com.tienda.productos.model.Compra;
import com.tienda.productos.service.ProductoService;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CompraControllerTest {

    @Test
    void listarComprasRetornaOk() {
        ProductoService productoService = mock(ProductoService.class);
        CompraController controller = new CompraController(productoService);
        Compra compra = new Compra();
        compra.setId(1L);
        compra.setTotal(BigDecimal.valueOf(1000));
        when(productoService.listarCompras()).thenReturn(List.of(compra));

        ResponseEntity<List<Compra>> response = controller.listarCompras();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1L, response.getBody().get(0).getId());
        verify(productoService).listarCompras();
    }
}
