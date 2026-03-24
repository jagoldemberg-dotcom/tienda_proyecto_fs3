package com.tienda.productos.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class CompraRequest {

    @NotBlank(message = "El nombre del cliente es obligatorio.")
    private String clienteNombre;

    @NotBlank(message = "El correo del cliente es obligatorio.")
    @Email(message = "El correo del cliente debe ser válido.")
    private String clienteCorreo;

    @Min(value = 1, message = "La cantidad debe ser al menos 1.")
    private Integer cantidad;

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
}
