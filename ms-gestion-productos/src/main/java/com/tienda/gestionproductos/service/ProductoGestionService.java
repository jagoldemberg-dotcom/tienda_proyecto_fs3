package com.tienda.gestionproductos.service;

import com.tienda.gestionproductos.exception.ResourceNotFoundException;
import com.tienda.gestionproductos.model.Producto;
import com.tienda.gestionproductos.repository.ProductoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class ProductoGestionService {

    private final ProductoRepository productoRepository;

    public ProductoGestionService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }

    public Producto obtenerPorId(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
    }

    public List<Producto> buscarPorCategoria(String categoria) {
        return productoRepository.findByCategoriaIgnoreCase(categoria);
    }

    public List<Producto> buscarPorEstado(Integer activo) {
        return productoRepository.findByActivo(activo);
    }

    public Producto guardar(Producto producto) {
        if (producto.getActivo() == null) {
            producto.setActivo(1);
        }
        return productoRepository.save(producto);
    }

    public Producto actualizar(Long id, Producto datosActualizados) {
        Producto productoExistente = obtenerPorId(id);
        productoExistente.setNombre(datosActualizados.getNombre());
        productoExistente.setDescripcion(datosActualizados.getDescripcion());
        productoExistente.setCategoria(datosActualizados.getCategoria());
        productoExistente.setPrecio(datosActualizados.getPrecio());
        productoExistente.setStock(datosActualizados.getStock());
        productoExistente.setActivo(datosActualizados.getActivo() != null ? datosActualizados.getActivo() : productoExistente.getActivo());
        return productoRepository.save(productoExistente);
    }

    public Producto cambiarEstado(Long id, Integer activo) {
        Producto producto = obtenerPorId(id);
        producto.setActivo(activo);
        return productoRepository.save(producto);
    }

    public void eliminar(Long id) {
        Producto producto = obtenerPorId(id);
        productoRepository.delete(producto);
    }
}
