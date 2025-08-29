import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DxDataGridModule, DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxDropDownButtonModule } from 'devextreme-angular/ui/drop-down-button';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { DxCheckBoxModule } from 'devextreme-angular/ui/check-box';
import DataSource from 'devextreme/data/data_source';
import { ApiService } from '../../../api/api';
import notify from "devextreme/ui/notify";

type FilterCustomerStatus = 'Active' | 'Inactive' | 'All';
type FilterCustomerType = 'Company' | 'Individual' | 'All';

interface Customer {
  customerId: number;
  name: string;
  phone: string;
  email: string;
  type: 'Company' | 'Individual';
  status: 'Active' | 'Inactive';
  createdAt: string;
}

interface CustomerCar {
  carId?: number;
  customerId: number;
  make: string;
  model: string;
  year: string;
  color: string;
}

interface CustomerContact {
  contactId?: number;
  customerId: number;
  name: string;
  phone: string;
  email: string;
}

interface CustomerForm {
  customerId?: number;  
  name: string;
  phone: string;
  email: string;
  type: 'Company' | 'Individual';
  status: 'Active' | 'Inactive';
}


interface CarForm {
  carId?: number;
  customerId: number;
  make: string;
  model: string;
  year: string;
  color: string;
}

interface ContactForm {
  contactId?: number;
  customerId: number;
  name: string;
  phone: string;
  email: string;
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
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid!: DxDataGridComponent;
  @ViewChild('carsDataGrid', { static: false }) carsDataGrid!: DxDataGridComponent;
  @ViewChild('contactsDataGrid', { static: false }) contactsDataGrid!: DxDataGridComponent;

  statusList = ['Active', 'Inactive'];
  typeList = ['Company', 'Individual'];
  filterStatusList: FilterCustomerStatus[] = ['All', 'Active', 'Inactive'];
  filterTypeList: FilterCustomerType[] = ['All', 'Company', 'Individual'];

  // Customer popup states
  isEditCustomerPopupOpened = false;
  isAddCustomerPopupOpened = false;
  currentCustomer: CustomerForm = this.getInitialCustomerState();
  popupTitle = 'Add Customer';

  // Cars management states
  isCarsPopupOpened = false;
  isAddCarPopupOpened = false;
  isEditCarPopupOpened = false;
  currentCustomerForCars: Customer | null = null;
  currentCar: CarForm = this.getInitialCarState();
  carPopupTitle = 'Add Car';

