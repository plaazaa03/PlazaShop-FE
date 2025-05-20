import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,  // Asegúrate de que sea un componente standalone
  imports: [CommonModule],  // Importa CommonModule aquí
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private router: Router) {}

  // Verificar si el usuario está logueado
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');  // Cambia esto según tu lógica de autenticación
  }

  // Función para cerrar sesión
  logout(): void {
    localStorage.removeItem('token');  // Eliminar el token de sesión
    localStorage.removeItem('user_rol');  // Eliminar el rol si lo tienes guardado
    this.router.navigate(['/']);  // Redirigir a la página principal
  }
}
