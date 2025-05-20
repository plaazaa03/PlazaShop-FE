import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoUpdaterService {
  private carritoSubject = new Subject<any[]>();

  getCarritoObservable() {
    return this.carritoSubject.asObservable();
  }

  updateCarrito(carrito: any[]) {
    this.carritoSubject.next(carrito);
  }
}