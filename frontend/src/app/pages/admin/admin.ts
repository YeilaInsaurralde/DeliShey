import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.services';
import { Product } from '../../models/products/products.models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})

export class Admin implements OnInit {

  products: Product[] = [];
  loading = false;
  error = '';
  success = '';

  showForm = false;
  editingId: number | null = null;

  formModel: Partial<Product> = {
    name: '',
    price: 0,
    category: '',
    description: '',
    image: '',
    is_active: true
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los productos';
        this.loading = false;
      }
    });
  }

  openCreateForm(): void {
    this.editingId = null;
    this.formModel = {
      name: '',
      price: 0,
      category: '',
      description: '',
      image: '',
      is_active: true
    };
    this.showForm = true;
  }

  openEditForm(product: Product): void {
    this.editingId = product.id;
    this.formModel = { ...product };
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
  }

  submitForm(): void {

    this.error = '';
    this.success = '';

    if (this.editingId) {

      this.productService
        .updateProduct(this.editingId, this.formModel)
        .subscribe({
          next: () => {
            this.success = 'Producto actualizado';
            this.showForm = false;
            this.loadProducts();
          },
          error: (err) => {
            this.error = err.error?.message || 'Error al actualizar el producto';
          }
        });

    } else {

      this.productService
        .createProduct(this.formModel)
        .subscribe({
          next: () => {
            this.success = 'Producto creado';
            this.showForm = false;
            this.loadProducts();
          },
          error: (err) => {
            this.error = err.error?.message || 'Error al crear el producto';
          }
        });

    }

  }

  deleteProduct(product: Product): void {

    const confirmDelete = confirm(
      `¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`
    );

    if (!confirmDelete) {
      return;
    }

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.success = 'Producto eliminado';
        this.loadProducts();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al eliminar el producto';
      }
    });

  }

}
