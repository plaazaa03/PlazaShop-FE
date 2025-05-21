import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pedido } from '../../model/pedido.model';
import { PedidosService } from '../../services/pedidos.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  pedidoSeleccionado: Pedido | null = null;
  metodoPago: string = '';
  direccionEnvio: string = '';
  carrito: any[] = [];
  total: number = 0;
  pedidoReciente: Pedido | null = null;

  constructor(
    private pedidosService: PedidosService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.cargarPedidos();
    this.cargarCarrito();
  }

  cargarPedidos() {
    this.pedidosService.obtenerPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;
      },
      error: (error) => {
        console.error('Error al obtener los pedidos', error);
      }
    });
  }

  cargarCarrito() {
    this.carritoService.obtenerCarrito().subscribe({
      next: (data) => {
        this.carrito = data;
        this.total = this.carrito.reduce((acc, item) => acc + item.cantidad * item.producto.precio, 0);
      },
      error: (error) => {
        console.error('Error al obtener el carrito', error);
      }
    });
  }

  verDetalles(pedido: Pedido) {
    this.pedidoSeleccionado = pedido;
    this.pedidoReciente = null;
  }

  realizarPedido() {
    if (!this.metodoPago || !this.direccionEnvio) {
      alert('Debes proporcionar un método de pago y dirección de envío.');
      return;
    }

    this.pedidosService.realizarPedido(this.metodoPago, this.direccionEnvio).subscribe({
      next: (response) => {
        alert('Pedido realizado con éxito ✅');
        this.carrito = [];
        this.total = 0;
        this.pedidoReciente = response.pedido; // Mostrar detalles del nuevo pedido
        this.pedidoSeleccionado = null;
        this.cargarPedidos();
      },
      error: (error) => {
        console.error('Error al realizar el pedido ❌', error);
        alert('Error al realizar el pedido');
      }
    });
  }
}
