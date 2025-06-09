import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService, User } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
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
      current_password: [''], 
      password: [''],
      password_confirmation: ['']
    }, { validators: this.passwordMatchValidator });

    this.loadUserProfile();
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('password_confirmation')?.value;
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
        if (err.status === 401) { 
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

   
    if (!formData.password) {
      delete formData.password;
      delete formData.password_confirmation;
    }
    
    delete formData.current_password;


    this.isLoading = true;
    this.userService.updateUser(this.currentUser.id, formData).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.currentUser = response.user;
        this.profileForm.patchValue({ password: '', password_confirmation: '' });
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al actualizar el perfil: ' + (err.error?.message || err.message);
        if (err.error && err.error.errors) {
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