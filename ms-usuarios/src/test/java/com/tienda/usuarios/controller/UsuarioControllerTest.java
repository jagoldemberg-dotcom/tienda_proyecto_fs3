package com.tienda.usuarios.controller;

import com.tienda.usuarios.model.Rol;
import com.tienda.usuarios.model.Usuario;
import com.tienda.usuarios.service.UsuarioService;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UsuarioControllerTest {

    private final UsuarioService usuarioService = mock(UsuarioService.class);
    private final UsuarioController controller = new UsuarioController(usuarioService);

    @Test
    void listarUsuariosRetornaOk() {
        when(usuarioService.obtenerTodos()).thenReturn(List.of(usuario()));

        ResponseEntity<List<Usuario>> response = controller.listarUsuarios();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
        verify(usuarioService).obtenerTodos();
    }

    @Test
    void obtenerUsuarioRetornaOk() {
        when(usuarioService.obtenerPorId(1L)).thenReturn(usuario());

        ResponseEntity<Usuario> response = controller.obtenerUsuario(1L);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("cliente@tienda.cl", response.getBody().getCorreo());
    }

    @Test
    void crearUsuarioRetornaCreated() {
        Usuario usuario = usuario();
        when(usuarioService.guardar(usuario)).thenReturn(usuario);

        ResponseEntity<Usuario> response = controller.crearUsuario(usuario);

        assertEquals(201, response.getStatusCode().value());
        assertEquals(usuario, response.getBody());
    }

    @Test
    void actualizarUsuarioRetornaOk() {
        Usuario usuario = usuario();
        when(usuarioService.actualizar(1L, usuario)).thenReturn(usuario);

        ResponseEntity<Usuario> response = controller.actualizarUsuario(1L, usuario);

        assertEquals(200, response.getStatusCode().value());
        verify(usuarioService).actualizar(1L, usuario);
    }

    @Test
    void eliminarUsuarioRetornaNoContent() {
        ResponseEntity<Void> response = controller.eliminarUsuario(1L);

        assertEquals(204, response.getStatusCode().value());
        verify(usuarioService).eliminar(1L);
    }

    private Usuario usuario() {
        return new Usuario(1L, "Cliente Demo", "cliente@tienda.cl", "Cliente123!", Rol.CLIENTE, 1);
    }
}
