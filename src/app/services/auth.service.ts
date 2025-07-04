import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../src/enviroments'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/login`;
  private registerUrl = `${environment.apiUrl}/registro`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { email, password }).pipe(
      catchError((error) => {
        console.error('Login failed', error);
        return throwError(() => new Error('Login failed, please check your credentials.'));
      })
    );
  }

  registro(data: {
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
    telefono: string,
    direccion: string,
    rol: string
  }): Observable<any> {
    return this.http.post(this.registerUrl, data);
  }
  

  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}
