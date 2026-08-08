import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/products/products.models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  // Traer todos los productos
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Traer productos por categoría
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.apiUrl}/category/${category}`
    );
  }

  // Traer producto por id
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(
      `${this.apiUrl}/${id}`
    );
  }

  // Crear producto (admin)
  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // Editar producto (admin)
  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(
      `${this.apiUrl}/${id}`,
      product
    );
  }

  // Eliminar producto (admin)
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}