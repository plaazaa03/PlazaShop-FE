import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Pedido } from '../model/pedido.model'; // Asegúrate que la ruta sea correcta

// Interfaz para el payload que espera tu API para crear un pedido
interface CrearPedidoPayload {
  total: number;
  estado: string;
  direccion_envio?: string; // Opcional, si tu backend lo acepta aquí
  metodo_pago?: string;    // Opcional, si tu backend lo acepta aquí
  // Si el backend espera los items del carrito explícitamente, añádelos aquí:
  // items?: { producto_id: number, cantidad: number, precio_unitario: number }[];
}

// Interfaz para la respuesta esperada del backend al crear un pedido
interface CrearPedidoResponse {
  pedido: Pedido; // Asumiendo que el backend devuelve el pedido completo
  message?: string; // Opcional, para mensajes de éxito
}

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private apiUrl = 'http://127.0.0.1:8000/api/pedidos'; // URL base para listar y crear pedidos

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      // Podrías manejar esto de forma más robusta, quizás redirigiendo al login
      console.error('Token no encontrado en localStorage');
      // Devolver cabeceras vacías o lanzar un error específico si prefieres
      // Para este ejemplo, continuaremos pero las llamadas fallarán si el backend requiere token.
      return new HttpHeaders(); 
    }
    return new HttpHeaders({
      'Content-Type': 'application/json', // Importante para POST con cuerpo JSON
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerPedidos(): Observable<Pedido[]> {
    const headers = this.getAuthHeaders();
    // Si el token no existe, headers podría no tener Authorization, y la llamada fallaría si es requerida.
    // Podrías añadir una verificación aquí si el token es absolutamente necesario.
    if (!headers.has('Authorization') && /* tu lógica para saber si el token es mandatorio para esta ruta */ false) {
        return throwError(() => new Error('No se puede obtener pedidos: Usuario no autenticado.'));
    }
    return this.http.get<Pedido[]>(this.apiUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Método modificado para crear un pedido
  realizarPedido(datosNuevoPedido: CrearPedidoPayload): Observable<CrearPedidoResponse> {
    const headers = this.getAuthHeaders();
    if (!headers.has('Authorization')) {
        return throwError(() => new Error('No se puede realizar el pedido: Usuario no autenticado.'));
    }

    // El payload debe coincidir con lo que espera tu backend para la creación
    // Según tu Postman, espera `total` y `estado`.
    // Si también puede procesar `direccion_envio` y `metodo_pago` en este endpoint, inclúyelos.
    const payload: CrearPedidoPayload = {
      total: datosNuevoPedido.total,
      estado: datosNuevoPedido.estado,
    };

    // Solo añade direccion_envio y metodo_pago si están presentes en datosNuevoPedido
    // y si tu backend los espera en este endpoint de creación.
    if (datosNuevoPedido.direccion_envio) {
      payload.direccion_envio = datosNuevoPedido.direccion_envio;
    }
    if (datosNuevoPedido.metodo_pago) {
      payload.metodo_pago = datosNuevoPedido.metodo_pago;
    }
    
    // Si tu backend espera los items del carrito explícitamente:
    // if (datosNuevoPedido.items) {
    //   payload.items = datosNuevoPedido.items;
    // }

    console.log('Enviando payload para crear pedido:', payload);
    // Usamos this.apiUrl directamente para el POST, como en tu Postman
    return this.http.post<CrearPedidoResponse>(this.apiUrl, payload, { headers }).pipe(
      tap(response => console.log('Respuesta del backend al crear pedido:', response)),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error en PedidosService:', error);
    let errorMessage = 'Error desconocido al procesar la solicitud.';
    // Error del lado del cliente o de red
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } 
    // Error del lado del servidor
    else if (error.status) {
      const serverError = error.error;
      if (serverError && typeof serverError.message === 'string') {
        errorMessage = serverError.message; // Mensaje de error de la API (ej. validación)
      } else if (serverError && typeof serverError.error === 'string') { // A veces viene en error.error
        errorMessage = serverError.error;
      } else if (serverError && typeof serverError === 'string') { // A veces el error es solo un string
         errorMessage = serverError;
      } else {
        errorMessage = `Error del servidor ${error.status}: ${error.message || error.statusText}`;
      }
    }
    // Devolver un observable de error con un mensaje útil para el usuario
    return throwError(() => new Error(errorMessage));
  }
}