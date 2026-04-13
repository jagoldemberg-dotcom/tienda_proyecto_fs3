export interface Producto { id: number; nombre: string; descripcion: string; categoria: string; precio: number; stock: number; activo: number; imagen: string; }
export interface Compra { id: number; productoId: number; nombreProducto: string; clienteNombre: string; clienteCorreo: string; cantidad: number; total: number; fechaCompra: string; }
