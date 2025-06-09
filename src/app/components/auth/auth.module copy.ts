import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,  
    FormsModule,   
    RouterModule,
  ],
})
export class AuthModule {}
