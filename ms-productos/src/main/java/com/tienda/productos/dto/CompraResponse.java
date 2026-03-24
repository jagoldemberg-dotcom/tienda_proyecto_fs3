package com.tienda.productos.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CompraResponse {

    private Long compraId;
    private Long productoId;
    private String nombreProducto;
    private String clienteNombre;
    private String clienteCorreo;
    private Integer cantidad;
    private BigDecimal total;
    private LocalDateTime fechaCompra;
    private String mensaje;

    public CompraResponse() {
    }

    public CompraResponse(Long compraId, Long productoId, String nombreProducto, String clienteNombre, String clienteCorreo, Integer cantidad, BigDecimal total, LocalDateTime fechaCompra, String mensaje) {
        this.compraId = compraId;
        this.productoId = productoId;
        this.nombreProducto = nombreProducto;
        this.clienteNombre = clienteNombre;
        this.clienteCorreo = clienteCorreo;
        this.cantidad = cantidad;
        this.total = total;
        this.fechaCompra = fechaCompra;
        this.mensaje = mensaje;
    }

    public Long getCompraId() {
        return compraId;
    }

    public void setCompraId(Long compraId) {
        this.compraId = compraId;
    }

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
    }

    public String getClienteNombre() {
        return clienteNombre;
    }

    public void setClienteNombre(String clienteNombre) {
        this.clienteNombre = clienteNombre;
    }

    public String getClienteCorreo() {
        return clienteCorreo;
    }

    public void setClienteCorreo(String clienteCorreo) {
        this.clienteCorreo = clienteCorreo;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public LocalDateTime getFechaCompra() {
        return fechaCompra;
    }

    public void setFechaCompra(LocalDateTime fechaCompra) {
        this.fechaCompra = fechaCompra;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}
