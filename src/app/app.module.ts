import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


// componentes standalone
import { AppComponent } from './app.component';
import { ProductosComponent } from './components/productos/productos.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { NotificationCardComponent } from './components/notification-card/notification-card.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    CommonModule,
    AppComponent,
    ProductosComponent,
    PedidosComponent,
    LoginComponent,
    RegisterComponent,
    BrowserModule,
    BrowserAnimationsModule,
    NotificationCardComponent
  ],
  declarations: [
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
