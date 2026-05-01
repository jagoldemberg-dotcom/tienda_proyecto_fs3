package com.tienda.gestionproductos.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.context.request.WebRequest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();
    private final WebRequest request = mock(WebRequest.class);

    @Test
    void manejarRecursoNoEncontradoRetornaNotFound() {
        when(request.getDescription(false)).thenReturn("uri=/api/admin/productos/1");

        ResponseEntity<ErrorDetails> response = handler.manejarRecursoNoEncontrado(
                new ResourceNotFoundException("Producto no encontrado"), request);

        assertEquals(404, response.getStatusCode().value());
        assertEquals("Producto no encontrado", response.getBody().getMessage());
    }

    @Test
    void manejarValidacionesRetornaBadRequest() {
        MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);
        when(request.getDescription(false)).thenReturn("uri=/api/admin/productos");
        when(ex.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getFieldErrors()).thenReturn(List.of(
                new FieldError("producto", "nombre", "El nombre del producto es obligatorio.")
        ));

        ResponseEntity<ErrorDetails> response = handler.manejarValidaciones(ex, request);

        assertEquals(400, response.getStatusCode().value());
        assertTrue(response.getBody().getMessage().contains("Validación fallida"));
    }

    @Test
    void manejarGeneralRetornaInternalServerError() {
        when(request.getDescription(false)).thenReturn("uri=/api/admin/productos");

        ResponseEntity<ErrorDetails> response = handler.manejarGeneral(new RuntimeException("Error"), request);

        assertEquals(500, response.getStatusCode().value());
        assertEquals("Ocurrió un error interno en el servidor.", response.getBody().getMessage());
    }

    @Test
    void resourceNotFoundConservaMensaje() {
        assertEquals("no encontrado", new ResourceNotFoundException("no encontrado").getMessage());
    }
}
