import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { Pedido } from '../../model/pedido.model';
import { PedidosService } from '../../services/pedidos.service';
import { CarritoService } from '../../services/carrito.service';
import { NotificationService } from '../../services/notification.service'; 
interface CarritoItem {
  id: number;
  producto: {
    id: number;
    nombre: string;
    precio: number;
    imagen: string;
  };
  cantidad: number;
}

interface DetallesPago {
  numeroTarjeta?: string;
  fechaCaducidad?: string;
  cvv?: string;
  emailPaypal?: string;
}

interface CrearPedidoData {
  total: number;
  estado: string;
  direccion_envio: string; 
  metodo_pago: string;   
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
    private carritoService: CarritoService,
    private notificationService: NotificationService
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
        this.notificationService.showError('Error al cargar el historial de pedidos.');
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
        this.notificationService.showError('Error al cargar el carrito.'); 
      }
    });
  }

  actualizarTotalCarrito(): void {
    this.total = this.carrito.reduce((acc, item) => acc + (item.cantidad * item.producto.precio), 0);
  }

  verDetalles(pedido: Pedido): void {
    this.pedidoSeleccionado = (this.pedidoSeleccionado && this.pedidoSeleccionado.id === pedido.id) ? null : pedido;
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
    if (this.carrito.length === 0) {
      this.notificationService.showWarning('Tu carrito está vacío. Añade productos antes de finalizar el pedido.');
      return;
    }
    if (!this.direccionEnvio.trim()) {
        this.notificationService.showWarning('Por favor, ingresa tu dirección de envío.');
        return;
    }
    if (!this.metodoPago) {
        this.notificationService.showWarning('Por favor, selecciona un método de pago.');
        return;
    }
    if (!this.isPaymentDetailsFilled()) {
      this.notificationService.showWarning('Por favor, completa los detalles del método de pago seleccionado.');
      return;
    }

    const estadoInicialPedido = "pendiente"; 

    const datosParaServicio: CrearPedidoData = {
      total: this.total,
      estado: estadoInicialPedido,
      direccion_envio: this.direccionEnvio,
      metodo_pago: this.metodoPago,
    };

    this.pedidosService.realizarPedido(datosParaServicio).subscribe({
      next: (response) => {
        
        const successMessage = response.message || '¡Pedido realizado con éxito! 🎉';
        this.notificationService.showSuccess(successMessage);
        
        this.pedidoReciente = response.pedido; 
        this.pedidoSeleccionado = null; 
        

        this.carrito = [];
        this.actualizarTotalCarrito();
      
        this.metodoPago = '';
        this.direccionEnvio = '';
        this.detallesPago = {};
        
        this.cargarPedidos();

       
        setTimeout(() => {
          const recentOrderSection = document.querySelector('.alert-success');
          recentOrderSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      },
      error: (error) => {
        console.error('Error al realizar el pedido ❌', error);
        const errorMessage = error.message || 'Error al procesar el pedido. Por favor, inténtalo de nuevo.';
        this.notificationService.showError(errorMessage); 
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