import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private router: Router, private notificationService: NotificationService) {}

  // Verificar si el usuario está logueado
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); 
  }

  // Función para cerrar sesión
  logout(): void {
    this.notificationService.showSuccess('¡Has cerrado sesión exitosamente!',5000);
    localStorage.removeItem('token');
    localStorage.removeItem('user_rol');
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    if (!this.isLoggedIn()) {
      return false; 
    }
    const userRole = localStorage.getItem('user_rol');
    
    return userRole === 'admin';
  }
}
