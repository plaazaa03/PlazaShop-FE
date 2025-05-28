import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/productos.service'; // Asumiendo que obtenerProductos() devuelve Producto[]
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../model/producto.model'; // Asegúrate que este modelo idealmente tenga cantidadSeleccionada
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoUpdaterService } from '../../services/CarritoUpdater.service';
import { NotificationService } from '../../services/notification.service'; // Ya lo tenías importado

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  isAuthenticated = !!localStorage.getItem('token');
  isLoading: boolean = false; // Añadido para feedback visual

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private carritoUpdaterService: CarritoUpdaterService,
    private notificationService: NotificationService // Ya lo tenías inyectado
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.isLoading = true;
    // Asumiendo que obtenerProductos devuelve directamente un array de Producto
    this.productoService.obtenerProductos().subscribe({
      next: (data: Producto[]) => { // El tipo aquí es Producto[]
        this.productos = data.map(p => {
          // Si 'cantidadSeleccionada' no es parte de tu modelo 'Producto',
          // TypeScript podría quejarse. La mejor solución es añadirla al modelo.
          // Como apaño temporal, puedes usar 'p as any' o definir un tipo local.
          (p as any).cantidadSeleccionada = 1; // Inicializa la cantidad por defecto en 1
          return p;
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.notificationService.showError('Error al cargar la lista de productos.');
        this.isLoading = false;
      }
    });
  }

  agregarAlCarrito(producto: Producto): void {
    // Es mejor si producto.cantidadSeleccionada está definido en el tipo Producto.
    // Si no, usa un type assertion o una interfaz local.
    const cantidadSeleccionada = (producto as any).cantidadSeleccionada;

    if (cantidadSeleccionada < 1) {
      this.notificationService.showWarning('La cantidad debe ser al menos 1.');
      return;
    }
    if (cantidadSeleccionada > producto.stock) {
      this.notificationService.showWarning(`No hay suficiente stock. Disponible: ${producto.stock}.`);
      return;
    }

    const payload = {
      producto_id: producto.id,
      cantidad: cantidadSeleccionada
    };

    this.carritoService.agregarProducto(payload).subscribe({
      next: (response: any) => { // Asumiendo que el backend puede devolver un mensaje
        this.carritoService.obtenerCarrito().subscribe((data) => {
          this.carritoUpdaterService.actualizarCarrito(data);
        });
        // Usa el mensaje del backend si existe, o uno por defecto
        const successMessage = response?.message || `${producto.nombre} añadido al carrito.`;
        this.notificationService.showSuccess(successMessage); // <--- USA NotificationService
      },
      error: (err) => {
        console.error('Error al agregar al carrito:', err);
        // Intenta obtener un mensaje de error más específico del backend
        const errMsg = err.error?.message || err.message || 'Error al añadir el producto al carrito.';
        if (err.status === 401 || err.status === 403) { // Unauthorized o Forbidden
          this.notificationService.showError('Debes iniciar sesión para añadir productos al carrito.');
        } else {
          this.notificationService.showError(errMsg); // <--- USA NotificationService
        }
      }
    });
  }
}