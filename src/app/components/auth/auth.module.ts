import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  // Asegúrate de importar CommonModule
import { FormsModule } from '@angular/forms';  // Importa FormsModule para usar ngModel
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,  // Necesario para usar *ngIf, *ngFor
    FormsModule,   // Necesario para usar ngModel
    RouterModule,
  ],
})
export class AuthModule {}
