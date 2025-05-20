import { Component } from '@angular/core';
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
export class PedidosComponent {
  pedidos: Pedido[] = [];
  pedidoSeleccionado: Pedido | null = null;
  metodoPago: string = "";
  direccionEnvio: string = "";
  carrito: any[] = [];

  constructor(private pedidosService: PedidosService, private carritoService: CarritoService) { }

  ngOnInit(): void {
    // Obtener los pedidos al cargar el componente
    this.pedidosService.obtenerPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;
      },
      error: (error) => {
        console.error('Error al obtener los pedidos', error);
      }
    });

    // Obtener el carrito del usuario
    this.carritoService.obtenerCarrito().subscribe({
      next: (data) => {
        this.carrito = data;
      },
      error: (error) => {
        console.error('Error al obtener el carrito', error);
      }
    });
  }

  verDetalles(pedido: Pedido) {
    this.pedidoSeleccionado = pedido;
  }

  realizarPedido() {
    const pedido = this.pedidoSeleccionado;
    const metodoPago = this.metodoPago;
    const direccionEnvio = this.direccionEnvio;

    if (pedido) {
      // Llamar a la API para realizar el pedido
      this.pedidosService.realizarPedido(pedido, metodoPago, direccionEnvio).subscribe({
        next: (data) => {
          console.log('Pedido realizado con éxito:', data);
        },
        error: (error) => {
          console.error('Error al realizar el pedido:', error);
        }
      });
    } else {
      console.error('No se ha seleccionado un pedido');
    }
  }

  finalizarPedido() {
    // Mostrar los datos del carrito en la vista del pedido
    console.log('Carrito:', this.carrito);
  }
}