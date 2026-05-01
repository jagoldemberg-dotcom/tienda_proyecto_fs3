package com.tienda.usuarios.dto;

import com.tienda.usuarios.exception.ErrorDetails;
import com.tienda.usuarios.model.Rol;
import com.tienda.usuarios.model.Usuario;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class UsuarioDtoModelTest {

    @Test
    void loginRequestPermiteGettersYSetters() {
        LoginRequest request = new LoginRequest();
        request.setCorreo("correo@tienda.cl");
        request.setPassword("Password123!");

        assertEquals("correo@tienda.cl", request.getCorreo());
        assertEquals("Password123!", request.getPassword());
    }

    @Test
    void loginResponsePermiteConstructorYSetters() {
        LoginResponse response = new LoginResponse(1L, "Cliente", "cliente@tienda.cl", "CLIENTE", "OK");

        response.setId(2L);
        response.setNombreCompleto("Admin");
        response.setCorreo("admin@tienda.cl");
        response.setRol("ADMIN");
        response.setMensaje("Actualizado");

        assertEquals(2L, response.getId());
        assertEquals("Admin", response.getNombreCompleto());
        assertEquals("admin@tienda.cl", response.getCorreo());
        assertEquals("ADMIN", response.getRol());
        assertEquals("Actualizado", response.getMensaje());
    }

    @Test
    void loginResponseConstructorVacioFunciona() {
        LoginResponse response = new LoginResponse();
        response.setMensaje("Creado");

        assertEquals("Creado", response.getMensaje());
    }

    @Test
    void usuarioPermiteConstructorYSetters() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombreCompleto("Cliente");
        usuario.setCorreo("cliente@tienda.cl");
        usuario.setPassword("Cliente123!");
        usuario.setRol(Rol.CLIENTE);
        usuario.setActivo(1);

        assertEquals(1L, usuario.getId());
        assertEquals("Cliente", usuario.getNombreCompleto());
        assertEquals("cliente@tienda.cl", usuario.getCorreo());
        assertEquals("Cliente123!", usuario.getPassword());
        assertEquals(Rol.CLIENTE, usuario.getRol());
        assertEquals(1, usuario.getActivo());
    }

    @Test
    void usuarioConstructorCompletoFunciona() {
        Usuario usuario = new Usuario(1L, "Admin", "admin@tienda.cl", "Admin123!", Rol.ADMIN, 1);

        assertEquals("Admin", usuario.getNombreCompleto());
        assertEquals(Rol.ADMIN, usuario.getRol());
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
