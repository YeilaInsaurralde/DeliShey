import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ContactoRequest {
  nombre: string;
  apellido: string;
  email: string;
  asunto: string;
  mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private apiUrl = `${environment.apiUrl}/contacto`;

  constructor(private http: HttpClient) {}

  // Envía la consulta al backend, que la manda por mail
  enviar(data: ContactoRequest): Observable<{ ok: boolean; message: string }> {
    return this.http.post<{ ok: boolean; message: string }>(this.apiUrl, data);
  }
}