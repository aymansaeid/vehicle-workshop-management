import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DxDataGridModule,
  DxButtonModule,
  DxSelectBoxModule,
  DxDateBoxModule,
  DxPopupModule,
  DxTextBoxModule,
  DxValidatorModule,
  DxFormModule,
  DxLoadPanelModule
} from 'devextreme-angular';
import { ApiService } from '../../api/api';
import notify from "devextreme/ui/notify";

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    DxDataGridModule,
    DxButtonModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DxPopupModule,
    DxTextBoxModule,
    DxValidatorModule,
    DxFormModule,
    DxLoadPanelModule
  ]
})
export class AttendanceComponent implements OnInit {

  employees: any[] = [];

  attendanceData: any[] = [];
  todayAttendance: any[] = [];
  absentEmployees: any[] = [];
  allAttendanceData: any = {};

  isAttendancePopupOpened = false;
  selectedDate: Date = new Date();

  currentAttendance: any = {
    employeeId: null
  };

  viewMode: 'today' | 'all' | 'absent' = 'today';

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadEmployees();
    this.loadTodayAttendance();
  }

  loadEmployees() {
    this.apiService.get('Employees').subscribe({
      next: (data: any) => {
        this.employees = data;
      },
      error: (error) => {
        notify(`Error loading employees: ${error.message}`, 'error', 2000);
      }
    });
  }

  loadTodayAttendance() {
    this.apiService.get('Employees/attendance/today').subscribe({
      next: (data: any) => {
        this.todayAttendance = data.map((emp: any) => ({
          ...emp,
          employeeId: emp.employeeId, 
          employeeName: emp.name,
          status: 'Present',
          date: emp.lastPresentDate,
          formattedDate: this.formatDateDisplay(emp.lastPresentDate)
        }));
        this.attendanceData = this.todayAttendance;
        this.viewMode = 'today';
      },
      error: (error) => {
        notify(`Error loading today's attendance: ${error.message}`, 'error', 2000);
      }
    });
  }

  loadAllAttendance() {
    this.apiService.get('Employees/attendance').subscribe({
      next: (data: any) => {
        this.allAttendanceData = data;
        this.attendanceData = data.employees.map((emp: any) => ({
          ...emp,
          employeeId: emp.employeeId,
          employeeName: emp.name,
          status: emp.isPresentToday ? 'Present' : 'Absent',
          date: emp.lastPresentDate,
          formattedDate: this.formatDateDisplay(emp.lastPresentDate)
        }));
        this.viewMode = 'all';
      },
      error: (error) => {
        notify(`Error loading attendance records: ${error.message}`, 'error', 2000);
      }
    });
  }

  loadAbsentEmployees() {
    this.apiService.get('Employees/attendance/absent').subscribe({
      next: (data: any) => {
        this.absentEmployees = data.map((emp: any) => ({
          ...emp,
          employeeId: emp.employeeId, 
          employeeName: emp.name,
          status: 'Absent',
          date: emp.lastPresentDate,
          formattedDate: this.formatDateDisplay(emp.lastPresentDate)
        }));
        this.attendanceData = this.absentEmployees;
        this.viewMode = 'absent';
      },
      error: (error) => {
        notify(`Error loading absent employees: ${error.message}`, 'error', 2000);
      }
    });
  }


  markAttendance() {
    this.currentAttendance = {
      employeeId: null
    };
    this.isAttendancePopupOpened = true;
  }


  markAsPresent = (e: any) => {
    const employee = e.row?.data || e; 
    console.log('Mark as present - employee object:', employee);

    const employeeName = employee.employeeName || employee.name || 'Unknown';
    const employeeId = employee.employeeId;

    if (!employeeId) {
      notify('Employee ID is missing', 'error', 2000);
      return;
    }

    if (confirm(`Mark ${employeeName} as present?`)) {
      this.apiService.post(`Employees/${employeeId}/attendance`, {}).subscribe({
        next: (response: any) => {
          notify(response.message || `${employeeName} marked as present`, 'success', 2000);
          this.refreshCurrentView();
        },
        error: (error) => {
          console.error('Error marking as present:', error);
          notify(`Error marking as present: ${error.message || error}`, 'error', 2000);
        }
      });
    }
  }

  markAsAbsent = (e: any) => {
    const employee = e.row?.data || e; 
    console.log('Mark as absent - employee object:', employee);

    const employeeName = employee.employeeName || employee.name || 'Unknown';
    const employeeId = employee.employeeId;

    if (!employeeId) {
      notify('Employee ID is missing', 'error', 2000);
      return;
    }

    if (confirm(`Mark ${employeeName} as absent?`)) {
      this.apiService.post(`Employees/${employeeId}/attendance/absent`, {}).subscribe({
        next: (response: any) => {
          notify(response.message || `${employeeName} marked as absent`, 'success', 2000);
          this.refreshCurrentView();
        },
        error: (error) => {
          console.error('Error marking as absent:', error);
          notify(`Error marking as absent: ${error.message || error}`, 'error', 2000);
        }
      });
    }
  }

  private refreshCurrentView() {
    switch (this.viewMode) {
      case 'today':
        this.loadTodayAttendance();
        break;
      case 'all':
        this.loadAllAttendance();
        break;
      case 'absent':
        this.loadAbsentEmployees();
        break;
    }
  }

  onSaveAttendance() {
    if (!this.currentAttendance.employeeId) {
      notify('Please select an employee', 'error', 2000);
      return;
    }

    this.apiService.post(`Employees/${this.currentAttendance.employeeId}/attendance`, {}).subscribe({
      next: (response: any) => {
        notify(response.message || 'Attendance marked successfully', 'success', 2000);
        this.isAttendancePopupOpened = false;
        this.refreshCurrentView();
      },
      error: (error) => {
        notify(`Error marking attendance: ${error.message}`, 'error', 2000);
      }
    });
  }

  onCancelAttendance() {
    this.isAttendancePopupOpened = false;
  }

  formatDateDisplay(dateString: string): string {
    if (!dateString) return 'Never';

    try {
      let date: Date;

      if (dateString.includes('T')) {
        date = new Date(dateString);
      } else {
        const [year, month, day] = dateString.split('-').map(Number);
        date = new Date(year, month - 1, day);
      }

      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('en-GB');
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Invalid Date';
    }
  }

  getStatusClass = (status: string) => {
    switch (status) {
      case 'Present': return 'status-present';
      case 'Absent': return 'status-absent';
      default: return 'status-unknown';
    }
  };

  getEmployeesNotPresentToday(): any[] {
    const presentEmployeeIds = new Set(this.todayAttendance.map(emp => emp.employeeId));
    return this.employees.filter(emp => !presentEmployeeIds.has(emp.employeeId));
  }
}
