import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../model/producto.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = 'http://127.0.0.1:8000/api/carrito';
   private productos: Producto[] = [];

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Asegúrate de guardarlo al hacer login
    console.log(token);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Obtener carrito del usuario
  obtenerCarrito(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // Agregar producto al carrito
  agregarProducto(producto: { producto_id: number; cantidad: number }): Observable<any> {
    return this.http.post(this.apiUrl + '/agregar', producto, {
      headers: this.getAuthHeaders()
    });
  }

  obtenerProductos() {
    return this.productos;
  }

  // Eliminar producto del carrito
  eliminarDelCarrito(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
