import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../model/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = 'http://127.0.0.1:8000/api/productos';

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }
}
