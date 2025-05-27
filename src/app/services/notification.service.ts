import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

export interface NotificationMessage {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning'; // Tipos de notificación
  duration?: number; // Duración en ms para auto-ocultar (opcional)
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<NotificationMessage | null>(null);
  notification$ = this.notificationSubject.asObservable(); // El componente escuchará esto

  private timerId: any;

  constructor() { }

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 5000) {
    // Limpiar timer anterior si existía
    if (this.timerId) {
      clearTimeout(this.timerId);
    }

    this.notificationSubject.next({ message, type, duration });

    // Auto-ocultar si se especifica duración
    if (duration > 0) {
      this.timerId = setTimeout(() => {
        this.hide();
      }, duration);
    }
  }

  showSuccess(message: string, duration: number = 3000) {
    this.show(message, 'success', duration);
  }

  showError(message: string, duration: number = 5000) {
    this.show(message, 'error', duration);
  }

  showInfo(message: string, duration: number = 3000) {
    this.show(message, 'info', duration);
  }

  showWarning(message: string, duration: number = 4000) {
    this.show(message, 'warning', duration);
  }

  hide() {
    this.notificationSubject.next(null);
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}