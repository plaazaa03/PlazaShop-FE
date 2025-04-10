import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // URL del backend Laravel

  constructor(private http: HttpClient) {}

  registrarUsuario(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, datos);
  }

  login(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, datos);
  }

  obtenerProductos(): Observable<any> {
    const token = "7|wn8KMydk4E3VWy2ThIBPsui4QhYiYczz5rZ4MeNN47e340a8";
    return this.http.get(`${this.apiUrl}/productos`, { headers: { Authorization: `Bearer ${token}` } });
  }

  agregarAlCarrito(productoId: number, cantidad: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/carrito/agregar`, { producto_id: productoId, cantidad });
  }
}
