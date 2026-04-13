package com.tienda.productos.controller;

import com.tienda.productos.model.Compra;
import com.tienda.productos.service.ProductoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/compras")
public class CompraController {

    private final ProductoService productoService;

    public CompraController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public ResponseEntity<List<Compra>> listarCompras() {
        return ResponseEntity.ok(productoService.listarCompras());
    }
}
