// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosComponent } from './components/productos/productos.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { AdminProductosComponent } from './components/admin-productos/admin-productos.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', redirectTo: '/productos', pathMatch: 'full' },
  { path: 'productos', component: ProductosComponent },
  { path: 'pedidos', component: PedidosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'admin-productos', component: AdminProductosComponent },
  { path: 'admin/usuarios', component: AdminUsersComponent, canActivate: [adminGuard, authGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
