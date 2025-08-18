import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DxDataGridModule,
  DxDataGridComponent,
  DxButtonModule,
  DxDropDownButtonModule
} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { ApiService } from '../../../api/api';
import notify from "devextreme/ui/notify";

import { RowClickEvent } from 'devextreme/ui/data_grid';
import { ItemClickEvent as DropDownButtonItemClickEvent } from 'devextreme/ui/drop_down_button';

type FilterCustomerStatus = 'Active' | 'Inactive' | 'All';
type FilterCustomerType = 'Company' | 'Individual' | 'All';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    DxDataGridModule,
    DxButtonModule,
    DxDropDownButtonModule,
    
  ]
})
export class CustomerListComponent {
  @ViewChild(DxDataGridComponent, { static: true }) dataGrid!: DxDataGridComponent;

  statusList = ['Active', 'Inactive'];
  typeList = ['Company', 'Individual'];
 
  filterStatusList: FilterCustomerStatus[] = ['All', 'Active', 'Inactive'];
  filterTypeList: FilterCustomerType[] = ['All', 'Company', 'Individual'];

  isPanelOpened = false;
  isAddCustomerPopupOpened = false;
  selectedCustomerId: number | null = null;

  dataSource = new DataSource({
    key: 'customerId',
    load: () => new Promise((resolve, reject) => {
      this.apiService.get('Customers').subscribe({
        next: (data: any) => resolve(data),
        error: ({ message }) => reject(message)
      });
    }),
  });

  constructor(private apiService: ApiService) { }

  addCustomer() {
    this.isAddCustomerPopupOpened = true;
  }

  refresh = () => {
    this.dataGrid.instance.refresh();
  };

  rowClick(e: any) {
    const data = e.data;
    this.selectedCustomerId = data.customerId;
    this.isPanelOpened = true;
  }

  onOpenedChange = (value: boolean) => {
    if (!value) {
      this.selectedCustomerId = null;
    }
  };

  filterByStatus = (e: DropDownButtonItemClickEvent) => {
    const status = e.itemData as FilterCustomerStatus;
    status === 'All'
      ? this.dataGrid.instance.clearFilter('status')
      : this.dataGrid.instance.filter(['status', '=', status]);
  };

  filterByType = (e: DropDownButtonItemClickEvent) => {
    const type = e.itemData as FilterCustomerType;
    type === 'All'
      ? this.dataGrid.instance.clearFilter('type')
      : this.dataGrid.instance.filter(['type', '=', type]);
  };
  customizePhoneCell = ({ value }: { value: string }) => {
    if (!value) return '';
    const cleaned = value.replace(/\D/g, '');
    return cleaned.length === 10 && cleaned.startsWith('05')
      ? `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
      : value;
  };

  formatDate = ({ value }: { value: string }) => {
    return value ? new Date(value).toLocaleDateString('en-GB') : '';
  };

  getStatusClass = (status: string) => {
    return status === 'Active' ? 'status-active' : 'status-inactive';
  };

  getTypeIcon = (type: string) => {
    return type === 'Company' ? 'home' : 'user';
  };

  onSaveNewCustomer = (customerData: any) => {
    this.apiService.post('Customers', customerData).subscribe({
      next: () => {
        notify({
          message: `New customer "${customerData.name}" saved`,
          position: { at: 'bottom center', my: 'bottom center' }
        }, 'success');
        this.isAddCustomerPopupOpened = false;
        this.refresh();
      },
      error: (error: { message: any; }) => {
        notify({
          message: `Failed to save customer: ${error.message}`,
          position: { at: 'bottom center', my: 'bottom center' }
        }, 'error');
      }
    });
  };
}
