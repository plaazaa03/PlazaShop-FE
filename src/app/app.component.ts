// src/app/app.component.ts
import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,  // Marca el componente como standalone
  imports: [HeaderComponent, FooterComponent, RouterModule]  // Importamos los componentes standalone
})
export class AppComponent {
  title = 'PlazaShop';  // Propiedad de ejemplo
}
