package com.tienda.productos.service;

import com.tienda.productos.dto.CompraRequest;
import com.tienda.productos.dto.CompraResponse;
import com.tienda.productos.exception.BusinessException;
import com.tienda.productos.exception.ResourceNotFoundException;
import com.tienda.productos.model.Compra;
import com.tienda.productos.model.Producto;
import com.tienda.productos.repository.CompraRepository;
import com.tienda.productos.repository.ProductoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private CompraRepository compraRepository;

    @InjectMocks
    private ProductoService productoService;

    @Test
    void obtenerTodosRetornaListado() {
        when(productoRepository.findAll()).thenReturn(List.of(producto(1L, 10, 1)));

        List<Producto> resultado = productoService.obtenerTodos();

        assertEquals(1, resultado.size());
        verify(productoRepository).findAll();
    }

    @Test
    void obtenerPorIdCuandoExisteRetornaProducto() {
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto(1L, 10, 1)));

        Producto resultado = productoService.obtenerPorId(1L);

        assertEquals("Notebook", resultado.getNombre());
    }

    @Test
    void obtenerPorIdCuandoNoExisteLanzaExcepcion() {
        when(productoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productoService.obtenerPorId(99L));
    }

    @Test
    void buscarPorNombreRetornaCoincidencias() {
        when(productoRepository.findByNombreContainingIgnoreCase("note")).thenReturn(List.of(producto(1L, 10, 1)));

        List<Producto> resultado = productoService.buscarPorNombre("note");

        assertEquals(1, resultado.size());
        verify(productoRepository).findByNombreContainingIgnoreCase("note");
    }

    @Test
    void buscarPorCategoriaRetornaCoincidencias() {
        when(productoRepository.findByCategoriaIgnoreCase("tecnologia")).thenReturn(List.of(producto(1L, 10, 1)));

        List<Producto> resultado = productoService.buscarPorCategoria("tecnologia");

        assertEquals(1, resultado.size());
        verify(productoRepository).findByCategoriaIgnoreCase("tecnologia");
    }

    @Test
    void guardarConActivoNullAsignaActivoUno() {
        Producto producto = producto(null, 4, null);
        Producto guardado = producto(1L, 4, 1);
        when(productoRepository.save(producto)).thenReturn(guardado);

        Producto resultado = productoService.guardar(producto);

        assertEquals(1, producto.getActivo());
        assertEquals(1L, resultado.getId());
    }

    @Test
    void guardarConActivoInformadoLoMantiene() {
        Producto producto = producto(null, 4, 0);
        when(productoRepository.save(producto)).thenReturn(producto);

        Producto resultado = productoService.guardar(producto);

        assertEquals(0, resultado.getActivo());
    }

    @Test
    void actualizarModificaCamposYMantieneActivoSiVieneNull() {
        Producto existente = producto(1L, 10, 1);
        Producto datos = new Producto(null, "Mouse", "Mouse gamer", "Accesorios", BigDecimal.valueOf(19990), 20, null);

        when(productoRepository.findById(1L)).thenReturn(Optional.of(existente));
        when(productoRepository.save(existente)).thenReturn(existente);

        Producto resultado = productoService.actualizar(1L, datos);

        assertEquals("Mouse", resultado.getNombre());
        assertEquals("Accesorios", resultado.getCategoria());
        assertEquals(20, resultado.getStock());
        assertEquals(1, resultado.getActivo());
    }

    @Test
    void actualizarModificaActivoSiVieneInformado() {
        Producto existente = producto(1L, 10, 1);
        Producto datos = producto(null, 5, 0);

        when(productoRepository.findById(1L)).thenReturn(Optional.of(existente));
        when(productoRepository.save(existente)).thenReturn(existente);

        Producto resultado = productoService.actualizar(1L, datos);

        assertEquals(0, resultado.getActivo());
    }

    @Test
    void eliminarBuscaYEliminaProducto() {
        Producto producto = producto(1L, 10, 1);
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));

        productoService.eliminar(1L);

        verify(productoRepository).delete(producto);
    }

    @Test
    void listarComprasRetornaListado() {
        Compra compra = compra(1L);
        when(compraRepository.findAll()).thenReturn(List.of(compra));

        List<Compra> resultado = productoService.listarCompras();

        assertEquals(1, resultado.size());
        assertEquals(1L, resultado.get(0).getId());
    }

    @Test
    void comprarProductoDisponibleDescuentaStockYGuardaCompra() {
        Producto producto = producto(1L, 10, 1);
        CompraRequest request = compraRequest(3);
        Compra compraGuardada = compra(99L);

        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));
        when(compraRepository.save(any(Compra.class))).thenReturn(compraGuardada);

        CompraResponse response = productoService.comprar(1L, request);

        assertEquals(7, producto.getStock());
        assertEquals(99L, response.getCompraId());
        assertEquals("Compra realizada con éxito.", response.getMensaje());
        verify(productoRepository).save(producto);

        ArgumentCaptor<Compra> captor = ArgumentCaptor.forClass(Compra.class);
        verify(compraRepository).save(captor.capture());
        assertEquals(BigDecimal.valueOf(299970), captor.getValue().getTotal());
        assertEquals("Cliente Demo", captor.getValue().getClienteNombre());
    }

    @Test
    void comprarProductoInactivoLanzaBusinessException() {
        Producto producto = producto(1L, 10, 0);
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));

        BusinessException ex = assertThrows(BusinessException.class,
                () -> productoService.comprar(1L, compraRequest(1)));

        assertTrue(ex.getMessage().contains("no se encuentra disponible"));
        verify(compraRepository, never()).save(any());
    }

    @Test
    void comprarProductoConActivoNullLanzaBusinessException() {
        Producto producto = producto(1L, 10, null);
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));

        assertThrows(BusinessException.class, () -> productoService.comprar(1L, compraRequest(1)));
        verify(productoRepository, never()).save(producto);
    }

    @Test
    void comprarSinStockSuficienteLanzaBusinessException() {
        Producto producto = producto(1L, 2, 1);
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));

        BusinessException ex = assertThrows(BusinessException.class,
                () -> productoService.comprar(1L, compraRequest(5)));

        assertTrue(ex.getMessage().contains("Stock insuficiente"));
        verify(compraRepository, never()).save(any());
    }

    private Producto producto(Long id, Integer stock, Integer activo) {
        return new Producto(id, "Notebook", "Notebook oficina", "Tecnologia", BigDecimal.valueOf(99990), stock, activo);
    }

    private CompraRequest compraRequest(Integer cantidad) {
        CompraRequest request = new CompraRequest();
        request.setClienteNombre("Cliente Demo");
        request.setClienteCorreo("cliente@tienda.cl");
        request.setCantidad(cantidad);
        return request;
    }

    private Compra compra(Long id) {
        Compra compra = new Compra();
        compra.setId(id);
        compra.setProductoId(1L);
        compra.setNombreProducto("Notebook");
        compra.setClienteNombre("Cliente Demo");
        compra.setClienteCorreo("cliente@tienda.cl");
        compra.setCantidad(3);
        compra.setTotal(BigDecimal.valueOf(299970));
        return compra;
    }
}
