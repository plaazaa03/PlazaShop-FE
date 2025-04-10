// src/main.ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';  // Importa el componente raíz

platformBrowserDynamic().bootstrapModule(AppModule) // Arranca el componente raíz
  .catch(err => console.error(err));
