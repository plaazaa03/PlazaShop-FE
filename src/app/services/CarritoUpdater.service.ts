import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs'; // Usaremos BehaviorSubject
import { Producto } from '../model/producto.model'; // Asegúrate que la ruta sea correcta

// Definir o importar CarritoItem
export interface CarritoItem {
  id: number;
  producto_id: number;
  cantidad: number;
  producto: Producto;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoUpdaterService {
  private carritoSubject = new BehaviorSubject<CarritoItem[]>([]); 
  public readonly carritoObservable$: Observable<CarritoItem[]> = this.carritoSubject.asObservable();

  constructor() {}

  getCarritoObservable(): Observable<CarritoItem[]> {
    return this.carritoObservable$;
  }

  
  actualizarCarrito(nuevoCarrito: CarritoItem[]): void {
    this.carritoSubject.next([...nuevoCarrito]); 
  }
}