// src/app/components/admin/admin-users/admin-users.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../../services/user.service'; // Ajusta la ruta si es necesario
import { Router, RouterModule } from '@angular/router'; // RouterModule para routerLink

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterModule], // Añade RouterModule
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar usuarios: ' + err.message;
        console.error(err);
        this.isLoading = false;
         if (err.status === 401 || err.status === 403) {
            this.router.navigate(['/login']); // O a una página de no autorizado
        }
      }
    });
  }

  // Opcional: Redirigir a un formulario de edición de usuario
  // Para esto, necesitarías un nuevo componente AdminUserEditComponent y una ruta.
  // O podrías implementar un modal de edición aquí mismo.
  editUser(userId: number): void {
    // this.router.navigate(['/admin/usuarios/editar', userId]);
    // Por ahora, solo un log:
    console.log('Editar usuario con ID:', userId);
    alert('Funcionalidad de edición no implementada en este ejemplo. Se necesitaría un formulario/componente de edición.');
  }

  deleteUser(userId: number, userName: string): void {
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario "${userName}"? Esta acción no se puede deshacer.`)) {
      this.isLoading = true; // Podrías tener un loader por fila o global
      this.userService.deleteUser(userId).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.users = this.users.filter(u => u.id !== userId); // Elimina el usuario de la lista local
          this.isLoading = false;
          setTimeout(() => this.successMessage = null, 3000); // Ocultar mensaje después de 3 seg
        },
        error: (err) => {
          this.errorMessage = 'Error al eliminar usuario: ' + err.message;
          console.error(err);
          this.isLoading = false;
          setTimeout(() => this.errorMessage = null, 5000);
        }
      });
    }
  }
}