import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service'; // Importar
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  password_confirmation: string = '';
  telefono: string = '';
  direccion: string = '';
  rol: string = 'cliente'; // Valor por defecto

  // errorMessage: string = ""; // Ya no es necesario

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService // Inyectar
  ) {}

  onRegister(): void {
    // Validaciones básicas del lado del cliente
    if (!this.name || !this.email || !this.password || !this.password_confirmation || !this.rol) {
      this.notificationService.showWarning('Por favor, completa todos los campos obligatorios.');
      return;
    }
    if (this.password !== this.password_confirmation) {
      this.notificationService.showError('Las contraseñas no coinciden.');
      return;
    }
    // Podrías añadir más validaciones (ej. formato de email, longitud de contraseña)

    this.authService.registro({
      name: this.name,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation,
      telefono: this.telefono,
      direccion: this.direccion,
      rol: this.rol
    }).subscribe({
      next: (response) => {
        console.log('Registro exitoso', response);
        this.notificationService.showSuccess('¡Registro completado exitosamente! Serás redirigido al login.');
        // Pequeña demora para que el usuario vea la notificación antes de redirigir
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000); // 2 segundos de demora
      },
      error: (error) => {
        console.error('Error en el registro', error);
        let message = 'No se pudo registrar. Revisa los datos e inténtalo de nuevo.';
        // Intentar obtener un mensaje más específico del backend
        if (error.error && typeof error.error === 'object' && error.error.message) {
            message = error.error.message;
        } else if (error.error && typeof error.error === 'string') {
            message = error.error;
        } else if (error.status === 422 && error.error.errors) { // Errores de validación Laravel, por ejemplo
            const firstErrorKey = Object.keys(error.error.errors)[0];
            message = error.error.errors[firstErrorKey][0];
        } else if (error.status === 0) {
            message = 'No se pudo conectar con el servidor. Inténtalo más tarde.';
        }

        this.notificationService.showError(message);
        // this.errorMessage = message; // Ya no es necesario
      }
    });
  }
}