package com.tienda.usuarios.exception;

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
        when(request.getDescription(false)).thenReturn("uri=/api/usuarios/1");

        ResponseEntity<ErrorDetails> response = handler.manejarRecursoNoEncontrado(
                new ResourceNotFoundException("No encontrado"), request);

        assertEquals(404, response.getStatusCode().value());
        assertEquals("No encontrado", response.getBody().getMessage());
    }

    @Test
    void manejarConflictoRetornaConflict() {
        when(request.getDescription(false)).thenReturn("uri=/api/usuarios");

        ResponseEntity<ErrorDetails> response = handler.manejarConflicto(
                new ConflictException("Correo repetido"), request);

        assertEquals(409, response.getStatusCode().value());
        assertTrue(response.getBody().getMessage().contains("Correo"));
    }

    @Test
    void manejarNoAutorizadoRetornaUnauthorized() {
        when(request.getDescription(false)).thenReturn("uri=/api/auth/login");

        ResponseEntity<ErrorDetails> response = handler.manejarNoAutorizado(
                new UnauthorizedException("Credenciales inválidas."), request);

        assertEquals(401, response.getStatusCode().value());
        assertEquals("Credenciales inválidas.", response.getBody().getMessage());
    }

    @Test
    void manejarValidacionesRetornaBadRequest() {
        MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);
        when(request.getDescription(false)).thenReturn("uri=/api/usuarios");
        when(ex.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getFieldErrors()).thenReturn(List.of(
                new FieldError("usuario", "correo", "El correo debe tener un formato válido.")
        ));

        ResponseEntity<ErrorDetails> response = handler.manejarValidaciones(ex, request);

        assertEquals(400, response.getStatusCode().value());
        assertTrue(response.getBody().getMessage().contains("Validación fallida"));
    }

    @Test
    void manejarGeneralRetornaInternalServerError() {
        when(request.getDescription(false)).thenReturn("uri=/api/usuarios");

        ResponseEntity<ErrorDetails> response = handler.manejarGeneral(new RuntimeException("Error"), request);

        assertEquals(500, response.getStatusCode().value());
        assertEquals("Ocurrió un error interno en el servidor.", response.getBody().getMessage());
    }

    @Test
    void excepcionesPersonalizadasConservanMensaje() {
        assertEquals("conflicto", new ConflictException("conflicto").getMessage());
        assertEquals("no autorizado", new UnauthorizedException("no autorizado").getMessage());
        assertEquals("no encontrado", new ResourceNotFoundException("no encontrado").getMessage());
    }
}
