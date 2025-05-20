// src/app/auth/login/login.component.ts

import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
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
  errorMessage: string = '';
  
  constructor(private authService: AuthService, private router: Router) {}

login() {
  this.authService.login(this.email, this.password).subscribe({
    next: (response) => {
      console.log('Respuesta del backend:', response);

      localStorage.setItem('token', response.token);
      localStorage.setItem('user_rol', response.rol);
      alert('¡Inicio de sesión exitoso!');

      // Redirigir según rol
      if (response.rol === 'admin') {
        this.router.navigate(['/admin-productos']);
      } else {
        this.router.navigate(['/productos']);
      }
    },
    error: (error) => {
      console.error('Login fallido', error);
      this.errorMessage = 'Credenciales incorrectas. Intenta de nuevo.';
    }
  });
}



}
