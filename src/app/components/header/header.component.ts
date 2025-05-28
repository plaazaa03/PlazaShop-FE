import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private router: Router) {}

  // Verificar si el usuario está logueado
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); 
  }

  // Función para cerrar sesión
  logout(): void {
    localStorage.removeItem('token'); 
    localStorage.removeItem('user_rol');  
    this.router.navigate(['/']);
  }

  isAdmin(): boolean {
    if (!this.isLoggedIn()) {
      return false; // Si no está logueado, no puede ser admin
    }
    const userRole = localStorage.getItem('user_rol');
    // Compara el rol (asegúrate que 'admin' sea el string exacto que guardas)
    // Puedes hacerlo insensible a mayúsculas/minúsculas si es necesario:
    // return userRole?.toLowerCase() === 'admin';
    return userRole === 'admin';
  }
}
