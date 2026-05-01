package com.tienda.usuarios.service;

import com.tienda.usuarios.dto.LoginRequest;
import com.tienda.usuarios.dto.LoginResponse;
import com.tienda.usuarios.exception.ConflictException;
import com.tienda.usuarios.exception.ResourceNotFoundException;
import com.tienda.usuarios.exception.UnauthorizedException;
import com.tienda.usuarios.model.Rol;
import com.tienda.usuarios.model.Usuario;
import com.tienda.usuarios.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    @Test
    void obtenerTodosRetornaListado() {
        Usuario usuario = crearUsuario(1L, "Ana Cliente", "ana@tienda.cl", "Cliente123!", Rol.CLIENTE, 1);
        when(usuarioRepository.findAll()).thenReturn(List.of(usuario));

        List<Usuario> resultado = usuarioService.obtenerTodos();

        assertEquals(1, resultado.size());
        assertEquals("Ana Cliente", resultado.get(0).getNombreCompleto());
        verify(usuarioRepository).findAll();
    }

    @Test
    void obtenerPorIdCuandoExisteRetornaUsuario() {
        Usuario usuario = crearUsuario(1L, "Ana Cliente", "ana@tienda.cl", "Cliente123!", Rol.CLIENTE, 1);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        Usuario resultado = usuarioService.obtenerPorId(1L);

        assertEquals(1L, resultado.getId());
        assertEquals("ana@tienda.cl", resultado.getCorreo());
    }

    @Test
    void obtenerPorIdCuandoNoExisteLanzaExcepcion() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        ResourceNotFoundException ex = assertThrows(ResourceNotFoundException.class,
                () -> usuarioService.obtenerPorId(99L));

        assertTrue(ex.getMessage().contains("Usuario no encontrado"));
    }

    @Test
    void guardarUsuarioNuevoConActivoNullAsignaActivoUno() {
        Usuario usuario = crearUsuario(null, "Nuevo Usuario", "nuevo@tienda.cl", "Cliente123!", Rol.CLIENTE, null);
        Usuario guardado = crearUsuario(5L, "Nuevo Usuario", "nuevo@tienda.cl", "Cliente123!", Rol.CLIENTE, 1);

        when(usuarioRepository.existsByCorreo("nuevo@tienda.cl")).thenReturn(false);
        when(usuarioRepository.save(usuario)).thenReturn(guardado);

        Usuario resultado = usuarioService.guardar(usuario);

        assertEquals(1, usuario.getActivo());
        assertEquals(5L, resultado.getId());
        verify(usuarioRepository).save(usuario);
    }

    @Test
    void guardarUsuarioConCorreoExistenteLanzaConflicto() {
        Usuario usuario = crearUsuario(null, "Repetido", "repetido@tienda.cl", "Cliente123!", Rol.CLIENTE, 1);
        when(usuarioRepository.existsByCorreo("repetido@tienda.cl")).thenReturn(true);

        ConflictException ex = assertThrows(ConflictException.class, () -> usuarioService.guardar(usuario));

        assertTrue(ex.getMessage().contains("Ya existe"));
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void actualizarConMismoCorreoActualizaCamposYMantieneActivoSiVieneNull() {
        Usuario existente = crearUsuario(1L, "Nombre Antiguo", "ana@tienda.cl", "Antigua123!", Rol.CLIENTE, 1);
        Usuario datos = crearUsuario(null, "Nombre Nuevo", "ana@tienda.cl", "Nueva123!", Rol.ADMIN, null);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(existente));
        when(usuarioRepository.save(existente)).thenReturn(existente);

        Usuario resultado = usuarioService.actualizar(1L, datos);

        assertEquals("Nombre Nuevo", resultado.getNombreCompleto());
        assertEquals("Nueva123!", resultado.getPassword());
        assertEquals(Rol.ADMIN, resultado.getRol());
        assertEquals(1, resultado.getActivo());
        verify(usuarioRepository, never()).existsByCorreo(anyString());
    }

    @Test
    void actualizarConCorreoNuevoDisponibleActualiza() {
        Usuario existente = crearUsuario(1L, "Nombre", "antiguo@tienda.cl", "Cliente123!", Rol.CLIENTE, 1);
        Usuario datos = crearUsuario(null, "Nombre", "nuevo@tienda.cl", "Cliente123!", Rol.CLIENTE, 0);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(existente));
        when(usuarioRepository.existsByCorreo("nuevo@tienda.cl")).thenReturn(false);
        when(usuarioRepository.save(existente)).thenReturn(existente);

        Usuario resultado = usuarioService.actualizar(1L, datos);

        assertEquals("nuevo@tienda.cl", resultado.getCorreo());
        assertEquals(0, resultado.getActivo());
    }

    @Test
    void actualizarConCorreoUsadoPorOtroUsuarioLanzaConflicto() {
        Usuario existente = crearUsuario(1L, "Nombre", "antiguo@tienda.cl", "Cliente123!", Rol.CLIENTE, 1);
        Usuario datos = crearUsuario(null, "Nombre", "usado@tienda.cl", "Cliente123!", Rol.CLIENTE, 1);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(existente));
        when(usuarioRepository.existsByCorreo("usado@tienda.cl")).thenReturn(true);

        assertThrows(ConflictException.class, () -> usuarioService.actualizar(1L, datos));
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void eliminarBuscaYEliminaUsuario() {
        Usuario usuario = crearUsuario(1L, "Ana", "ana@tienda.cl", "Cliente123!", Rol.CLIENTE, 1);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        usuarioService.eliminar(1L);

        verify(usuarioRepository).delete(usuario);
    }

    @Test
    void loginCorrectoRetornaDatosDelUsuario() {
        Usuario usuario = crearUsuario(1L, "Admin Tienda", "admin@tienda.cl", "Admin123!", Rol.ADMIN, 1);
        LoginRequest request = loginRequest("admin@tienda.cl", "Admin123!");

        when(usuarioRepository.findByCorreo("admin@tienda.cl")).thenReturn(Optional.of(usuario));

        LoginResponse response = usuarioService.login(request);

        assertEquals(1L, response.getId());
        assertEquals("Admin Tienda", response.getNombreCompleto());
        assertEquals("ADMIN", response.getRol());
        assertEquals("Inicio de sesión exitoso.", response.getMensaje());
    }

    @Test
    void loginConCorreoInexistenteLanzaUnauthorized() {
        LoginRequest request = loginRequest("nadie@tienda.cl", "Admin123!");
        when(usuarioRepository.findByCorreo("nadie@tienda.cl")).thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class, () -> usuarioService.login(request));
    }

    @Test
    void loginConPasswordIncorrectaLanzaUnauthorized() {
        Usuario usuario = crearUsuario(1L, "Admin", "admin@tienda.cl", "Admin123!", Rol.ADMIN, 1);
        LoginRequest request = loginRequest("admin@tienda.cl", "Mala123!");

        when(usuarioRepository.findByCorreo("admin@tienda.cl")).thenReturn(Optional.of(usuario));

        assertThrows(UnauthorizedException.class, () -> usuarioService.login(request));
    }

    @Test
    void loginConUsuarioInactivoLanzaUnauthorized() {
        Usuario usuario = crearUsuario(1L, "Admin", "admin@tienda.cl", "Admin123!", Rol.ADMIN, 0);
        LoginRequest request = loginRequest("admin@tienda.cl", "Admin123!");

        when(usuarioRepository.findByCorreo("admin@tienda.cl")).thenReturn(Optional.of(usuario));

        UnauthorizedException ex = assertThrows(UnauthorizedException.class, () -> usuarioService.login(request));
        assertTrue(ex.getMessage().contains("inactivo"));
    }

    private Usuario crearUsuario(Long id, String nombre, String correo, String password, Rol rol, Integer activo) {
        return new Usuario(id, nombre, correo, password, rol, activo);
    }

    private LoginRequest loginRequest(String correo, String password) {
        LoginRequest request = new LoginRequest();
        request.setCorreo(correo);
        request.setPassword(password);
        return request;
    }
}
