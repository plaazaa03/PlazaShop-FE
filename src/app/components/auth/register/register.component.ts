import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
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
  telefono = '';
  direccion = '';
  rol = 'cliente';

  errorMessage = "";

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
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
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.errorMessage = 'No se pudo registrar. Revisa los datos.';
        console.error('Error en el registro', error);
      }
    });
  }
}
