// src/app/components/admin/admin-users/admin-users.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService, User } from '../../../services/user.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TitleCasePipe
  ],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'] 
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  isSaving = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  isEditing = false;
  editingUser: User | null = null;
  userEditForm!: FormGroup;
  userRoles: string[] = ['admin', 'cliente'];

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.initEditForm();
  }

  initEditForm(): void {
    this.userEditForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''], 
      direccion: [''],
      rol: ['cliente', Validators.required],
      password: ['', [Validators.minLength(6)]] 
    });
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
          this.router.navigate(['/login']);
        }
      }
    });
  }

  startEditUser(userToEdit: User): void {
    this.isEditing = true;
    this.editingUser = { ...userToEdit };
    this.successMessage = null;
    this.errorMessage = null;

    this.userEditForm.patchValue({
      name: this.editingUser.name,
      email: this.editingUser.email,
      telefono: this.editingUser.telefono || '', 
      direccion: this.editingUser.direccion || '',
      rol: this.editingUser.rol,
      password: ''
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingUser = null;
    this.userEditForm.reset({
      name: '',
      email: '',
      telefono: '',
      direccion: '',
      rol: 'cliente',
      password: ''
    });
    this.errorMessage = null;
  }

  saveUser(): void {
    if (!this.editingUser) {
      this.errorMessage = "No hay usuario seleccionado para editar.";
      return;
    }

    if (this.userEditForm.invalid) {
      this.userEditForm.markAllAsTouched();
      this.errorMessage = "Por favor, corrige los errores en el formulario.";
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;
    this.successMessage = null;

    const formValues = this.userEditForm.value;
    const updatedUserData: Partial<User> = {
      name: formValues.name,
      email: formValues.email,
      telefono: formValues.telefono,
      direccion: formValues.direccion,
      rol: formValues.rol
    };

    if (formValues.password && formValues.password.trim() !== '') {
      updatedUserData.password = formValues.password;
    }

    this.userService.updateUser(this.editingUser.id, updatedUserData).subscribe({
      next: (response: any) => {
        this.successMessage = response.message || 'Usuario actualizado con éxito.';
        this.isSaving = false;
        this.loadUsers();
        this.cancelEdit();
        setTimeout(() => this.successMessage = null, 4000);
      },
      error: (err) => {
        this.errorMessage = 'Error al actualizar usuario: ' + err.message;
        console.error(err);
        this.isSaving = false;
        setTimeout(() => this.errorMessage = null, 5000);
      }
    });
  }

  deleteUser(userId: number, userName: string): void {
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario "${userName}"? Esta acción no se puede deshacer.`)) {
      this.isLoading = true;
      this.userService.deleteUser(userId).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.users = this.users.filter(u => u.id !== userId);
          this.isLoading = false;
          setTimeout(() => this.successMessage = null, 3000);
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

  get editName() { return this.userEditForm.get('name'); }
  get editEmail() { return this.userEditForm.get('email'); }
  get editTelefono() { return this.userEditForm.get('telefono'); }
  get editDireccion() { return this.userEditForm.get('direccion'); }
  get editRol() { return this.userEditForm.get('rol'); }
  get editPassword() { return this.userEditForm.get('password'); }
}