package com.tienda.gestionproductos.controller;

import com.tienda.gestionproductos.model.Producto;
import com.tienda.gestionproductos.service.ProductoGestionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/admin/productos")
public class ProductoGestionController {

    private final ProductoGestionService productoGestionService;

    public ProductoGestionController(ProductoGestionService productoGestionService) {
        this.productoGestionService = productoGestionService;
    }

    @GetMapping
    public ResponseEntity<List<Producto>> listarProductos() {
        return ResponseEntity.ok(productoGestionService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProducto(@PathVariable Long id) {
        return ResponseEntity.ok(productoGestionService.obtenerPorId(id));
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Producto>> buscarPorCategoria(@PathVariable String categoria) {
        return ResponseEntity.ok(productoGestionService.buscarPorCategoria(categoria));
    }

    @GetMapping("/estado/{activo}")
    public ResponseEntity<List<Producto>> buscarPorEstado(@PathVariable Integer activo) {
        return ResponseEntity.ok(productoGestionService.buscarPorEstado(activo));
    }

    @PostMapping
    public ResponseEntity<Producto> crearProducto(@Valid @RequestBody Producto producto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productoGestionService.guardar(producto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id, @Valid @RequestBody Producto producto) {
        return ResponseEntity.ok(productoGestionService.actualizar(id, producto));
    }

    @PatchMapping("/{id}/estado/{activo}")
    public ResponseEntity<Producto> cambiarEstado(@PathVariable Long id, @PathVariable Integer activo) {
        return ResponseEntity.ok(productoGestionService.cambiarEstado(id, activo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoGestionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
