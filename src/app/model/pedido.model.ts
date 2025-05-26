// Definición para los productos dentro de un pedido (puedes ajustar esto según tu modelo real)
export interface ProductoEnPedido {
  id: number; // o string
  nombre: string;
  imagen: string; // Para poder usar {{ producto.imagen }}
  pivot: {
    cantidad: number;
    precio_unitario: number; // Para poder usar {{ producto.pivot.precio_unitario }}
    // ... otras propiedades de pivot si existen
  };
  // ... otras propiedades del producto que necesites mostrar en los detalles del pedido
}

export class Pedido {
  id: number;
  user_id: number;
  total: number;
  estado: string;
  created_at: string; // O podrías usar Date y formatearla en la plantilla
  productos: ProductoEnPedido[]; // Usar la interfaz definida arriba

  // Propiedades que faltaban y causaban el error:
  direccion_envio?: string; // Opcional (con ?), si no siempre está presente
  metodo_pago?: string;    // Opcional (con ?), si no siempre está presente

  constructor(
    id: number,
    user_id: number,
    total: number,
    estado: string,
    created_at: string,
    productos: ProductoEnPedido[],
    direccion_envio?: string, // Añadir al constructor
    metodo_pago?: string      // Añadir al constructor
  ) {
    this.id = id;
    this.user_id = user_id;
    this.total = total;
    this.estado = estado;
    this.created_at = created_at;
    this.productos = productos;
    this.direccion_envio = direccion_envio; // Asignar en el constructor
    this.metodo_pago = metodo_pago;       // Asignar en el constructor
  }
}