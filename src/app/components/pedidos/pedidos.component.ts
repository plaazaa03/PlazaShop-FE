import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { Pedido } from '../../model/pedido.model';
import { PedidosService } from '../../services/pedidos.service';
import { CarritoService } from '../../services/carrito.service';

interface CarritoItem {
  id: number;
  producto: {
    id: number;
    nombre: string;
    precio: number;
    imagen: string;
    // producto_id?: number; // Si necesitas el ID original del producto para enviar al backend
  };
  cantidad: number;
}

interface DetallesPago {
  numeroTarjeta?: string;
  fechaCaducidad?: string;
  cvv?: string;
  emailPaypal?: string;
}

// Interfaz para el payload que se pasará al servicio
interface CrearPedidoData {
  total: number;
  estado: string;
  direccion_envio: string; // Siempre la enviaremos al servicio
  metodo_pago: string;    // Siempre la enviaremos al servicio
  // Si necesitas enviar los items explícitamente al backend:
  // items?: { producto_id: number, cantidad: number, precio_unitario: number }[]; 
}


@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe],
  animations: [
    trigger('collapseAnimation', [
      state('false', style({ height: '0', opacity: '0', overflow: 'hidden', paddingTop: '0', paddingBottom: '0', marginTop: '0' })),
      state('true', style({ height: '*', opacity: '1' })),
      transition('false <=> true', animate('300ms ease-in-out'))
    ])
  ]
})
export class PedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  pedidoSeleccionado: Pedido | null = null;
  metodoPago: string = '';
  direccionEnvio: string = '';
  carrito: CarritoItem[] = [];
  total: number = 0;
  pedidoReciente: Pedido | null = null;
  detallesPago: DetallesPago = {};

  constructor(
    private pedidosService: PedidosService,
    private carritoService: CarritoService // Asumo que CarritoService tiene un método para limpiar o actualizar el carrito
  ) {}

  ngOnInit(): void {
    this.cargarPedidos();
    this.cargarCarrito();
  }

  cargarPedidos(): void {
    this.pedidosService.obtenerPedidos().subscribe({
      next: (data) => {
        this.pedidos = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      },
      error: (error) => {
        console.error('Error al obtener los pedidos:', error.message || error);
        // Podrías mostrar un toast o mensaje al usuario aquí
      }
    });
  }

  cargarCarrito(): void {
    this.carritoService.obtenerCarrito().subscribe({
      next: (data: CarritoItem[]) => {
        this.carrito = data;
        this.actualizarTotalCarrito();
      },
      error: (error) => {
        console.error('Error al obtener el carrito:', error.message || error);
        this.carrito = [];
        this.actualizarTotalCarrito();
        // Podrías mostrar un toast o mensaje al usuario aquí
      }
    });
  }

  actualizarTotalCarrito(): void {
    this.total = this.carrito.reduce((acc, item) => acc + (item.cantidad * item.producto.precio), 0);
  }

  verDetalles(pedido: Pedido): void {
    this.pedidoSeleccionado = (this.pedidoSeleccionado && this.pedidoSeleccionado.id === pedido.id) ? null : pedido;
    this.pedidoReciente = null;
  }

  onPaymentMethodChange(): void {
    this.detallesPago = {};
  }

  isPaymentDetailsFilled(): boolean {
    if (!this.metodoPago) return false;
    switch (this.metodoPago) {
      case 'tarjeta':
        return !!this.detallesPago.numeroTarjeta?.trim() && !!this.detallesPago.fechaCaducidad?.trim() && !!this.detallesPago.cvv?.trim();
      case 'paypal':
        return !!this.detallesPago.emailPaypal?.trim();
      case 'transferencia': return true;
      default: return false;
    }
  }

  realizarPedido(): void {
    if (!this.direccionEnvio.trim() || !this.metodoPago || !this.isPaymentDetailsFilled() || this.carrito.length === 0) {
      alert('Por favor, completa todos los campos requeridos y asegúrate de que tu carrito no esté vacío.');
      return;
    }

    // El estado inicial del pedido, según tu Postman
    const estadoInicialPedido = "pendiente"; 

    // Prepara los datos para el servicio
    const datosParaServicio: CrearPedidoData = {
      total: this.total, // El total calculado en el frontend
      estado: estadoInicialPedido,
      direccion_envio: this.direccionEnvio,
      metodo_pago: this.metodoPago,
      // Si necesitas enviar los items del carrito al backend explícitamente:
      // items: this.carrito.map(item => ({
      //   producto_id: item.producto.id, // o item.producto_id si lo tienes así
      //   cantidad: item.cantidad,
      //   precio_unitario: item.producto.precio
      // }))
    };

    this.pedidosService.realizarPedido(datosParaServicio).subscribe({
      next: (response) => { // response es de tipo CrearPedidoResponse
        alert(response.message || 'Pedido realizado con éxito ✅'); // Usa el mensaje del backend si existe
        
        this.pedidoReciente = response.pedido; // Asigna el pedido devuelto por el backend
        this.pedidoSeleccionado = null;
        
        // Lógica para limpiar/actualizar el carrito
        // Opción 1: Si el backend limpia el carrito del usuario:
        this.carrito = [];
        this.actualizarTotalCarrito();
        // Opción 2: Si necesitas llamar a un método del CarritoService para actualizarlo o limpiarlo:
        // this.carritoService.limpiarCarritoTrasPedido().subscribe(() => {
        //   this.cargarCarrito(); // Recargar para reflejar el carrito vacío
        // });

        // Resetear formulario
        this.metodoPago = '';
        this.direccionEnvio = '';
        this.detallesPago = {};
        
        this.cargarPedidos(); // Recargar historial para mostrar el nuevo pedido

        setTimeout(() => {
          const recentOrderSection = document.querySelector('.alert-success'); // Tu selector de alerta
          recentOrderSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      },
      error: (error) => { // error ya es de tipo Error
        console.error('Error al realizar el pedido ❌', error);
        alert(error.message || 'Error al realizar el pedido. Inténtalo de nuevo.');
      }
    });
  }

  generarIdPedidoTemporal(): string {
    return `WEB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }

  getBadgeClassForCss(estado: string): string {
    const estadoNormalizado = estado?.toLowerCase();
    switch (estadoNormalizado) {
      case 'pendiente': return 'estado-pendiente';
      case 'procesando': return 'estado-procesando';
      case 'completado': case 'enviado': return 'estado-completado';
      case 'cancelado': return 'estado-cancelado';
      default: return 'estado-default';
    }
  }
}