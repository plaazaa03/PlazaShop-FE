export class Pedido {
  id: number;
  user_id: number;
  total: number;
  estado: string;
  created_at: string;
  productos: any[];

  constructor(
    id: number,
    user_id: number,
    total: number,
    estado: string,
    created_at: string,
    productos: any[]
  ) {
    this.id = id;
    this.user_id = user_id;
    this.total = total;
    this.estado = estado;
    this.created_at = created_at;
    this.productos = productos;
  }
}