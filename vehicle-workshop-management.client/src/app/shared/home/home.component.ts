import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../app/api/api';
import { DxChartModule, DxPieChartModule, DxDataGridModule, DxButtonModule } from 'devextreme-angular';
import { RouterModule } from '@angular/router';

interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  totalEmployees: number;
  employeesAttendedToday: number;
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  unfinishedTasks: number;
  overdueTasks: number;
  totalInventoryItems: number;
  availableInventoryItems: number;
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
  pendingInvoices: number;
  totalRevenue: number;
  monthlyRevenue: number;
  outstandingAmount: number;
}

interface FinancialSummary {
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  totalOutstanding: number;
  overdueAmount: number;
}

interface OverdueTask {
  taskID: number;
  name: string;
  description: string;
  endTime: Date;
  status: string;
  daysOverdue: number;
}

interface UnpaidInvoice {
  invoiceID: number;
  dateIssued: Date;
  dueDate: Date;
  totalAmount: number;
  status: string;
  daysOverdue: number;
}

interface RecentActivity {
  newCustomersThisWeek: number;
  completedTasksThisWeek: number;
  invoicesIssuedThisWeek: number;
  revenueThisWeek: number;
}

interface EmployeePerformance {
  employeeID: number;
  name: string;
  type: string;
  status: string;
  tasksCompletedThisMonth: number;
  lastLoginDate: Date | null;
  lastPresentDate: Date | null;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    DxChartModule,
    DxPieChartModule,
    DxDataGridModule,
    DxButtonModule,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // Data properties
  stats: DashboardStats | null = null;
  financialSummary: FinancialSummary | null = null;
  overdueTasks: OverdueTask[] = [];
  unpaidInvoices: UnpaidInvoice[] = [];
  recentActivity: RecentActivity | null = null;
  employeePerformance: EmployeePerformance[] = [];

  // UI state
  isLoading = false;
  errorMessage = '';

  // Chart data
  invoiceStatusData: any[] = [];
  revenueComparisonData: any[] = [];
  taskStatusData: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Load all dashboard data in parallel
    Promise.all([
      this.loadStats(),
      this.loadFinancialSummary(),
      this.loadOverdueTasks(),
      this.loadUnpaidInvoices(),
      this.loadRecentActivity(),
      this.loadEmployeePerformance()
    ]).finally(() => {
      this.isLoading = false;
    });
  }

  private loadStats(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.get('dashboard/stats').subscribe({
        next: (data: any) => {
          this.stats = data;
          this.prepareChartData();
          resolve();
        },
        error: (error) => {
          console.error('Error loading stats:', error);
          this.errorMessage = 'Failed to load dashboard statistics';
          reject(error);
        }
      });
    });
  }

  private loadFinancialSummary(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.get('dashboard/financial-summary').subscribe({
        next: (data: any) => {
          this.financialSummary = data;
          resolve();
        },
        error: (error) => {
          console.error('Error loading financial summary:', error);
          reject(error);
        }
      });
    });
  }

  private loadOverdueTasks(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.get('dashboard/overdue-tasks').subscribe({
        next: (data: any) => {
          this.overdueTasks = data;
          resolve();
        },
        error: (error) => {
          console.error('Error loading overdue tasks:', error);
          reject(error);
        }
      });
    });
  }

  private loadUnpaidInvoices(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.get('dashboard/unpaid-invoices').subscribe({
        next: (data: any) => {
          this.unpaidInvoices = data;
          resolve();
        },
        error: (error) => {
          console.error('Error loading unpaid invoices:', error);
          reject(error);
        }
      });
    });
  }

  private loadRecentActivity(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.get('dashboard/recent-activity').subscribe({
        next: (data: any) => {
          this.recentActivity = data;
          resolve();
        },
        error: (error) => {
          console.error('Error loading recent activity:', error);
          reject(error);
        }
      });
    });
  }

  private loadEmployeePerformance(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.get('dashboard/employee-performance').subscribe({
        next: (data: any) => {
          this.employeePerformance = data;
          resolve();
        },
        error: (error) => {
          console.error('Error loading employee performance:', error);
          reject(error);
        }
      });
    });
  }

  private prepareChartData(): void {
    if (!this.stats) return;

    this.invoiceStatusData = [
      { status: 'Paid', count: this.stats.paidInvoices },
      { status: 'Unpaid', count: this.stats.unpaidInvoices },
      { status: 'Pending', count: this.stats.pendingInvoices }
    ];

    this.revenueComparisonData = [
      { period: 'Total', amount: this.stats.totalRevenue },
      { period: 'This Month', amount: this.stats.monthlyRevenue }
    ];

    this.taskStatusData = [
      { status: 'Completed', count: this.stats.totalTasks - this.stats.unfinishedTasks },
      { status: 'Unfinished', count: this.stats.unfinishedTasks },
      { status: 'Overdue', count: this.stats.overdueTasks }
    ];
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  getRevenueChangeClass(): string {
    if (!this.financialSummary) return '';

    const change = this.financialSummary.thisMonthRevenue - this.financialSummary.lastMonthRevenue;
    return change >= 0 ? 'positive' : 'negative';
  }

  getRevenueChangeIcon(): string {
    if (!this.financialSummary) return '';

    const change = this.financialSummary.thisMonthRevenue - this.financialSummary.lastMonthRevenue;
    return change >= 0 ? '↑' : '↓';
  }

  getRevenueChangePercent(): string {
    if (!this.financialSummary || this.financialSummary.lastMonthRevenue === 0) return '0%';

    const change = ((this.financialSummary.thisMonthRevenue - this.financialSummary.lastMonthRevenue) /
      this.financialSummary.lastMonthRevenue) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  }
}

