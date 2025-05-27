import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service'; // Importar
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  // errorMessage: string = ''; // Ya no es necesario si usamos notificaciones para errores
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService // Inyectar
  ) { }

  login() {
    if (!this.email || !this.password) {
      this.notificationService.showWarning('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);

        localStorage.setItem('token', response.token);
        localStorage.setItem('user_rol', response.rol);

        // Usar NotificationService para el mensaje de éxito
        this.notificationService.showSuccess('¡Inicio de sesión exitoso!');

        // Pequeña demora para que el usuario vea la notificación antes de redirigir
        setTimeout(() => {
          if (response.rol === 'admin') {
            this.router.navigate(['/admin-productos']);
          } else {
            this.router.navigate(['/productos']);
          }
        }, 1000); // 1 segundo de demora
      },
      error: (error) => {
        console.error('Login fallido', error);
        // Usar NotificationService para el mensaje de error
        let message = 'Credenciales incorrectas. Intenta de nuevo.';
        if (error.error && error.error.message) { // Si el backend envía un mensaje específico
            message = error.error.message;
        } else if (error.status === 0) {
            message = 'No se pudo conectar con el servidor. Inténtalo más tarde.';
        }
        this.notificationService.showError(message);
        // this.errorMessage = message; // Ya no es necesario
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}