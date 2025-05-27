// src/app/app.component.ts
import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { NotificationCardComponent } from './components/notification-card/notification-card.component'; // <--- ¡IMPORTANTE! Ajusta la ruta si es necesario


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,  // Marca el componente como standalone
  imports: [HeaderComponent, FooterComponent, RouterModule, NotificationCardComponent]  // Importamos los componentes standalone
})
export class AppComponent {
  title = 'PlazaShop';  // Propiedad de ejemplo
}
