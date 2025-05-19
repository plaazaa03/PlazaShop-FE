// src/app/pipes/image-url.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../enviroments'; // Ajusta la ruta

@Pipe({
  name: 'imageUrl',
  standalone: true // ¡ASEGÚRATE DE ESTO!
})
export class ImageUrlPipe implements PipeTransform {
  // ... tu lógica del pipe ...
  transform(imageName: string | null | undefined): string {
    const localPlaceholder = 'assets/images/placeholder.png';

    if (!imageName) {
      return localPlaceholder;
    }
    if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
      return imageName;
    }
    if (environment.imageBaseUrl) {
      return environment.imageBaseUrl + imageName;
    } else {
      console.warn('ImageUrlPipe: environment.imageBaseUrl no está definida!');
      return localPlaceholder;
    }
  }
}