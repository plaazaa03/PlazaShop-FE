// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router'; // Opcional, para manejar errores de autenticación

// Define una interfaz para el objeto User (opcional pero recomendado)
export interface User {
  id: number;
  name: string;
  email: string;
  rol: 'cliente' | 'admin'; // Asegura que el rol sea uno de estos valores
  direccion?: string;
  telefono?: string;
  // Otros campos que puedas tener como email_verified_at, created_at, updated_at
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // Reemplaza con la URL de tu API Laravel

  constructor(private http: HttpClient, private router: Router) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      // Podrías manejar esto de forma más robusta,
      // por ejemplo, redirigiendo al login si no hay token y se requiere.
      console.error('Token no encontrado. Asegúrate de que el usuario está logueado.');
      // Opcionalmente, lanzar un error o redirigir.
      // this.router.navigate(['/login']);
      // return new HttpHeaders(); // Devuelve cabeceras vacías o maneja el error
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json' // Laravel espera esto para respuestas JSON
    });
  }

  // Obtener el perfil del usuario actualmente autenticado
  getProfile(): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.get<User>(`${this.apiUrl}/perfil`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Obtener todos los usuarios (solo para admin)
  getUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<User[]>(`${this.apiUrl}/usuarios`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Obtener un usuario específico por ID
  getUser(id: number): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.get<User>(`${this.apiUrl}/usuarios/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Actualizar un usuario
  // userData puede ser parcial, ej: { name: 'Nuevo Nombre', email: 'nuevo@email.com' }
  // Si se envía 'password', se debe enviar también 'password_confirmation'
  updateUser(id: number, userData: Partial<User> & { password?: string; password_confirmation?: string }): Observable<{ message: string, user: User }> {
    const headers = this.getAuthHeaders();
    return this.http.put<{ message: string, user: User }>(`${this.apiUrl}/usuarios/${id}`, userData, { headers })
      .pipe(catchError(this.handleError));
  }

  // Eliminar un usuario (solo para admin)
  deleteUser(id: number): Observable<{ message: string }> {
    const headers = this.getAuthHeaders();
    return this.http.delete<{ message: string }>(`${this.apiUrl}/usuarios/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Manejador de errores genérico
  private handleError(error: any) {
    console.error('Ocurrió un error en el servicio de usuario:', error);
    // Podrías implementar una lógica más sofisticada aquí,
    // como verificar si es un error 401 y redirigir a login.
    if (error.status === 401 || error.status === 403) {
        // Podrías invalidar la sesión local y redirigir
        // localStorage.removeItem('token');
        // localStorage.removeItem('user_rol');
        // this.router.navigate(['/login']); // Necesitarías inyectar Router
        console.warn(`Error de autorización (${error.status}): ${error.error?.message || error.message}`);
    }
    return throwError(() => new Error(error.error?.message || 'Error del servidor. Intenta de nuevo más tarde.'));
  }
}