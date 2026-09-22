import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.services';

interface SaleRow {
  order_id: number;
  created_at: string;
  product_name: string;
  price: number;
  quantity: number;
  item_total: number;
}

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.html',
  styleUrl: './ventas.scss'
})
export class Ventas implements OnInit {

  sales: SaleRow[] = [];
  loading = false;
  error = '';

  private today = new Date().toISOString().slice(0, 10);
  from = this.today;
  to = this.today;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';

    this.orderService.getSales(this.from, this.to).subscribe({
      next: (sales) => {
        this.sales = sales;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las ventas';
        this.loading = false;
      }
    });
  }

  get total(): number {
    return this.sales.reduce((sum, row) => sum + Number(row.item_total), 0);
  }

  download(): void {
    this.orderService.exportCsv(this.from, this.to).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ventas_${this.from}_a_${this.to}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.error = 'No se pudo descargar el archivo';
      }
    });
  }
}