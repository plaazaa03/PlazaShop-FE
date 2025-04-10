import { Component } from '@angular/core';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {
  carrito: any[] = [
    // ejemplo, luego esto lo pasas desde productos o un carritoService
    // { nombre: 'PC Gamer', precio: 999, cantidad: 1 }
  ];

  total: number = 0;

  constructor() {
    this.actualizarTotal();
  }

  actualizarTotal() {
    this.total = this.carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }

  eliminar(item: any) {
    this.carrito = this.carrito.filter(p => p !== item);
    this.actualizarTotal();
  }

  finalizarPedido() {
    console.log("Finalizando pedido...", this.carrito);
    // Aquí puedes hacer un POST a Laravel con los datos del pedido
  }
}
