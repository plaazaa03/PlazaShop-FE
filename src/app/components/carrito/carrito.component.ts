import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../model/producto.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CarritoComponent implements OnInit {
  carrito: { producto_id: number; cantidad: number; producto: Producto }[] = [];
  total: number = 0;
  isAuthenticated: boolean = false;

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.isAuthenticated = !!token;

    if (this.isAuthenticated) {
      this.carritoService.obtenerCarrito().subscribe({
        next: (data) => {
          this.carrito = data;
          this.actualizarTotal();
        },
        error: (err) => {
          console.error('Error al obtener carrito:', err);
          this.carrito = [];
        }
      });
    }
  }

  eliminar(itemId: number) {
    this.carritoService.eliminarDelCarrito(itemId).subscribe(() => {
      this.carrito = this.carrito.filter(item => item.producto_id !== itemId);
      this.actualizarTotal();
    });
  }

  actualizarTotal() {
    this.total = this.carrito.reduce((acc, item) => {
      return acc + item.producto.precio * item.cantidad;
    }, 0);
  }

  finalizarPedido() {
    console.log('Pedido Finalizado:', this.carrito);
    // Aquí puedes hacer POST a otra ruta para procesar el pedido
  }
}
