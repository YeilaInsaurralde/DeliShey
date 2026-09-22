import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrderItem {
  productId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  // Registra el pedido al finalizar la compra
  createOrder(items: OrderItem[], shipping: number): Observable<any> {
    return this.http.post<any>(this.apiUrl, { items, shipping });
  }

  // Ventas del período (admin)
  getSales(from: string, to: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/sales?from=${from}&to=${to}`);
  }

  // Descarga el CSV de ventas del período (admin)
  exportCsv(from: string, to: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/admin/export?from=${from}&to=${to}`, {
      responseType: 'blob'
    });
  }
}