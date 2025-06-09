import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/productos.service';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../model/producto.model';
import { CarritoUpdaterService } from '../../services/CarritoUpdater.service';
import { NotificationService } from '../../services/notification.service';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductosComponent implements OnInit {
  todosLosProductos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  productosPaginados: Producto[] = [];
  isAuthenticated = !!localStorage.getItem('token');
  isLoading: boolean = true;

  filtrosAplicados = {
    precioMin: null as number | null,
    precioMax: null as number | null
  };

  opcionOrden: string = 'relevancia';
  paginaActual: number = 1;
  itemsPorPagina: number = 12;
  totalProductosFiltrados: number = 0;
  totalPaginas: number = 0;
  arrayPaginas: number[] = [];


  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private carritoUpdaterService: CarritoUpdaterService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.cargarProductosIniciales();
  }

  cargarProductosIniciales(): void {
    this.isLoading = true;
    this.productoService.obtenerProductos().subscribe({
      next: (data: Producto[]) => {
        this.todosLosProductos = data.map(p => {
          (p as any).cantidadSeleccionada = 1;
          return p;
        });

        this.aplicarLogicaVista();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.notificationService.showError('Error al cargar la lista de productos.');
        this.isLoading = false;
      }
    });
  }


  aplicarTodosLosFiltros(): void { 
    this.paginaActual = 1;
    this.aplicarLogicaVista();
  }

  limpiarFiltros(): void {
    this.filtrosAplicados = {
      precioMin: null,
      precioMax: null
    };
   
    this.opcionOrden = 'relevancia';
    this.paginaActual = 1;
    this.aplicarLogicaVista();
  }


  
  ordenarProductos(): void {
    this.paginaActual = 1;
    this.aplicarLogicaVista();
  }


  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas && nuevaPagina !== this.paginaActual) {
      this.paginaActual = nuevaPagina;
      this.aplicarLogicaVista(false);
    }
  }

  private generarArrayPaginas(): void {
    this.arrayPaginas = [];
    if (this.totalPaginas === 0) return;

    if (this.totalPaginas <= 7) {
        for (let i = 1; i <= this.totalPaginas; i++) {
            this.arrayPaginas.push(i);
        }
    } else {
        this.arrayPaginas.push(1);
        let inicioRango = Math.max(2, this.paginaActual - 1);
        let finRango = Math.min(this.totalPaginas - 1, this.paginaActual + 1);

        if (this.paginaActual <= 3) {
            inicioRango = 2;
            finRango = Math.min(4, this.totalPaginas -1);
        } else if (this.paginaActual >= this.totalPaginas - 2) {
            inicioRango = Math.max(2, this.totalPaginas - 3);
            finRango = this.totalPaginas - 1;
        }

        if (inicioRango > 2) this.arrayPaginas.push(-1);

        for (let i = inicioRango; i <= finRango; i++) {
            if(i > 0 && i < this.totalPaginas) this.arrayPaginas.push(i);
        }

        if (finRango < this.totalPaginas - 1) this.arrayPaginas.push(-1); 
        if(this.totalPaginas > 1) this.arrayPaginas.push(this.totalPaginas); 
    }
    this.arrayPaginas = [...new Set(this.arrayPaginas)];
  }

  private aplicarLogicaVista(reFiltrarYOrdenar: boolean = true): void {
    this.isLoading = true;

    let productosResultado = [...this.todosLosProductos];

    if (reFiltrarYOrdenar) {
      if (this.filtrosAplicados.precioMin !== null && this.filtrosAplicados.precioMin >= 0) {
        productosResultado = productosResultado.filter(p => p.precio >= this.filtrosAplicados.precioMin!);
      }
      if (this.filtrosAplicados.precioMax !== null && this.filtrosAplicados.precioMax > 0) {
        productosResultado = productosResultado.filter(p => p.precio <= this.filtrosAplicados.precioMax!);
      }
      this.productosFiltrados = [...productosResultado];

      switch (this.opcionOrden) {
        case 'precio_asc':
          this.productosFiltrados.sort((a, b) => a.precio - b.precio);
          break;
        case 'precio_desc':
          this.productosFiltrados.sort((a, b) => b.precio - a.precio);
          break;
        case 'nombre_asc':
          this.productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
          break;
        case 'nombre_desc':
          this.productosFiltrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
          break;
        case 'novedad':
          this.productosFiltrados.sort((a, b) => (b.id || 0) - (a.id || 0));
          break;
        case 'relevancia':
        default:
           this.productosFiltrados.sort((a,b) => (a.id || 0) - (b.id || 0)); 
          break;
      }
    }

    this.totalProductosFiltrados = this.productosFiltrados.length;
    this.totalPaginas = Math.ceil(this.totalProductosFiltrados / this.itemsPorPagina);

    if (this.paginaActual > this.totalPaginas && this.totalPaginas > 0) {
      this.paginaActual = this.totalPaginas;
    } else if (this.totalPaginas === 0 && this.paginaActual !==1) {
        this.paginaActual = 1;
    }

    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.productosPaginados = this.productosFiltrados.slice(inicio, fin);

    this.generarArrayPaginas();
    this.isLoading = false;
  }

  
  agregarAlCarrito(producto: Producto): void {
    const cantidadSeleccionada = Number(producto.cantidadSeleccionada);


    if (isNaN(cantidadSeleccionada) || cantidadSeleccionada < 1) {
      this.notificationService.showWarning('La cantidad debe ser al menos 1.');
      producto.cantidadSeleccionada = 1;
      return;
    }
    if (cantidadSeleccionada > producto.stock) {
      this.notificationService.showWarning(`No hay suficiente stock. Disponible: ${producto.stock}.`);
      producto.cantidadSeleccionada = producto.stock > 0 ? producto.stock : 1;
      return;
    }

    const payload = {
      producto_id: producto.id,
      cantidad: cantidadSeleccionada
    };

    this.carritoService.agregarProducto(payload).subscribe({
      next: (response: any) => {
        this.carritoService.obtenerCarrito().subscribe((data) => {
          this.carritoUpdaterService.actualizarCarrito(data);
        });
        const successMessage = response?.message || `${producto.nombre} añadido al carrito.`;
        this.notificationService.showSuccess(successMessage);
      },
      error: (err) => {
        console.error('Error al agregar al carrito:', err);
        const errMsg = err.error?.message || err.message || 'Error al añadir el producto al carrito.';
        if (err.status === 401 || err.status === 403) {
          this.notificationService.showError('Debes iniciar sesión para añadir productos al carrito.');
        } else {
          this.notificationService.showError(errMsg);
        }
      }
    });
  }
}