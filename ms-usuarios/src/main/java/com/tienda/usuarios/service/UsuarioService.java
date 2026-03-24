package com.tienda.usuarios.service;

import com.tienda.usuarios.dto.LoginRequest;
import com.tienda.usuarios.dto.LoginResponse;
import com.tienda.usuarios.exception.ConflictException;
import com.tienda.usuarios.exception.ResourceNotFoundException;
import com.tienda.usuarios.exception.UnauthorizedException;
import com.tienda.usuarios.model.Usuario;
import com.tienda.usuarios.repository.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> obtenerTodos() {
        log.info("Solicitando listado de usuarios.");
        return usuarioRepository.findAll();
    }

    public Usuario obtenerPorId(Long id) {
        log.info("Buscando usuario con ID: {}", id);
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
    }

    public Usuario guardar(Usuario usuario) {
        log.info("Registrando usuario con correo: {}", usuario.getCorreo());

        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new ConflictException("Ya existe un usuario registrado con el correo indicado.");
        }

        if (usuario.getActivo() == null) {
            usuario.setActivo(1);
        }

        return usuarioRepository.save(usuario);
    }

    public Usuario actualizar(Long id, Usuario datosActualizados) {
        log.info("Actualizando usuario con ID: {}", id);

        Usuario usuarioExistente = obtenerPorId(id);

        if (!usuarioExistente.getCorreo().equalsIgnoreCase(datosActualizados.getCorreo())
                && usuarioRepository.existsByCorreo(datosActualizados.getCorreo())) {
            throw new ConflictException("El correo ingresado ya está siendo usado por otro usuario.");
        }

        usuarioExistente.setNombreCompleto(datosActualizados.getNombreCompleto());
        usuarioExistente.setCorreo(datosActualizados.getCorreo());
        usuarioExistente.setPassword(datosActualizados.getPassword());
        usuarioExistente.setRol(datosActualizados.getRol());
        usuarioExistente.setActivo(datosActualizados.getActivo() != null ? datosActualizados.getActivo() : usuarioExistente.getActivo());

        return usuarioRepository.save(usuarioExistente);
    }

    public void eliminar(Long id) {
        log.info("Eliminando usuario con ID: {}", id);
        Usuario usuario = obtenerPorId(id);
        usuarioRepository.delete(usuario);
    }

    public LoginResponse login(LoginRequest loginRequest) {
        log.info("Intentando login para correo: {}", loginRequest.getCorreo());

        Usuario usuario = usuarioRepository.findByCorreo(loginRequest.getCorreo())
                .orElseThrow(() -> new UnauthorizedException("Credenciales inválidas."));

        if (!usuario.getPassword().equals(loginRequest.getPassword())) {
            throw new UnauthorizedException("Credenciales inválidas.");
        }

        if (usuario.getActivo() != null && usuario.getActivo() == 0) {
            throw new UnauthorizedException("El usuario se encuentra inactivo.");
        }

        return new LoginResponse(
                usuario.getId(),
                usuario.getNombreCompleto(),
                usuario.getCorreo(),
                usuario.getRol().name(),
                "Inicio de sesión exitoso."
        );
    }
}
