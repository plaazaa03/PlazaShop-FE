import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../model/producto.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoUpdaterService } from '../../services/CarritoUpdater.service';
import { NotificationService } from '../../services/notification.service';

interface CarritoItem {
  id: number;
  producto_id: number;
  cantidad: number;
  producto: Producto;
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CarritoComponent implements OnInit {
  carrito: CarritoItem[] = [];
  total: number = 0;
  isAuthenticated: boolean = false;

  constructor(
    private carritoService: CarritoService,
    private carritoUpdaterService: CarritoUpdaterService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.isAuthenticated = !!token;

    if (this.isAuthenticated) {
      this.carritoService.obtenerCarrito().subscribe({
        next: (data: CarritoItem[]) => {
          this.carrito = data;
          this.actualizarTotal();
        },
        error: (err) => {
          console.error('Error al obtener carrito:', err);
          this.notificationService.showError('Error al cargar tu carrito.');
          this.carrito = [];
        }
      });
    } else {
      this.carrito = [];
      this.total = 0;
    }

    this.carritoUpdaterService.getCarritoObservable().subscribe((nuevoCarrito: CarritoItem[]) => {
      this.carrito = nuevoCarrito;
      this.actualizarTotal();
    });
  }

  eliminar(id: number) {
    this.carritoService.eliminarDelCarrito(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Producto eliminado del carrito.');
        this.carrito = this.carrito.filter(item => item.id !== id);
        this.actualizarTotal();
      },
      error: (err) => {
        console.error('Error al eliminar del carrito:', err);
        this.notificationService.showError('No se pudo eliminar el producto del carrito.');
      }
    });
  }

  actualizarTotal() {
    this.total = this.carrito.reduce((acc, item) => {
      const precioProducto = parseFloat(String(item.producto.precio));
      const cantidadItem = parseInt(String(item.cantidad), 10);
      if (item && item.producto && !isNaN(precioProducto) && !isNaN(cantidadItem) && cantidadItem > 0) {
        return acc + (precioProducto * cantidadItem);
      }
      return acc;
    }, 0);
  }

  finalizarPedido() {
    if (this.carrito.length === 0) {
      this.notificationService.showWarning('Tu carrito está vacío. Añade productos antes de proceder.');
      return;
    }
    this.router.navigate(['/pedidos']);
  }

  get cantidadTotalItems(): number {
    return this.carrito.reduce((sum, item) => sum + (item.cantidad || 0), 0);
  }

  incrementarCantidad(item: CarritoItem): void {
    item.cantidad++;
    this.actualizarCantidad(item);
  }

  decrementarCantidad(item: CarritoItem): void {
    if (item.cantidad > 1) {
      item.cantidad--;
      this.actualizarCantidad(item);
    } else {
      this.notificationService.showInfo('La cantidad mínima es 1. Para quitar el producto, usa el botón de eliminar.');
    }
  }

  actualizarCantidad(item: CarritoItem): void {
    if (!item.cantidad || item.cantidad < 1) {
      item.cantidad = 1;
    }
    this.actualizarTotal();
    this.carritoUpdaterService.actualizarCarrito(this.carrito);
  }

  private cargarCarritoSiAutenticado() {
    if (this.isAuthenticated) {
      this.carritoService.obtenerCarrito().subscribe({
        next: (data: CarritoItem[]) => {
          this.carrito = data;
          this.actualizarTotal();
        },
        error: (err) => console.error('Error al recargar carrito:', err)
      });
    }
  }

  validarCantidad(item: CarritoItem): void {
    if (!item.cantidad || item.cantidad < 1) {
      item.cantidad = 1;
      this.notificationService.showWarning('La cantidad mínima es 1.');
    }
    this.actualizarCantidad(item);
  }
}
