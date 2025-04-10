// pedidos.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pedido } from '../../model/pedido.model';
import { PedidosService } from '../../services/pedidos.service';


@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
  standalone: true,  // Marca este componente como independiente
  imports: [CommonModule, FormsModule]
})
export class PedidosComponent {
  pedidos: Pedido[] = [];

  constructor(private pedidosService: PedidosService) {}

  ngOnInit(): void {
    // Obtener los pedidos al cargar el componente
    this.pedidosService.obtenerPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;  // Asignamos los datos obtenidos de la API a la propiedad pedidos
      },
      error: (error) => {
        console.error('Error al obtener los pedidos', error);
      }
    });
  }
  
}
