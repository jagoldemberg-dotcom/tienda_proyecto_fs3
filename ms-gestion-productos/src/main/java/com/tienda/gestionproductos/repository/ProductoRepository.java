package com.tienda.gestionproductos.repository;

import com.tienda.gestionproductos.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByCategoriaIgnoreCase(String categoria);
    List<Producto> findByActivo(Integer activo);
}
