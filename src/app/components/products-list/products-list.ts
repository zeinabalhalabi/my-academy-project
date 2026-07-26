import { Component } from '@angular/core';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
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

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList {
  rowData: IRow[] = [
    { id: 1, 
      name:'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
      category: 'men\'s clothing',
      description: 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
      price: 109.95,
      status: 'available'
    },
    { id: 2,
      name: 'Mens Casual Premium Slim Fit T-Shirts',
      category: 'men\'s clothing',
      description: 'Slim fit casual t-shirts for everyday wear',
      price: 22.3,
      status: 'available'
    }
  ];
  colDefs: ColDef<IRow>[] = [
    { headerName: 'Product Id', field: 'id' },
    { headerName: 'Name', field: 'name'},
    { headerName: 'Category', field: 'category' },
    { headerName: 'Description', field: 'description'},
    { headerName: 'Price', field: 'price' },
    { headerName: 'Status', field: 'status'}
  ] 

  defaultColDef: ColDef = {
    flex: 1,
  };

}
