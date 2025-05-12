import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/productos.service';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../model/producto.model';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { FormsModule } from '@angular/forms'; // Importa FormsModule

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  standalone: true,  // Usando componentes independientes
  imports: [CommonModule, FormsModule]  // Asegúrate de importar CommonModule y FormsModule
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    // Obtiene los productos y los mapea para incluir la cantidad seleccionada
    this.productoService.obtenerProductos().subscribe(data => {
      this.productos = data.map(p => ({
        ...p,
        cantidadSeleccionada: 1 // Inicializa la cantidad por defecto en 1
      }));
    });
  }

  agregarAlCarrito(producto: Producto): void {
    // Verifica si la cantidad es válida
    if (producto.cantidadSeleccionada < 1 || producto.cantidadSeleccionada > producto.stock) {
      alert('Cantidad inválida');
      return;
    }

    // Crea el payload con el producto y la cantidad seleccionada
    const payload = {
      producto_id: producto.id,
      cantidad: producto.cantidadSeleccionada
    };

    // Llama al servicio para agregar el producto al carrito
    this.carritoService.agregarProducto(payload).subscribe({
      next: () => alert('Producto añadido al carrito'),
      error: (err) => {
        console.error('Error al agregar al carrito:', err);
        alert('Debes iniciar sesión para añadir productos al carrito');
      }
    });
  }
}
