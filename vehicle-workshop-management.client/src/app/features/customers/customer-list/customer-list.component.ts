import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DxDataGridModule,
  DxDataGridComponent,
  DxButtonModule,
  DxDropDownButtonModule,
  DxTextBoxModule,
  DxSelectBoxModule,
  DxPopupModule,
  DxCheckBoxModule,
} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { ApiService } from '../../../api/api';
import notify from "devextreme/ui/notify";

type FilterCustomerStatus = 'Active' | 'Inactive' | 'All';
type FilterCustomerType = 'Company' | 'Individual' | 'All';

interface CustomerCar {
  id?: number;
  customerId: number;
  make: string;
  model: string;
  year: string;
  color: string;
}

interface CustomerContact {
  id?: number;
  customerId: number;
  name: string;
  phone: string;
  email: string;
  position: string;
  isPrimary: boolean;
}

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DxDataGridModule,
    DxButtonModule,
    DxDropDownButtonModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    DxPopupModule,
    DxCheckBoxModule
  ]
})
export class CustomerListComponent {
  @ViewChild(DxDataGridComponent, { static: true }) dataGrid!: DxDataGridComponent;
  @ViewChild('carsDataGrid', { static: false }) carsDataGrid!: DxDataGridComponent;
  @ViewChild('contactsDataGrid', { static: false }) contactsDataGrid!: DxDataGridComponent;

  statusList = ['Active', 'Inactive'];
  typeList = ['Company', 'Individual'];

  filterStatusList: FilterCustomerStatus[] = ['All', 'Active', 'Inactive'];
  filterTypeList: FilterCustomerType[] = ['All', 'Company', 'Individual'];

  // Customer popup states
  isEditCustomerPopupOpened = false;
  isAddCustomerPopupOpened = false;
  currentCustomer: any = {
    name: '',
    phone: '',
    email: '',
    type: 'Company',
    status: 'Active'
  };
  popupTitle = 'Add Customer';

  // Cars management states
  isCarsPopupOpened = false;
  isAddCarPopupOpened = false;
  isEditCarPopupOpened = false;
  currentCustomerForCars: any = null;
  currentCar: CustomerCar = {
    customerId: 0,
    make: '',
    model: '',
    year: new Date().getFullYear().toString(),
    color: ''
  };
  carPopupTitle = 'Add Car';

  // Contacts management states
  isContactsPopupOpened = false;
  isAddContactPopupOpened = false;
  isEditContactPopupOpened = false;
  currentCustomerForContacts: any = null;
  currentContact: CustomerContact = {
    customerId: 0,
    name: '',
    phone: '',
    email: '',
    position: '',
    isPrimary: false
  };
  contactPopupTitle = 'Add Contact';

  // Panel states
  isPanelOpened = false;
  selectedCustomerId: number | null = null;

  // Data sources
  dataSource = new DataSource({
    key: 'customerId',
    load: () => new Promise((resolve, reject) => {
      this.apiService.get('Customers').subscribe({
        next: (data: any) => resolve(data),
        error: ({ message }) => reject(message)
      });
    }),
  });

  carsDataSource = new DataSource({
    key: 'customerId',
    load: () => new Promise((resolve, reject) => {
      if (!this.currentCustomerForCars?.customerId) {
        resolve([]);
        return;
      }
      this.apiService.get(`CustomerCars/${this.currentCustomerForCars.customerId}/cars`).subscribe({
        next: (data: any) => resolve(data),
        error: ({ message }) => reject(message)
      });
    }),
  });

  contactsDataSource = new DataSource({
    key: 'contactId',
    load: () => new Promise((resolve, reject) => {
      if (!this.currentCustomerForContacts?.customerId) {
        resolve([]);
        return;
      }
      this.apiService.get(`CustomerContacts/${this.currentCustomerForContacts.customerId}/contacts`).subscribe({
        next: (data: any) => resolve(data),
        error: ({ message }) => reject(message)
      });
    }),
  });

  constructor(private apiService: ApiService) { }

