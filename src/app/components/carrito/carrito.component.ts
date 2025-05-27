import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../model/producto.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoUpdaterService } from '../../services/CarritoUpdater.service';
import { NotificationService } from '../../services/notification.service';

// 1. DEFINIR LA INTERFAZ CarritoItem (o importarla si ya existe)
// Basado en tu propiedad `carrito` existente:
interface CarritoItem {
  id: number;
  producto_id: number;
  cantidad: number;
  producto: Producto; // Asegúrate que Producto tenga 'precio' y 'nombre'
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CarritoComponent implements OnInit {
  // Usa la interfaz CarritoItem para tipar tu array de carrito
  carrito: CarritoItem[] = [];
  total: number = 0;
  isAuthenticated: boolean = false;

  constructor(
    private carritoService: CarritoService,
    private carritoUpdaterService: CarritoUpdaterService,
    private router: Router,
    private notificationService: NotificationService // <--- 2. INYECTAR NotificationService
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.isAuthenticated = !!token;
    // console.log('this.isAuthenticated:', this.isAuthenticated);
    // console.log('token:', token);

    if (this.isAuthenticated) {
      this.carritoService.obtenerCarrito().subscribe({
        next: (data: CarritoItem[]) => { // Usar CarritoItem aquí también
          this.carrito = data;
          // console.log("Datos del carrito recibidos: ", data);
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

    this.carritoUpdaterService.getCarritoObservable().subscribe((nuevoCarrito: CarritoItem[]) => { // Usar CarritoItem
      // console.log('Carrito actualizado desde observable:', nuevoCarrito);
      this.carrito = nuevoCarrito;
      this.actualizarTotal();
    });
  }

  eliminar(id: number) {
    // console.log('Eliminando producto con ID:', id);
    this.carritoService.eliminarDelCarrito(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Producto eliminado del carrito.');
        // Actualizar el carrito localmente o volver a cargarlo
        this.carrito = this.carrito.filter(item => item.id !== id);
        this.actualizarTotal();
        // Opcionalmente, notificar al CarritoUpdaterService si otros componentes lo necesitan
        // this.carritoUpdaterService.actualizarCarrito(this.carrito);
      },
      error: (err) => {
        console.error('Error al eliminar del carrito:', err);
        this.notificationService.showError('No se pudo eliminar el producto del carrito.');
      }
    });
  }

  actualizarTotal() {
    this.total = this.carrito.reduce((acc, item) => {
      // 1. Obtener el precio y la cantidad, asegurándonos de que sean números.
      const precioProducto = parseFloat(String(item.producto.precio)); // Convertir a string y luego a float
      const cantidadItem = parseInt(String(item.cantidad), 10);      // Convertir a string y luego a int

      // console.log(`Item: ${item.producto.nombre}, PrecioParseado: ${precioProducto}, CantidadParseada: ${cantidadItem}`); // Para depuración

      // 2. Verificar si la conversión fue exitosa y son números válidos.
      if (item && item.producto && !isNaN(precioProducto) && !isNaN(cantidadItem) && cantidadItem > 0) {
        return acc + (precioProducto * cantidadItem);
      }
      return acc; // Si algo no es válido, no se suma al acumulador.
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
      // Opcional: preguntar si desea eliminar el item si la cantidad llega a 0 o 1
      this.notificationService.showInfo('La cantidad mínima es 1. Para quitar el producto, usa el botón de eliminar.');
    }
  }

  actualizarCantidad(item: CarritoItem): void {
    if (!item.cantidad || item.cantidad < 1) {
      item.cantidad = 1;
    }

    // Llamar al servicio para actualizar la cantidad en el backend
    // Asumiendo que tienes un método como actualizarItemEnCarrito en tu CarritoService
    // this.carritoService.actualizarItemEnCarrito(item.id, item.cantidad).subscribe({
    //   next: () => {
    //     // this.notificationService.showSuccess('Cantidad actualizada.'); // Puede ser muy verboso
    //     this.actualizarTotal();
    //     this.carritoUpdaterService.actualizarCarrito(this.carrito); // Notificar cambios
    //   },
    //   error: (err) => {
    //     this.notificationService.showError('Error al actualizar la cantidad.');
    //     // Podrías revertir la cantidad localmente si falla la actualización en el backend
    //     // o recargar el carrito para obtener el estado consistente.
    //     this.cargarCarritoSiAutenticado(); // Ejemplo de recarga
    //   }
    // });

    // Por ahora, solo actualizamos el total localmente si no tienes la lógica de backend
    this.actualizarTotal();
    this.carritoUpdaterService.actualizarCarrito(this.carrito); // Notificar cambios localmente
  }

  // Este método auxiliar es solo un ejemplo si quieres recargar el carrito tras un error
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
    // No llamar a actualizarTotal aquí directamente si actualizarCantidad ya lo hace y se llama desde el (ngModelChange)
    // Pero si el usuario solo teclea y no hay ngModelChange, se necesita.
    // Es mejor que actualizarCantidad maneje la lógica de persistencia y actualización del total.
    this.actualizarCantidad(item); // Reutilizar la lógica de actualización
  }
}