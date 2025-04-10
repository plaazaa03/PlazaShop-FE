import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';  // Importa el servicio de autenticación

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      // Clonamos la solicitud y agregamos el token en las cabeceras
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,  // Agregamos el token al encabezado de autorización
        },
      });

      return next.handle(clonedRequest);  // Continuamos con la solicitud modificada
    }

    return next.handle(req);  // Si no hay token, dejamos la solicitud sin modificar
  }
}
