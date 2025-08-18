import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DxDataGridModule,
  DxDataGridComponent,
  DxButtonModule,
  DxDropDownButtonModule,
  DxTextBoxModule,
  DxSelectBoxModule,
  DxPopupModule,
  
} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { ApiService } from '../../../api/api';
import notify from "devextreme/ui/notify";

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
    DxTextBoxModule,
    DxSelectBoxModule,
    DxPopupModule
  ]
})
export class CustomerListComponent {
  @ViewChild(DxDataGridComponent, { static: true }) dataGrid!: DxDataGridComponent;

  statusList = ['Active', 'Inactive'];
  typeList = ['Company', 'Individual'];

  filterStatusList: FilterCustomerStatus[] = ['All', 'Active', 'Inactive'];
  filterTypeList: FilterCustomerType[] = ['All', 'Company', 'Individual'];

  isEditCustomerPopupOpened = false;
  currentCustomer: any = {
    name: '',
    phone: '',
    email: '',
    type: 'Company',
    status: 'Active'
  };
  popupTitle = 'Add Customer';
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
    this.currentCustomer = {
      name: '',
      phone: '',
      email: '',
      type: 'Company',
      status: 'Active'
    };
    this.popupTitle = 'Add Customer';
    this.isAddCustomerPopupOpened = true;
  }

  deleteCustomer(customerId: number) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.apiService.delete('Customers', customerId).subscribe({
        next: () => {
          notify('Customer deleted successfully', 'success', 2000);
          this.refresh();
        },
        error: (error) => {
          notify(`Error deleting customer: ${error.message}`, 'error', 2000);
        }
      });
    }
  }

  editCustomer(customer: any) {
    this.currentCustomer = { ...customer };
    this.popupTitle = 'Edit Customer';
    this.isEditCustomerPopupOpened = true;
  }

  onEditClick(e: any) {
    console.log("Edit clicked:", e);
    if (e.row?.data) {
      this.editCustomer(e.row.data);
    }
  }

  onDeleteClick(e: any) {
    console.log("Delete clicked:", e);
    if (e.row?.data) {
      this.deleteCustomer(e.row.data.customerId);
    }
  }

  onSaveEditedCustomer() {
    this.apiService.put('Customers', this.currentCustomer.customerId, this.currentCustomer)
      .subscribe({
        next: () => {
          notify('Customer updated successfully', 'success', 2000);
          this.isEditCustomerPopupOpened = false;
          this.refresh();
        },
        error: (error) => {
          notify(`Error updating customer: ${error.message}`, 'error', 2000);
        }
      });
  }

  onCancelEdit() {
    this.isEditCustomerPopupOpened = false;
    this.isAddCustomerPopupOpened = false;
    this.currentCustomer = {
      name: '',
      phone: '',
      email: '',
      type: 'Company',
      status: 'Active'
    };
  }

  refresh() {
    this.dataGrid.instance.refresh();
  }

  rowClick(e: any) {
    const data = e.data;
    this.selectedCustomerId = data.customerId;
    this.isPanelOpened = true;
  }

  onOpenedChange(value: boolean) {
    if (!value) {
      this.selectedCustomerId = null;
    }
  }

  filterByStatus(e: any) {
    const status = e.itemData as FilterCustomerStatus;
    status === 'All'
      ? this.dataGrid.instance.clearFilter('status')
      : this.dataGrid.instance.filter(['status', '=', status]);
  }

  filterByType(e: any) {
    const type = e.itemData as FilterCustomerType;
    type === 'All'
      ? this.dataGrid.instance.clearFilter('type')
      : this.dataGrid.instance.filter(['type', '=', type]);
  }

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

  onSaveNewCustomer() {
    this.apiService.post('Customers', this.currentCustomer).subscribe({
      next: () => {
        notify({
          message: `New customer "${this.currentCustomer.name}" saved`,
          position: { at: 'bottom center', my: 'bottom center' }
        }, 'success');
        this.isAddCustomerPopupOpened = false;
        this.refresh();
      },
      error: (error: any) => {
        notify({
          message: `Failed to save customer: ${error.message}`,
          position: { at: 'bottom center', my: 'bottom center' }
        }, 'error');
      }
    });
  }
}
