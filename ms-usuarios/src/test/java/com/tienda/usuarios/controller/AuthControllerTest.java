package com.tienda.usuarios.controller;

import com.tienda.usuarios.dto.LoginRequest;
import com.tienda.usuarios.dto.LoginResponse;
import com.tienda.usuarios.service.UsuarioService;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @Test
    void loginDelegarAlServicioYRetornaOk() {
        UsuarioService usuarioService = mock(UsuarioService.class);
        AuthController controller = new AuthController(usuarioService);
        LoginRequest request = new LoginRequest();
        request.setCorreo("admin@tienda.cl");
        request.setPassword("Admin123!");
        LoginResponse response = new LoginResponse(1L, "Admin", "admin@tienda.cl", "ADMIN", "Inicio de sesión exitoso.");

        when(usuarioService.login(request)).thenReturn(response);

        ResponseEntity<LoginResponse> resultado = controller.login(request);

        assertEquals(200, resultado.getStatusCode().value());
        assertEquals("ADMIN", resultado.getBody().getRol());
        verify(usuarioService).login(request);
    }
}
