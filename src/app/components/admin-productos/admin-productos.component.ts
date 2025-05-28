import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/productos.service';
import { Producto } from '../../model/producto.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageUrlPipe } from '../../pipes/image-url.pipe';
import { NotificationService } from '../../services/notification.service'; // <--- 1. IMPORTAR

@Component({
  selector: 'app-admin-productos',
  templateUrl: './admin-productos.component.html',
  styleUrls: ['./admin-productos.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ImageUrlPipe]
})
export class AdminProductosComponent implements OnInit {
  productos: Producto[] = [];
  nuevoProducto: Producto = this.resetProducto();
  editandoProducto: Producto | null = null;
  isAdmin: boolean = false;
  selectedFile: File | null = null;

  constructor(
    private productoService: ProductoService,
    private notificationService: NotificationService // <--- 2. INYECTAR
  ) { }

  ngOnInit(): void {
    const rol = localStorage.getItem('user_rol');
    this.isAdmin = rol === 'admin';

    if (this.isAdmin) {
      this.cargarProductos();
    } else {
      this.notificationService.showError('Acceso denegado. No tienes permisos de administrador.');
      // Considera redirigir o mostrar un mensaje más permanente en la UI
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Límite de 2MB por ejemplo
        this.notificationService.showWarning('La imagen es demasiado grande. Máximo 2MB.');
        this.selectedFile = null;
        event.target.value = null; // Resetear el input de archivo
        return;
      }
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
    }
  }


  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => this.productos = data,
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.notificationService.showError('Error al cargar la lista de productos.');
      }
    });
  }

  agregarProducto(): void {
    if (!this.selectedFile) {
      this.notificationService.showWarning('Por favor, selecciona una imagen para el producto.');
      return;
    }
    // Puedes añadir más validaciones aquí para los otros campos si es necesario
    // if (!this.nuevoProducto.nombre.trim() || this.nuevoProducto.precio <= 0 || this.nuevoProducto.stock < 0) {
    //   this.notificationService.showWarning('Completa todos los campos obligatorios correctamente.');
    //   return;
    // }

    const formData = new FormData();
    formData.append('nombre', this.nuevoProducto.nombre);
    formData.append('descripcion', this.nuevoProducto.descripcion);
    formData.append('precio', this.nuevoProducto.precio.toString());
    formData.append('stock', this.nuevoProducto.stock.toString());
    formData.append('imagen', this.selectedFile);

    this.productoService.subirProducto(formData).subscribe({
      next: (response) => { // Asumiendo que el backend puede devolver un mensaje
        this.notificationService.showSuccess(response.message || '¡Producto agregado exitosamente!');
        this.cargarProductos();
        this.nuevoProducto = this.resetProducto();
        this.selectedFile = null;
        // Resetear el input de archivo en el DOM si es necesario (puede requerir ViewChild)
        const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
        if (fileUpload) {
          fileUpload.value = '';
        }
      },
      error: (err) => {
        console.error('Error al agregar producto:', err);
        const errorMsg = err.error?.message || err.message || 'Error desconocido al agregar el producto.';
        this.notificationService.showError(`Error al agregar producto: ${errorMsg}`);
      }
    });
  }


  iniciarEdicion(producto: Producto): void {
    this.editandoProducto = { ...producto };
    if (this.editandoProducto.imagen && (this.editandoProducto.imagen.startsWith('http://') || this.editandoProducto.imagen.startsWith('https://'))) {
      try {
        const url = new URL(this.editandoProducto.imagen);
        const pathSegments = url.pathname.split('/');
        this.editandoProducto.imagen = pathSegments.pop() || '';
      } catch (e) {
        // No es necesario notificar aquí, es un manejo interno
      }
    }
  }

  guardarEdicion(): void {
    if (this.editandoProducto) {
      this.productoService.editarProducto(this.editandoProducto.id, this.editandoProducto).subscribe({
        next: (productoActualizado: Producto) => { // Asumimos que devuelve el producto
          this.notificationService.showSuccess('¡Producto actualizado exitosamente!');
          this.cargarProductos();
          this.editandoProducto = null;
        },
        error: (err) => {
          console.error('Error al editar producto:', err);
          const errorMsg = err.error?.message || err.message || 'Error desconocido al actualizar el producto.';
          this.notificationService.showError(`Error al actualizar: ${errorMsg}`);
        }
      });
    }
  }

  cancelarEdicion(): void {
    this.editandoProducto = null;
    this.notificationService.showInfo('Edición cancelada.');
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
      this.productoService.eliminarProducto(id).subscribe({
        next: (response: any) => { // Puedes usar 'any' si la respuesta es variable
          console.log('INTENTANDO MOSTRAR NOTIFICACIÓN DE ÉXITO');

          // ---- MODIFICACIÓN AQUÍ ----
          const successMessage = response && response.message
            ? response.message
            : '¡Producto eliminado exitosamente!';
          this.notificationService.showSuccess(successMessage);
          // ---- FIN DE MODIFICACIÓN ----

          this.productos = this.productos.filter(producto => producto.id !== id);
        },
        error: (err) => {
          console.error('Error al eliminar producto:', err);
          const errorMsg = err.error?.message || err.message || 'Error desconocido al eliminar el producto.';
          console.log('INTENTANDO MOSTRAR NOTIFICACIÓN DE ERROR');
          this.notificationService.showError(`Error al eliminar: ${errorMsg}`);
        }
      });
    } else {
      console.log('INTENTANDO MOSTRAR NOTIFICACIÓN DE INFO (CANCELADO)');
      this.notificationService.showInfo('Eliminación cancelada.');
    }
  }

  private resetProducto(): Producto {
    return {
      id: 0,
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      imagen: '',
      cantidadSeleccionada: 1
    };
  }
}