  // Customer CRUD operations
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
    if (e.row?.data) {
      this.editCustomer(e.row.data);
    }
  }

  onDeleteClick(e: any) {
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

  // Cars management methods
  onManageCarsClick(e: any) {
    if (e.row?.data) {
      this.currentCustomerForCars = e.row.data;
      this.isCarsPopupOpened = true;
      this.carsDataSource.reload();
    }
  }

  addCar() {
    this.currentCar = {
      customerId: this.currentCustomerForCars.customerId,
      make: '',
      model: '',
      year: new Date().getFullYear().toString(),
      color: ''
    };
    this.carPopupTitle = 'Add Car';
    this.isAddCarPopupOpened = true;
  }

  editCar(car: CustomerCar) {
    this.currentCar = { ...car };
    this.carPopupTitle = 'Edit Car';
    this.isEditCarPopupOpened = true;
  }

  onEditCarClick(e: any) {
    if (e.row?.data) {
      this.editCar(e.row.data);
    }
  }

  onDeleteCarClick(e: any) {
    if (e.row?.data && confirm('Are you sure you want to delete this car?')) {
      this.apiService.delete('CustomerCars', e.row.data.id).subscribe({
        next: () => {
          notify('Car deleted successfully', 'success', 2000);
          this.carsDataSource.reload();
        },
        error: (error) => {
          notify(`Error deleting car: ${error.message}`, 'error', 2000);
        }
      });
    }
  }

  onSaveNewCar() {
    this.apiService.post(`CustomerCars/customers/${this.currentCustomerForCars.customerId}/cars`, this.currentCar)
      .subscribe({
        next: () => {
          notify('Car saved successfully', 'success', 2000);
          this.isAddCarPopupOpened = false;
          this.carsDataSource.reload();
        },
        error: (error) => {
          notify(`Error saving car: ${error.message}`, 'error', 2000);
        }
      });
  }

  onSaveEditedCar() {
    /*
    this.apiService.put(`customers/${this.currentCustomerForCars.customerId}/cars/${this.currentCar.id}`, this.currentCar)
      .subscribe({
        next: () => {
          notify('Car updated successfully', 'success', 2000);
          this.isEditCarPopupOpened = false;
          this.carsDataSource.reload();
        },
        error: (error) => {
          notify(`Error updating car: ${error.message}`, 'error', 2000);
        }
      });
      */
  }

  onCancelCarEdit() {
    this.isAddCarPopupOpened = false;
    this.isEditCarPopupOpened = false;
    this.currentCar = {
      customerId: 0,
      make: '',
      model: '',
      year: new Date().getFullYear().toString(),
      color: ''
    };
  }

  onCloseCarsPopup() {
    this.isCarsPopupOpened = false;
    this.currentCustomerForCars = null;
  }

  // Contacts management methods
  onManageContactsClick(e: any) {
    if (e.row?.data) {
      this.currentCustomerForContacts = e.row.data;
      this.isContactsPopupOpened = true;
      this.contactsDataSource.reload();
    }
  }

  addContact() {
    this.currentContact = {
      customerId: this.currentCustomerForContacts.customerId,
      name: '',
      phone: '',
      email: '',
      position: '',
      isPrimary: false
    };
    this.contactPopupTitle = 'Add Contact';
    this.isAddContactPopupOpened = true;
  }

  editContact(contact: CustomerContact) {
    this.currentContact = { ...contact };
    this.contactPopupTitle = 'Edit Contact';
    this.isEditContactPopupOpened = true;
  }

  onEditContactClick(e: any) {
    if (e.row?.data) {
      this.editContact(e.row.data);
    }
  }

  onDeleteContactClick(e: any) {
    if (e.row?.data && confirm('Are you sure you want to delete this contact?')) {
      this.apiService.delete('CustomerContacts', e.row.data.id).subscribe({
        next: () => {
          notify('Contact deleted successfully', 'success', 2000);
          this.contactsDataSource.reload();
        },
        error: (error) => {
          notify(`Error deleting contact: ${error.message}`, 'error', 2000);
        }
      });
    }
  }

  onSaveNewContact() {
    this.apiService.post(`CustomerContacts/customers/${this.currentCustomerForContacts.customerId}/contacts`, this.currentContact)
      .subscribe({
        next: () => {
          notify('Contact saved successfully', 'success', 2000);
          this.isAddContactPopupOpened = false;
          this.contactsDataSource.reload();
        },
        error: (error) => {
          notify(`Error saving contact: ${error.message}`, 'error', 2000);
        }
      });
  }

  onSaveEditedContact() {
    this.apiService.put('CustomerContacts', this.currentContact.id!, this.currentContact)
      .subscribe({
        next: () => {
          notify('Contact updated successfully', 'success', 2000);
          this.isEditContactPopupOpened = false;
          this.contactsDataSource.reload();
        },
        error: (error) => {
          notify(`Error updating contact: ${error.message}`, 'error', 2000);
        }
      });
  }

  onCancelContactEdit() {
    this.isAddContactPopupOpened = false;
    this.isEditContactPopupOpened = false;
    this.currentContact = {
      customerId: 0,
      name: '',
      phone: '',
      email: '',
      position: '',
      isPrimary: false
    };
  }

  onCloseContactsPopup() {
    this.isContactsPopupOpened = false;
    this.currentCustomerForContacts = null;
  }

  // Utility methods
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
}
