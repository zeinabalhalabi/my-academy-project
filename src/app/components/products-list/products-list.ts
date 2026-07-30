import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AllCommunityModule, ModuleRegistry} from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef } from 'ag-grid-community';


ModuleRegistry.registerModules([AllCommunityModule]);

interface IRow {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  status: string;
}

interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList {
  private http = inject(HttpClient);

  rowData = signal<IRow[]>([]);

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1
  };
  colDefs: ColDef<IRow>[] = [
    { headerName: 'Product Id', field: 'id' },
    { headerName: 'Name', field: 'name'},
    { headerName: 'Category', field: 'category' },
    { headerName: 'Description', field: 'description'},
    { headerName: 'Price', field: 'price', valueFormatter: params => `$${params.value?.toFixed(2)}` },
    { headerName: 'Status', field: 'status'},
    {
      // 6. Delete Button Column
      headerName: 'Actions',
      field: 'id',
      width: 100,
      flex: 0,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => {
        const button = document.createElement('button');
        button.className = 'btn-delete';
        button.title = 'Delete Row';
        button.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">delete</span>';
        
        button.addEventListener('click', () => {
          this.deleteRow(params.data.id);
        });

        return button;
      }
    }
  ];

  ngOnInit(): void {
    this.fetchProducts();
  }

  deleteRow(id: number): void {
    this.rowData.update(rows => rows.filter(row => row.id !== id));
  }

  private fetchProducts(): void {
    this.http.get<FakeStoreProduct[]>('https://fakestoreapi.com/products')
      .subscribe({
        next: (products) => {
          console.log('Fetched products array:', products);

          if (Array.isArray(products) && products.length > 0) {
            const mappedRows: IRow[] = products.map(product => ({
              id: product.id,
              name: product.title,
              category: product.category,
              description: product.description,
              price: product.price,
              status: 'available'
            }));

            this.rowData.set(mappedRows);
          }
        },
        error: (err) => console.error('Failed to load products:', err)
      });
  }
}


