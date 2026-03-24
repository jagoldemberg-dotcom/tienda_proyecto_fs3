package com.tienda.productos.service;

import com.tienda.productos.dto.CompraRequest;
import com.tienda.productos.dto.CompraResponse;
import com.tienda.productos.exception.BusinessException;
import com.tienda.productos.exception.ResourceNotFoundException;
import com.tienda.productos.model.Compra;
import com.tienda.productos.model.Producto;
import com.tienda.productos.repository.CompraRepository;
import com.tienda.productos.repository.ProductoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CompraRepository compraRepository;

    public ProductoService(ProductoRepository productoRepository, CompraRepository compraRepository) {
        this.productoRepository = productoRepository;
        this.compraRepository = compraRepository;
    }

    public List<Producto> obtenerTodos() {
        log.info("Solicitando listado de productos.");
        return productoRepository.findAll();
    }

    public Producto obtenerPorId(Long id) {
        log.info("Buscando producto con ID: {}", id);
        return productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
    }

    public List<Producto> buscarPorNombre(String nombre) {
        log.info("Buscando productos por nombre: {}", nombre);
        return productoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    public List<Producto> buscarPorCategoria(String categoria) {
        log.info("Buscando productos por categoria: {}", categoria);
        return productoRepository.findByCategoriaIgnoreCase(categoria);
    }

    public Producto guardar(Producto producto) {
        log.info("Guardando producto: {}", producto.getNombre());

        if (producto.getActivo() == null) {
            producto.setActivo(1);
        }

        return productoRepository.save(producto);
    }

    public Producto actualizar(Long id, Producto datosActualizados) {
        log.info("Actualizando producto con ID: {}", id);

        Producto productoExistente = obtenerPorId(id);
        productoExistente.setNombre(datosActualizados.getNombre());
        productoExistente.setDescripcion(datosActualizados.getDescripcion());
        productoExistente.setCategoria(datosActualizados.getCategoria());
        productoExistente.setPrecio(datosActualizados.getPrecio());
        productoExistente.setStock(datosActualizados.getStock());
        productoExistente.setActivo(datosActualizados.getActivo() != null ? datosActualizados.getActivo() : productoExistente.getActivo());

        return productoRepository.save(productoExistente);
    }

    public void eliminar(Long id) {
        log.info("Eliminando producto con ID: {}", id);
        Producto producto = obtenerPorId(id);
        productoRepository.delete(producto);
    }

    public List<Compra> listarCompras() {
        log.info("Solicitando listado de compras.");
        return compraRepository.findAll();
    }

    @Transactional
    public CompraResponse comprar(Long productoId, CompraRequest compraRequest) {
        log.info("Procesando compra de producto ID: {}", productoId);

        Producto producto = obtenerPorId(productoId);

        if (producto.getActivo() == null || producto.getActivo() == 0) {
            throw new BusinessException("El producto no se encuentra disponible para la venta.");
        }

        if (compraRequest.getCantidad() > producto.getStock()) {
            throw new BusinessException("Stock insuficiente para completar la compra.");
        }

        int nuevoStock = producto.getStock() - compraRequest.getCantidad();
        producto.setStock(nuevoStock);
        productoRepository.save(producto);

        BigDecimal total = producto.getPrecio()
                .multiply(BigDecimal.valueOf(compraRequest.getCantidad()));

        Compra compra = new Compra();
        compra.setProductoId(producto.getId());
        compra.setNombreProducto(producto.getNombre());
        compra.setClienteNombre(compraRequest.getClienteNombre());
        compra.setClienteCorreo(compraRequest.getClienteCorreo());
        compra.setCantidad(compraRequest.getCantidad());
        compra.setTotal(total);
        compra.setFechaCompra(LocalDateTime.now());

        Compra compraGuardada = compraRepository.save(compra);

        return new CompraResponse(
                compraGuardada.getId(),
                compraGuardada.getProductoId(),
                compraGuardada.getNombreProducto(),
                compraGuardada.getClienteNombre(),
                compraGuardada.getClienteCorreo(),
                compraGuardada.getCantidad(),
                compraGuardada.getTotal(),
                compraGuardada.getFechaCompra(),
                "Compra realizada con éxito."
        );
    }
}
