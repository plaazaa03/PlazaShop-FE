import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService, User } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Añade ReactiveFormsModule
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  profileForm!: FormGroup;
  currentUser: User | null = null;
  isLoading = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      direccion: [''],
      telefono: [''],
      // Para cambiar contraseña (opcional)
      current_password: [''], // Si quieres verificar la contraseña actual antes de cambiarla (requiere lógica en backend)
      password: [''],
      password_confirmation: ['']
    }, { validators: this.passwordMatchValidator }); // Validador personalizado para contraseñas

    this.loadUserProfile();
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('password_confirmation')?.value;
    // Solo valida si se ha ingresado una nueva contraseña
    if (password || confirmPassword) {
      return password === confirmPassword ? null : { mismatch: true };
    }
    return null;
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          direccion: user.direccion || '',
          telefono: user.telefono || ''
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar el perfil: ' + err.message;
        console.error(err);
        this.isLoading = false;
        if (err.status === 401) { // O si el token es inválido
            this.router.navigate(['/login']);
        }
      }
    });
  }

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (this.profileForm.invalid) {
      this.errorMessage = 'Por favor, corrige los errores en el formulario.';
      return;
    }
    if (!this.currentUser) return;

    const formData = { ...this.profileForm.value };

    // Solo enviar contraseña si se ha ingresado una nueva
    if (!formData.password) {
      delete formData.password;
      delete formData.password_confirmation;
    }
    // Eliminar current_password si no lo usas en el backend para la actualización
    delete formData.current_password;


    this.isLoading = true;
    this.userService.updateUser(this.currentUser.id, formData).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.currentUser = response.user; // Actualiza el usuario local con la respuesta
        // Limpiar campos de contraseña del formulario si se cambiaron
        this.profileForm.patchValue({ password: '', password_confirmation: '' });
        this.isLoading = false;
        // Opcionalmente, recargar datos o mostrar un mensaje
      },
      error: (err) => {
        this.errorMessage = 'Error al actualizar el perfil: ' + (err.error?.message || err.message);
        if (err.error && err.error.errors) { // Mostrar errores de validación de Laravel
            let validationErrors = '';
            for (const key in err.error.errors) {
                validationErrors += `${err.error.errors[key].join(', ')}\n`;
            }
            this.errorMessage += `\nDetalles: ${validationErrors}`;
        }
        console.error(err);
        this.isLoading = false;
      }
    });
  }
}