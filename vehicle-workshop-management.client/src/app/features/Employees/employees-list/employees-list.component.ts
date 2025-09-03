import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DxButtonModule,
  DxDataGridModule,
  DxDataGridComponent,
  DxDropDownButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxPopupModule
} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { ApiService } from '../../../api/api';
import notify from "devextreme/ui/notify";

type EmployeeStatus = 'Active' | 'Inactive' | 'On Leave' | 'All';
type EmployeeRole = 'Manager' | 'Developer' | 'Designer' | 'HR' | 'All';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    DxDataGridModule,
    DxButtonModule,
    DxDropDownButtonModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxPopupModule
  ]
})
export class EmployeesListComponent {
  @ViewChild(DxDataGridComponent, { static: true }) dataGrid!: DxDataGridComponent;
  taskLines: any[] = []; 
  statusList = ['Active', 'Inactive', 'On Leave'];
  roleList = ['Manager', 'Developer', 'Designer', 'HR'];

  filterStatusList: EmployeeStatus[] = ['All', 'Active', 'Inactive', 'On Leave'];
  filterRoleList: EmployeeRole[] = ['All', 'Manager', 'Developer', 'Designer', 'HR'];
  isTaskPopupOpened = false;

  selectedEmployeeId: number | null = null;
  isAddEmployeePopupOpened = false;
  popupTitle = 'Add Employee';
  isPanelOpened = false;
  currentEmployee: any = {
    name: '',
    email: '',
    phone: '',
    type: 'Developer',
    status: 'Active'
  };
  CreateEmployee: any = {
    name: '',
    email: '',
    phone: '',
    type: 'Developer',
    status: 'Active',
    username: '',
    password: ''
  };


  dataSource = new DataSource({
    key: 'employeeId',
    load: () => new Promise((resolve, reject) => {
      this.apiService.get('Employees').subscribe({
        next: (data: any) => resolve(data),
        error: ({ message }) => reject(message)
      });
    }),
  });

  constructor(private apiService: ApiService) { }

  addEmployee() {
    this.currentEmployee = {
      name: '',
      email: '',
      phone: '',
      role: 'Developer',
      status: 'Active'
    };
    this.popupTitle = 'Add Employee';
    this.isAddEmployeePopupOpened = true;
  }

  EditEmployee: any = {
    employeeId: null,
    name: '',
    email: '',
    phone: '',
    type: 'Developer',
    status: 'Active',
    hireDate: '',
    username: '',
    password: ''
  };

  editEmployee(employee: any) {
    this.EditEmployee = {
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      type: employee.type || 'Developer',
      status: employee.status || 'Active',
      hireDate: employee.hireDate || new Date().toISOString().split('T')[0], // default today
      username: employee.username || '',
      password: employee.password || ''
    };
    this.popupTitle = 'Edit Employee';
    this.isAddEmployeePopupOpened = true;
  }

  onSaveEmployee() {
    if (this.popupTitle === 'Add Employee') {
      this.apiService.register(this.CreateEmployee).subscribe({
        next: () => {
          notify('Employee added successfully', 'success', 2000);
          this.isAddEmployeePopupOpened = false;
          this.refresh();
        },
        error: (error) => {
          notify(`Error adding employee: ${error.message}`, 'error', 2000);
        }
      });
    } else {
      const payload = {
        name: this.EditEmployee.name,
        email: this.EditEmployee.email,
        phone: this.EditEmployee.phone,
        type: this.EditEmployee.type,
        status: this.EditEmployee.status,
        hireDate: this.EditEmployee.hireDate,
        username: this.EditEmployee.username,
        password: this.EditEmployee.password
      };
      this.apiService.put('Employees', this.EditEmployee.employeeId, payload).subscribe({
        next: () => {
          notify('Employee updated successfully', 'success', 2000);
          this.isAddEmployeePopupOpened = false;
          this.refresh();
        },
        error: (error) => {
          notify(`Error updating employee: ${error.message}`, 'error', 2000);
        }
      });
    }
  }


  deleteEmployee(employeeId: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.apiService.delete('Employees', employeeId).subscribe({
        next: () => {
          notify('Employee deleted successfully', 'success', 2000);
          this.refresh();
        },
        error: (error) => {
          notify(`Error deleting employee: ${error.message}`, 'error', 2000);
        }
      });
    }
  }

  onEditClick(e: any) {
    const employee = e?.row?.data;
    if (employee && employee.employeeId) {
      this.editEmployee(employee);
    } else {
      notify('Cannot edit this employee', 'error', 2000);
    }
  }

  onDeleteClick(e: any) {
    if (e.row?.data) {
      this.deleteEmployee(e.row.data.employeeId);
    }
  }

  onSelectionChanged(e: any) {
    const selected = e.selectedRowsData[0];
    if (selected) {
      this.selectedEmployeeId = selected.employeeId;
      this.apiService.get(`Employees/${selected.employeeId}`).subscribe({
        next: (result: any) => {
          const employee = Array.isArray(result) ? result[0] : result;
          this.taskLines = employee?.taskLines || [];
          this.isTaskPopupOpened = true;
        },
        error: (err) => {
          notify(`Error loading task lines: ${err.message}`, 'error', 2000);
        }
      });
    }
  }



  onDeleteTaskLine(e: any) {
    const deletedLine = e.data;
    if (confirm('Are you sure you want to delete this task line?')) {
      this.apiService.delete('TaskLines', deletedLine.taskLineId).subscribe({
        next: () => {
          notify('Task line deleted successfully', 'success', 2000);
          this.refreshTaskLines();
        },
        error: (error) => {
          notify(`Error deleting task line: ${error.message}`, 'error', 2000);
        }
      });
    }
  }

  refreshTaskLines() {
    if (this.selectedEmployeeId) {
      this.apiService.get(`Employees/${this.selectedEmployeeId}`).subscribe({
        next: (employee: any) => {
          this.taskLines = employee.taskLines || [];
        },
        error: (err) => {
          notify(`Error refreshing task lines: ${err.message}`, 'error', 2000);
        }
      });
    }
  }

  closeTaskPopup() {
    this.isTaskPopupOpened = false;
  }


  onCancelEdit() {
    this.isAddEmployeePopupOpened = false;
  }

  refresh() {
    this.dataGrid.instance.refresh();
  }

  filterByStatus(e: any) {
    const status = e.itemData as EmployeeStatus;
    status === 'All'
      ? this.dataGrid.instance.clearFilter()
      : this.dataGrid.instance.filter(['status', '=', status]);
  }

  filterByRole(e: any) {
    const role = e.itemData as EmployeeRole;
    role === 'All'
      ? this.dataGrid.instance.clearFilter()
      : this.dataGrid.instance.filter(['role', '=', role]);
  }

  customizePhoneCell = ({ value }: { value: string }) => {
    if (!value) return '';
    const cleaned = value.replace(/\D/g, '');
    return cleaned.length === 10 && cleaned.startsWith('05')
      ? `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
      : value;
  };

  getStatusClass = (status: string) => {
    return status === 'Active' ? 'status-active' : 'status-inactive';
  };
}
