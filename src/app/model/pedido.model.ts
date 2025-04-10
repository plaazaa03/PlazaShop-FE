// src/app/models/pedido.model.ts

export interface Pedido {
    user_id: number;   // ID del usuario que hizo el pedido
    total: number;     // Total del pedido (puede ser un número decimal)
    estado: string;    // Estado del pedido (por ejemplo, "pendiente", "completado", "enviado", etc.)
    // Si tu API también devuelve un ID de pedido o alguna otra propiedad, agrégalo aquí.
    id?: number;       // ID del pedido (opcional, ya que no todos los pedidos lo pueden tener)
    fecha?: string;    // Fecha del pedido (opcional, si tienes este campo en la base de datos)
  }
  