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
  // Employees data
  employees: any[] = [];

  // Attendance data
  attendanceData: any[] = [];
  todayAttendance: any[] = [];
  absentEmployees: any[] = [];
  allAttendanceData: any = {};

  // Popup controls
  isAttendancePopupOpened = false;
  selectedDate: Date = new Date();

  // Current attendance record
  currentAttendance: any = {
    employeeId: null
  };

  // View mode
  viewMode: 'today' | 'all' | 'absent' = 'today';

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadEmployees();
    this.loadTodayAttendance();
  }

  // Load all employees
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

  // Load today's attendance
  loadTodayAttendance() {
    this.apiService.get('Employees/attendance/today').subscribe({
      next: (data: any) => {
        this.todayAttendance = data.map((emp: any) => ({
          ...emp,
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

  // Load all attendance records
  loadAllAttendance() {
    this.apiService.get('Employees/attendance').subscribe({
      next: (data: any) => {
        this.allAttendanceData = data;
        this.attendanceData = data.employees.map((emp: any) => ({
          ...emp,
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

  // Load absent employees
  loadAbsentEmployees() {
    this.apiService.get('Employees/attendance/absent').subscribe({
      next: (data: any) => {
        this.absentEmployees = data.map((emp: any) => ({
          ...emp,
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

  // Mark attendance for employee
  markAttendance() {
    this.currentAttendance = {
      employeeId: null
    };
    this.isAttendancePopupOpened = true;
  }

  // Mark employee as present
  markAsPresent(employee: any) {
    if (confirm(`Mark ${employee.name} as present?`)) {
      this.apiService.post(`Employees/${employee.employeeId}/attendance`, {}).subscribe({
        next: (response: any) => {
          notify(response.message || `${employee.name} marked as present`, 'success', 2000);
          this.loadTodayAttendance();
          this.loadAbsentEmployees();
        },
        error: (error) => {
          notify(`Error marking as present: ${error.message}`, 'error', 2000);
        }
      });
    }
  }

  // Mark employee as absent (set LastPresentDate to null)
  markAsAbsent(employee: any) {
    /*
    if (confirm(`Mark ${employee.name} as absent? This will clear their last present date.`)) {
      // First get the current employee data
      this.apiService.get(`Employees/${employee.employeeId}`).subscribe({
        next: (employeeData: any) => {
          // Update the employee with null LastPresentDate
          const updateData = {
            ...employeeData,
            lastPresentDate: null
          };

          this.apiService.put(`Employees/${employeeData.employeeId}`, updateData).subscribe({
            next: () => {
              notify(`${employee.name} marked as absent`, 'success', 2000);
              this.loadTodayAttendance();
              this.loadAbsentEmployees();
              this.loadAllAttendance();
            },
            error: (error) => {
              notify(`Error marking as absent: ${error.message}`, 'error', 2000);
            }
          });
        },
        error: (error) => {
          notify(`Error loading employee data: ${error.message}`, 'error', 2000);
        }
      });
    }
    */
  }

  // Save attendance record
  onSaveAttendance() {
    if (!this.currentAttendance.employeeId) {
      notify('Please select an employee', 'error', 2000);
      return;
    }

    this.apiService.post(`Employees/${this.currentAttendance.employeeId}/attendance`, {}).subscribe({
      next: (response: any) => {
        notify(response.message || 'Attendance marked successfully', 'success', 2000);
        this.isAttendancePopupOpened = false;
        this.loadTodayAttendance();
        this.loadAbsentEmployees();
      },
      error: (error) => {
        notify(`Error marking attendance: ${error.message}`, 'error', 2000);
      }
    });
  }

  // Cancel attendance recording
  onCancelAttendance() {
    this.isAttendancePopupOpened = false;
  }

  // Utility methods
  formatDateDisplay(dateString: string): string {
    if (!dateString) return 'Never';

    try {
      // Handle different date formats from backend
      let date: Date;

      if (dateString.includes('T')) {
        // ISO format with time
        date = new Date(dateString);
      } else {
        // Date-only format (YYYY-MM-DD)
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

  // Get employees not present today
  getEmployeesNotPresentToday(): any[] {
    const presentEmployeeIds = new Set(this.todayAttendance.map(emp => emp.employeeId));
    return this.employees.filter(emp => !presentEmployeeIds.has(emp.employeeId));
  }
}
