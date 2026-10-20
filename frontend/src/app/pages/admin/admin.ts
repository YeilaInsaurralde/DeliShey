import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.services';
import { switchMap, of } from 'rxjs';
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
  saving = false;
  attemptedSubmit = false;
  selectedImage: File | null = null;
  previewUrl = '';
  error = '';
  success = '';
  pendingDelete: Product | null = null;
  deleting = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

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
        this.productService.getAllProductsAdmin().subscribe({
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
    this.attemptedSubmit = false;
    this.formModel = {
      name: '',
      price: 0,
      category: '',
      description: '',
      image: '',
      is_active: true
    };
    this.selectedImage = null;
    this.previewUrl = '';
    this.showForm = true;
  }

  openEditForm(product: Product): void {
    this.attemptedSubmit = false;
    this.editingId = product.id;
    this.formModel = { ...product };
    this.selectedImage = null;
    this.previewUrl = '';
    this.showForm = true;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      this.error = 'La imagen debe ser JPG, PNG o WebP y pesar hasta 5 MB';
      input.value = '';
      return;
    }
    this.error = '';
    this.selectedImage = file;
    const reader = new FileReader();
    reader.onload = () => this.previewUrl = String(reader.result || '');
    reader.readAsDataURL(file);
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
  }

  fieldError(field: 'name' | 'price' | 'category' | 'description'): string {
    if (!this.attemptedSubmit) return '';
    const name = (this.formModel.name || '').trim();
    const price = Number(this.formModel.price);
    const category = this.formModel.category || '';
    const description = this.formModel.description || '';
    switch (field) {
      case 'name': return !name ? 'Ingresá el nombre del producto.' : name.length > 100 ? 'Máximo 100 caracteres.' : '';
      case 'price': return !Number.isFinite(price) || price <= 0 ? 'Ingresá un precio mayor que cero.' : price >= 100000000 ? 'El precio supera el máximo permitido.' : '';
      case 'category': return !['Pastelería', 'Panadería', 'Regalos'].includes(category) ? 'Seleccioná una categoría válida.' : '';
      case 'description': return description.length > 2000 ? 'Máximo 2000 caracteres.' : '';
    }
  }

  submitForm(): void {
    this.attemptedSubmit = true;
    this.error = '';
    this.success = '';
    const name = this.formModel.name?.trim() || '';
    const price = Number(this.formModel.price);
    const description = this.formModel.description || '';
    if (!name || name.length > 100 || !Number.isFinite(price) || price <= 0 || price >= 100000000 ||
        !['Pastelería', 'Panadería', 'Regalos'].includes(this.formModel.category || '') || description.length > 2000) {
      this.error = 'Corregí los campos señalados antes de guardar.';
      return;
    }
    this.saving = true;
    const image$ = this.selectedImage ? this.productService.uploadImage(this.selectedImage) : of({ url: this.formModel.image || '' });
    image$.pipe(switchMap(({url}) => {
      const data = { ...this.formModel, name, price, image: url };
      return this.editingId ? this.productService.updateProduct(this.editingId, data) : this.productService.createProduct(data);
    })).subscribe({
      next: () => {
        this.success = this.editingId ? 'Producto actualizado' : 'Producto creado';
        this.saving = false;
        this.showForm = false;
        this.selectedImage = null;
        this.loadProducts();
      },
      error: (err) => {
        this.saving = false;
        this.error = err.error?.message || 'No se pudo guardar el producto o la imagen';
      }
    });
  }

  // La confirmación se muestra dentro de Angular, sin ventanas nativas del navegador.
  deleteProduct(product: Product): void {
    this.pendingDelete = product;
    this.error = '';
  }

  cancelDelete(): void {
    if (this.deleting) return;
    this.pendingDelete = null;
  }

  confirmDelete(): void {
    if (!this.pendingDelete || this.deleting) return;
    const product = this.pendingDelete;
    this.deleting = true;
    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.deleting = false;
        this.pendingDelete = null;
        this.showToast('Producto eliminado correctamente', 'success');
        this.loadProducts();
      },
      error: (err) => {
        this.deleting = false;
        this.pendingDelete = null;
        this.showToast(err.error?.message || 'No se pudo eliminar el producto', 'error');
      }
    });
  }

  dismissToast(): void {
    this.toastMessage = '';
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = null;
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.dismissToast();
    this.toastMessage = message;
    this.toastType = type;
    this.toastTimer = setTimeout(() => this.dismissToast(), 4000);
  }

}
