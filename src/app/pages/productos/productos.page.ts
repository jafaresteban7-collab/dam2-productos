import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonButton
} from '@ionic/angular';
import { Product, ProductsResponse } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [
    CurrencyPipe,
    DecimalPipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonSpinner,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonBadge,
    IonButton
  ]
})
export class ProductosPage implements OnInit {
  private productService = inject(ProductService);

  readonly pageSize = 10;

  products = signal<Product[]>([]);
  total = signal(0);
  page = signal(1);
  loading = signal(false);
  error = signal('');

  totalPages = computed(() => Math.ceil(this.total() / this.pageSize));

  // Indicadores del dashboard (sobre los productos de la página actual)
  pageStockValue = computed(() =>
    this.products().reduce((acc, p) => acc + this.stockValue(p), 0)
  );

  avgRating = computed(() => {
    const list = this.products();
    return list.length
      ? list.reduce((acc, p) => acc + p.rating, 0) / list.length
      : 0;
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set('');

    const skip = (this.page() - 1) * this.pageSize;

    this.productService.getProducts(this.pageSize, skip).subscribe({
      next: (response: ProductsResponse) => {
        this.products.set(response.products);
        this.total.set(response.total);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('No se han podido cargar los productos.');
        this.loading.set(false);
      }
    });
  }

  nextPage(): void {
    if (this.page() < this.totalPages()) {
      this.page.update(p => p + 1);
      this.loadProducts();
    }
  }

  prevPage(): void {
    if (this.page() > 1) {
      this.page.update(p => p - 1);
      this.loadProducts();
    }
  }

  // Precio con el descuento aplicado
  finalPrice(product: Product): number {
    return product.price * (1 - product.discountPercentage / 100);
  }

  // Stock valorado = unidades × precio con el descuento aplicado
  stockValue(product: Product): number {
    return product.stock * this.finalPrice(product);
  }
}