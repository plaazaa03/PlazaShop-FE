export interface ProductoEnPedido {
  id: number;
  nombre: string;
  imagen: string;
  pivot: {
    cantidad: number;
    precio_unitario: number; 
   
  };
  
}

export class Pedido {
  id: number;
  user_id: number;
  total: number;
  estado: string;
  created_at: string;
  productos: ProductoEnPedido[];

  direccion_envio?: string; 
  metodo_pago?: string;

  constructor(
    id: number,
    user_id: number,
    total: number,
    estado: string,
    created_at: string,
    productos: ProductoEnPedido[],
    direccion_envio?: string, 
    metodo_pago?: string
  ) {
    this.id = id;
    this.user_id = user_id;
    this.total = total;
    this.estado = estado;
    this.created_at = created_at;
    this.productos = productos;
    this.direccion_envio = direccion_envio; 
    this.metodo_pago = metodo_pago;
  }
}