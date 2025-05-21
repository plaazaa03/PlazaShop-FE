import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../model/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private apiUrl = 'http://127.0.0.1:8000/api/pedidos';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  obtenerPedidos(): Observable<Pedido[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Pedido[]>(this.apiUrl, { headers });
  }

  realizarPedido(metodoPago: string, direccionEnvio: string): Observable<any> {
  const headers = this.getAuthHeaders();
  const body = {
    metodo_pago: metodoPago,
    direccion_envio: direccionEnvio
  };

  return this.http.post(this.apiUrl + '/realizar-pedido', body, { headers });
}


}