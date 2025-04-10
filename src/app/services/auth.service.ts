import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../src/enviroments'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/login`;
  private registerUrl = `${environment.apiUrl}/register`;

  constructor(private http: HttpClient) {}

  // Método para iniciar sesión
  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { email, password });
  }

  // Método para registrar un nuevo usuario
  register(name: string, email: string, password: string, password_confirmation: string): Observable<any> {
    return this.http.post(this.registerUrl, { name, email, password, password_confirmation });
  }

  // Método para guardar el token en el localStorage
  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  // Método para obtener el token desde el localStorage
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Método para eliminar el token (cuando el usuario cierre sesión)
  logout(): void {
    localStorage.removeItem('auth_token');
  }

  // Método para comprobar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}
