import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PurchasedProduct {
  id: number;
  name: string;
  image: string;
  rating: number | null;
  comment: string | null;
}

export interface ProductReview {
  rating: number;
  comment: string | null;
  created_at: string;
  user_name: string;
}

export interface ProductRatingsSummary {
  avg_rating: number | null;
  total_ratings: number;
  reviews: ProductReview[];
}

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  private apiUrl = `${environment.apiUrl}/ratings`;

  constructor(private http: HttpClient) {}

  // Califica (o actualiza la calificación de) un producto comprado
  rateProduct(productId: number, rating: number, comment: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      product_id: productId,
      rating,
      comment
    });
  }

  // Productos que compró el usuario logueado, para calificar
  getMyPurchases(): Observable<PurchasedProduct[]> {
    return this.http.get<PurchasedProduct[]>(`${this.apiUrl}/my-purchases`);
  }

  // Calificaciones públicas de un producto (promedio + reseñas)
  getProductRatings(productId: number): Observable<ProductRatingsSummary> {
    return this.http.get<ProductRatingsSummary>(`${this.apiUrl}/product/${productId}`);
  }
}