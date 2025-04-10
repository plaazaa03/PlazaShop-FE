// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

// Importamos los componentes standalone
import { AppComponent } from './app.component';
import { ProductosComponent } from './components/productos/productos.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';

// Aquí no necesitas declarar HeaderComponent ni FooterComponent en declarations
// Ya que son standalone y se importan directamente en AppComponent

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    // Importamos los componentes standalone
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
