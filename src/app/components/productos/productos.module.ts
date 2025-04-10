// productos.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosComponent } from './productos.component';

@NgModule({
  declarations: [ProductosComponent],
  imports: [CommonModule],
  exports: [ProductosComponent],
})
export class ProductosModule {}
