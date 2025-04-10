import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../model/pedido.model';

@Injectable({
    providedIn: 'root'
})
export class PedidosService {
    private apiUrl = 'http://127.0.0.1:8000/api/pedidos';

    constructor(private http: HttpClient) {}

    obtenerPedidos(): Observable<Pedido[]> {
        return this.http.get<Pedido[]>(this.apiUrl);
    }
}