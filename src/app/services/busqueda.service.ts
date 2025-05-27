import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {
  // Usamos BehaviorSubject para que los nuevos suscriptores reciban el último término emitido.
  // Inicializamos con string vacío.
  private terminoBusquedaSubject = new BehaviorSubject<string>('');
  
  // Observable público para que los componentes se suscriban
  terminoBusqueda$ = this.terminoBusquedaSubject.asObservable();

  constructor() { }

  // Método para que el HeaderComponent emita un nuevo término de búsqueda
  actualizarTerminoBusqueda(termino: string): void {
    this.terminoBusquedaSubject.next(termino.trim());
  }
}