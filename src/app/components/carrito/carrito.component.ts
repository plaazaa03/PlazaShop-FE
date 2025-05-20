import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../model/producto.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoUpdaterService } from '../../services/CarritoUpdater.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CarritoComponent implements OnInit {
  carrito: { id: number; producto_id: number; cantidad: number; producto: Producto }[] = [];
  total: number = 0;
  isAuthenticated: boolean = false;

  constructor(private carritoService: CarritoService, private carritoUpdaterService: CarritoUpdaterService, private router: Router) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.isAuthenticated = !!token;
    console.log('this.isAuthenticated:', this.isAuthenticated);
    console.log('token:', token);

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
    } else {
      this.carrito = [];
      this.total = 0;
    }

    // Suscribirse al observable carritoObservable
    this.carritoUpdaterService.getCarritoObservable().subscribe((carrito) => {
      this.carrito = carrito;
      this.actualizarTotal();
    });
  }

eliminar(id: number) {
  console.log('Eliminando producto con ID:', id);
  this.carritoService.eliminarDelCarrito(id).subscribe(() => {
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
    alert('Producto eliminado del carrito');
  });
}

  actualizarTotal() {
    this.total = this.carrito.reduce((acc, item) => {
      return acc + item.producto.precio * item.cantidad;
    }, 0);
  }

  finalizarPedido() {
    this.router.navigate(['/pedidos']);
  }
}