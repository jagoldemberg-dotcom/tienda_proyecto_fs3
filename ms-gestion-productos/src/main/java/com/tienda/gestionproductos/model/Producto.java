package com.tienda.gestionproductos.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Entity
@Table(name = "PRODUCTOS")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del producto es obligatorio.")
    @Size(max = 120, message = "El nombre del producto no puede superar los 120 caracteres.")
    @Column(name = "NOMBRE", nullable = false, length = 120)
    private String nombre;

    @NotBlank(message = "La descripción es obligatoria.")
    @Size(max = 300, message = "La descripción no puede superar los 300 caracteres.")
    @Column(name = "DESCRIPCION", nullable = false, length = 300)
    private String descripcion;

    @NotBlank(message = "La categoría es obligatoria.")
    @Size(max = 80, message = "La categoría no puede superar los 80 caracteres.")
    @Column(name = "CATEGORIA", nullable = false, length = 80)
    private String categoria;

    @NotNull(message = "El precio es obligatorio.")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor que cero.")
    @Digits(integer = 8, fraction = 2, message = "El precio debe tener formato válido.")
    @Column(name = "PRECIO", nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @NotNull(message = "El stock es obligatorio.")
    @Min(value = 0, message = "El stock no puede ser negativo.")
    @Column(name = "STOCK", nullable = false)
    private Integer stock;

    @Column(name = "ACTIVO", nullable = false)
    private Integer activo = 1;

    public Producto() {}

    public Producto(Long id, String nombre, String descripcion, String categoria, BigDecimal precio, Integer stock, Integer activo) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.precio = precio;
        this.stock = stock;
        this.activo = activo;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public Integer getActivo() { return activo; }
    public void setActivo(Integer activo) { this.activo = activo; }
}
