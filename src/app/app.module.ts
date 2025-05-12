import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';  // Importar CommonModule aquí

// Importamos los componentes standalone
import { AppComponent } from './app.component';
import { ProductosComponent } from './components/productos/productos.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CommonModule,  // Asegúrate de importar CommonModule aquí
    AppComponent,  // AppComponent como standalone
    ProductosComponent,
    PedidosComponent,
    LoginComponent,
    RegisterComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]  // Componente raíz a arrancar
})
export class AppModule { }