  // Contacts management states
  isContactsPopupOpened = false;
  isAddContactPopupOpened = false;
  isEditContactPopupOpened = false;
  currentCustomerForContacts: Customer | null = null;
  currentContact: ContactForm = this.getInitialContactState();
  contactPopupTitle = 'Add Contact';

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
    key: 'carId',
    load: () => new Promise((resolve, reject) => {
      if (!this.currentCustomerForCars?.customerId) {
        return resolve([]);
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
        return resolve([]);
      }
      this.apiService.get(`CustomerContacts/${this.currentCustomerForContacts.customerId}/contacts`).subscribe({
        next: (data: any) => resolve(data),
        error: ({ message }) => reject(message)
      });
    }),
  });

  constructor(private apiService: ApiService) { }
  
  // Utility method for initializing customer form data
  getInitialCustomerState(): CustomerForm {
    return { name: '', phone: '', email: '', type: 'Company', status: 'Active' };
  }
  getInitialCarState(customerId = 0): CarForm {
    return { customerId, make: '', model: '', year: new Date().getFullYear().toString(), color: '' };
  }

  getInitialContactState(customerId = 0): ContactForm {
    return { customerId, name: '', phone: '', email: '' };
  }

  // Customer CRUD operations
  addCustomer() {
    this.currentCustomer = this.getInitialCustomerState();
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
        error: (error) => notify(`Error deleting customer: ${error.message}`, 'error', 2000)
      });
    }
  }

  editCustomer(customer: Customer) {
    this.currentCustomer = { ...customer };
    this.popupTitle = 'Edit Customer';
    this.isEditCustomerPopupOpened = true;
  }

  onSaveEditedCustomer() {
    if (!this.currentCustomer.customerId) {
      notify('Missing Customer ID', 'error');
      return;
    }
    this.apiService.put('Customers', this.currentCustomer.customerId, this.currentCustomer).subscribe({
      next: () => {
        notify('Customer updated successfully', 'success', 2000);
        this.isEditCustomerPopupOpened = false;
        this.refresh();
      },
      error: (error) => notify(`Error updating customer: ${error.message}`, 'error', 2000)
    });
  }

  onSaveNewCustomer() {
    this.apiService.post('Customers', this.currentCustomer).subscribe({
      next: () => {
        notify(`New customer "${this.currentCustomer.name}" saved`, 'success');
        this.isAddCustomerPopupOpened = false;
        this.refresh();
      },
      error: (error: any) => notify(`Failed to save customer: ${error.message}`, 'error')
    });
  }

  onCancelEdit() {
    this.isEditCustomerPopupOpened = false;
    this.isAddCustomerPopupOpened = false;
    this.currentCustomer = this.getInitialCustomerState();
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
    this.currentCar = this.getInitialCarState(this.currentCustomerForCars!.customerId);
    this.carPopupTitle = 'Add Car';
    this.isAddCarPopupOpened = true;
  }

  editCar(car: CustomerCar) {
    this.currentCar = { ...car };
    this.carPopupTitle = 'Edit Car';
    this.isEditCarPopupOpened = true;
  }

  onDeleteCarClick(e: any) {
    if (e.row?.data && confirm('Are you sure you want to delete this car?')) {
      this.apiService.delete('CustomerCars', e.row.data.carId).subscribe({
        next: () => {
          notify('Car deleted successfully', 'success', 2000);
          this.carsDataSource.reload();
        },
        error: (error) => notify(`Error deleting car: ${error.message}`, 'error', 2000)
      });
    }
  }

  onSaveNewCar() {
    const payload = {
      make: this.currentCar.make, model: this.currentCar.model, year: this.currentCar.year, color: this.currentCar.color
    };
    this.apiService.post(`CustomerCars/customers/${this.currentCustomerForCars!.customerId}/cars`, payload).subscribe({
      next: () => {
        notify('Car saved successfully', 'success', 2000);
        this.isAddCarPopupOpened = false;
        this.carsDataSource.reload();
      },
      error: (error) => notify(`Error saving car: ${error.message}`, 'error', 2000)
    });
  }

  onSaveEditedCar() {
    if (!this.currentCar.carId) {
      notify('Cannot update car without a Car ID.', 'error');
      return;
    }
    const payload = {
      make: this.currentCar.make, model: this.currentCar.model, year: this.currentCar.year, color: this.currentCar.color
    };
    this.apiService.put('CustomerCars', this.currentCar.carId, payload).subscribe({
      next: () => {
        notify('Car updated successfully', 'success', 2000);
        this.isEditCarPopupOpened = false;
        this.carsDataSource.reload();
      },
      error: (error) => notify(`Error updating car: ${error.message}`, 'error', 2000)
    });
  }

  onCancelCarEdit() {
    this.isAddCarPopupOpened = false;
    this.isEditCarPopupOpened = false;
    this.currentCar = this.getInitialCarState();
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
    this.currentContact = this.getInitialContactState(this.currentCustomerForContacts!.customerId);
    this.contactPopupTitle = 'Add Contact';
    this.isAddContactPopupOpened = true;
  }

  editContact(contact: CustomerContact) {
    this.currentContact = { ...contact };
    this.contactPopupTitle = 'Edit Contact';
    this.isEditContactPopupOpened = true;
  }

  onDeleteContactClick(e: any) {
    if (e.row?.data && confirm('Are you sure you want to delete this contact?')) {
      this.apiService.delete('CustomerContacts', e.row.data.contactId).subscribe({
        next: () => {
          notify('Contact deleted successfully', 'success', 2000);
          this.contactsDataSource.reload();
        },
        error: (error) => notify(`Error deleting contact: ${error.message}`, 'error', 2000)
      });
    }
  }

  onSaveNewContact() {
    const payload = {
      name: this.currentContact.name, phone: this.currentContact.phone, email: this.currentContact.email
    };
    this.apiService.post(`CustomerContacts/customers/${this.currentCustomerForContacts!.customerId}/contacts`, payload).subscribe({
      next: () => {
        notify('Contact saved successfully', 'success', 2000);
        this.isAddContactPopupOpened = false;
        this.contactsDataSource.reload();
      },
      error: (error) => notify(`Error saving contact: ${error.message}`, 'error', 2000)
    });
  }

  onSaveEditedContact() {
    if (!this.currentContact.contactId) {
      notify('Cannot update contact without a Contact ID.', 'error');
      return;
    }
    const payload = {
      name: this.currentContact.name, phone: this.currentContact.phone, email: this.currentContact.email
    };
    this.apiService.put('CustomerContacts', this.currentContact.contactId, payload).subscribe({
      next: () => {
        notify('Contact updated successfully', 'success', 2000);
        this.isEditContactPopupOpened = false;
        this.contactsDataSource.reload();
      },
      error: (error) => notify(`Error updating contact: ${error.message}`, 'error', 2000)
    });
  }

  onCancelContactEdit() {
    this.isAddContactPopupOpened = false;
    this.isEditContactPopupOpened = false;
    this.currentContact = this.getInitialContactState();
  }

  onCloseContactsPopup() {
    this.isContactsPopupOpened = false;
    this.currentCustomerForContacts = null;
  }


  refresh() {
    this.dataGrid.instance.refresh();
  }

  // Grid event handlers
  onEditClick(e: any) { if (e.row?.data) this.editCustomer(e.row.data); }
  onDeleteClick(e: any) { if (e.row?.data) this.deleteCustomer(e.row.data.customerId); }
  onEditCarClick(e: any) { if (e.row?.data) this.editCar(e.row.data); }
  onEditContactClick(e: any) { if (e.row?.data) this.editContact(e.row.data); }

  filterByStatus(e: any) {
    const status = e.itemData as FilterCustomerStatus;
    status === 'All'
      ? this.dataGrid.instance.clearFilter()
      : this.dataGrid.instance.filter(['status', '=', status]);
  }

  filterByType(e: any) {
    const type = e.itemData as FilterCustomerType;
    type === 'All'
      ? this.dataGrid.instance.clearFilter()
      : this.dataGrid.instance.filter(['type', '=', type]);
  }

  // Cell formatters
  customizePhoneCell = ({ value }: { value: string }) => {
    if (!value) return '';
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return value;
  };

  formatDate = ({ value }: { value: string }) => {
    return value ? new Date(value).toLocaleDateString('en-US') : '';
  };

  getStatusClass = (status: string) => {
    return status === 'Active' ? 'status-active' : 'status-inactive';
  };

  getTypeIcon = (type: string) => {
    return type === 'Company' ? 'home' : 'user';
  };
}

