import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/productos.service';
import { Producto } from '../../model/producto.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageUrlPipe } from '../../pipes/image-url.pipe';

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

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
    const rol = localStorage.getItem('user_rol');
    console.log('Rol obtenido de localStorage:', rol); // VERIFICA ESTO

    this.isAdmin = rol === 'admin'; // Asegúrate que 'admin' sea exacto (mayúsculas/minúsculas)
    console.log('this.isAdmin está establecido en:', this.isAdmin); // VERIFICA ESTO

    if (this.isAdmin) {
      console.log('Usuario es admin. Intentando cargar productos...'); // VERIFICA SI LLEGA AQUÍ
      this.cargarProductos();
    } else {
      console.warn('Usuario NO es admin o rol no reconocido. No se cargarán productos.');
      // Podrías querer mostrar un mensaje en la UI aquí o redirigir.
      // Por ejemplo: this.productos = []; // Asegura que productos esté vacío si no es admin
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }


  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  agregarProducto(): void {
    if (!this.selectedFile) {
      alert('Selecciona una imagen antes de agregar el producto.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.nuevoProducto.nombre);
    formData.append('descripcion', this.nuevoProducto.descripcion);
    formData.append('precio', this.nuevoProducto.precio.toString());
    formData.append('stock', this.nuevoProducto.stock.toString());
    formData.append('imagen', this.selectedFile);

    this.productoService.subirProducto(formData).subscribe({
      next: () => {
        this.cargarProductos();
        this.nuevoProducto = this.resetProducto();
        this.selectedFile = null;
      },
      error: (err) => console.error('Error al agregar producto:', err)
    });
  }


  iniciarEdicion(producto: Producto): void {
  this.editandoProducto = { ...producto }; // Copia todas las propiedades

  // Ahora, ajusta 'editandoProducto.imagen' para que sea solo el nombre del archivo
  if (this.editandoProducto.imagen && (this.editandoProducto.imagen.startsWith('http://') || this.editandoProducto.imagen.startsWith('https://'))) {
    try {
      const url = new URL(this.editandoProducto.imagen);
      // Obtiene la última parte de la ruta, que debería ser el nombre del archivo
      const pathSegments = url.pathname.split('/');
      this.editandoProducto.imagen = pathSegments.pop() || ''; // Asigna solo el nombre del archivo
      console.log('Nombre de archivo extraído para edición:', this.editandoProducto.imagen);
    } catch (e) {
      console.error('Error al parsear URL de imagen para extraer nombre de archivo:', this.editandoProducto.imagen, e);
      // Si falla el parseo, mantenemos el valor original pero advertimos.
      // O podrías decidir dejarlo vacío: this.editandoProducto.imagen = '';
    }
  } else {
    // Si no es una URL completa, asumimos que ya es solo el nombre del archivo
    console.log('Imagen ya es nombre de archivo (o vacía) para edición:', this.editandoProducto.imagen);
  }
}

  guardarEdicion(): void {
    if (this.editandoProducto) {
      this.productoService.editarProducto(this.editandoProducto.id, this.editandoProducto).subscribe({
        next: () => {
          this.cargarProductos();
          this.editandoProducto = null;
        },
        error: (err) => console.error('Error al editar producto:', err)
      });
    }
  }

  cancelarEdicion(): void {
    this.editandoProducto = null;
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe({
        next: () => this.cargarProductos(),
        error: (err) => console.error('Error al eliminar producto:', err)
      });
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
