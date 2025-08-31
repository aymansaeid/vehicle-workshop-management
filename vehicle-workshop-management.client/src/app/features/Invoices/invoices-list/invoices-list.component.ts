import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DxDataGridModule,
  DxButtonModule,
  DxSelectBoxModule,
  DxPopupModule,
  DxTextBoxModule,
  DxNumberBoxModule,
  DxValidatorModule,
  DxFormModule,
  DxLoadPanelModule,
  DxDateBoxModule,
  DxTextAreaModule,
  DxCheckBoxModule
} from 'devextreme-angular';
import { ApiService } from '../../../api/api';
import notify from "devextreme/ui/notify";

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrl: './invoices-list.component.css',
  standalone: true,
  imports: [
    CommonModule,
    DxDataGridModule,
    DxButtonModule,
    DxSelectBoxModule,
    DxPopupModule,
    DxTextBoxModule,
    DxNumberBoxModule,
    DxValidatorModule,
    DxFormModule,
    DxLoadPanelModule,
    DxDateBoxModule,
    DxCheckBoxModule,
    DxTextAreaModule
  ]
})
export class InvoicesListComponent implements OnInit {
  // Data arrays
  invoices: any[] = [];
  customers: any[] = [];
  invoiceLines: any[] = [];
  taskLines: any[] = [];
  inventoryItems: any[] = [];

  // Popup state management
  isInvoicePopupOpened = false;
  isLinePopupOpened = false;
  isInvoiceDetailPopupOpened = false;
  isLoading = false;

  // Current items for editing/adding
  currentInvoice: any = this.getDefaultInvoice();
  currentLine: any = this.getDefaultLine();
  selectedInvoice: any = null;

  // UI state
  popupTitle = 'Add Invoice';
  linePopupTitle = 'Add Invoice Line';
  isEditMode = false;
  isLineEditMode = false;

  // Status options - simplified to match requirements
  statusOptions = ['Paid', 'Unpaid', 'Cancelled'];

  // Summary data
  invoiceSummary = {
    total: 0,
    paid: 0,
    unpaid: 0,
    overdue: 0,
    totalAmount: 0
  };

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadAllData();
  }

  // Default object factories
  private getDefaultInvoice() {
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30); // 30 days from now

    return {
      invoiceId: 0,
      dateIssued: today,
      dueDate: dueDate,
      totalAmount: 0,
      status: 'Unpaid',
      notes: '',
      customerId: null,
      customerName: ''
    };
  }

  private getDefaultLine() {
    return {
      lineId: 0,
      taskLineId: null,
      inventoryId: null,
      description: '',
      quantity: 1,
      unitPrice: 0,
      lineTotal: 0
    };
  }

  // Load all required data
  private loadAllData() {
    this.isLoading = true;
    Promise.all([
      this.loadInvoices(),
      this.loadCustomers(),
      this.loadTaskLines(),
      this.loadInventoryItems()
    ]).finally(() => {
      this.isLoading = false;
      this.calculateSummary();
    });
  }

  // Load data methods with proper error handling
  private loadInvoices(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.get('Invoices').subscribe({
        next: (data: any[]) => {
          console.log('Loaded invoices:', data);
          // Calculate status for each invoice based on due date and current status
          this.invoices = (data || []).map(invoice => {
            return {
              ...invoice,
              // Determine if invoice is overdue
              status: this.calculateInvoiceStatus(invoice)
            };
          });
          resolve();
        },
        error: (error) => {
          console.error('Error loading invoices:', error);
          notify(`Error loading invoices: ${error.message}`, 'error', 3000);
          this.invoices = [];
          reject(error);
        }
      });
    });
  }

  // Calculate the correct status for an invoice
  private calculateInvoiceStatus(invoice: any): string {
    // If explicitly cancelled, return cancelled
    if (invoice.status === 'Cancelled') {
      return 'Cancelled';
    }

    // If paid, return paid
    if (invoice.status === 'Paid') {
      return 'Paid';
    }

    // Check if overdue
    if (invoice.dueDate) {
      const dueDate = new Date(invoice.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time part for accurate comparison

      if (dueDate < today) {
        return 'Overdue';
      }
    }

    // Default to unpaid
    return 'Unpaid';
  }

  private loadCustomers(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.get('Customers').subscribe({
        next: (data: any[]) => {
          this.customers = data || [];
          resolve();
        },
        error: (error) => {
          console.error('Error loading customers:', error);
          notify(`Error loading customers: ${error.message}`, 'error', 3000);
          this.customers = [];
          reject(error);
        }
      });
    });
  }

  private loadTaskLines(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.get('TaskLines').subscribe({
        next: (data: any[]) => {
          this.taskLines = data || [];
          resolve();
        },
        error: (error) => {
          console.error('Error loading task lines:', error);
          notify(`Error loading task lines: ${error.message}`, 'error', 3000);
          this.taskLines = [];
          reject(error);
        }
      });
    });
  }

  private loadInventoryItems(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.get('Inventories').subscribe({
        next: (data: any[]) => {
          this.inventoryItems = data || [];
          resolve();
        },
        error: (error) => {
          console.error('Error loading inventory items:', error);
          notify(`Error loading inventory items: ${error.message}`, 'error', 3000);
          this.inventoryItems = [];
          reject(error);
        }
      });
    });
  }

  private loadInvoiceLines(invoiceId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.get(`Invoices/${invoiceId}/lines`).subscribe({
        next: (data: any[]) => {
          this.invoiceLines = data || [];
          resolve();
        },
        error: (error) => {
          // Check if the error is a 404 (Not Found)
          if (error.status === 404) {

            this.invoiceLines = [];
            resolve(); 
          } else {
           
            console.error('Error loading invoice lines:', error);
            notify(`Error loading invoice lines: ${error.message}`, 'error', 3000);
            this.invoiceLines = [];
            reject(error); // Reject for other errors
          }
        }
      });
    });
  }

  // Calculate summary statistics
  private calculateSummary() {
    this.invoiceSummary = {
      total: this.invoices.length,
      paid: this.invoices.filter(i => i.status === 'Paid').length,
      unpaid: this.invoices.filter(i => i.status === 'Unpaid').length,
      overdue: this.invoices.filter(i => i.status === 'Overdue').length,
      totalAmount: this.invoices.reduce((sum, i) => sum + (i.totalAmount || 0), 0)
    };
  }

  // Invoice CRUD Operations
  addInvoice() {
    this.currentInvoice = this.getDefaultInvoice();
    this.popupTitle = 'Add Invoice';
    this.isEditMode = false;
    this.isInvoicePopupOpened = true;
  }

  editInvoice = (e: any) => {
    const invoice = e.row?.data || e;
    if (!invoice) return;

    this.currentInvoice = {
      ...invoice,
      dateIssued: invoice.dateIssued ? new Date(invoice.dateIssued) : new Date(),
      dueDate: invoice.dueDate ? new Date(invoice.dueDate) : new Date()
    };
    this.popupTitle = 'Edit Invoice';
    this.isEditMode = true;
    this.isInvoicePopupOpened = true;
  };

  deleteInvoice = (e: any) => {
    const invoice = e.row?.data || e;
    if (!invoice || !invoice.invoiceId) return;

    const result = confirm(`Are you sure you want to delete Invoice #${invoice.invoiceId}?`);
    if (!result) return;

    this.apiService.delete('Invoices', invoice.invoiceId).subscribe({
      next: () => {
        notify('Invoice deleted successfully', 'success', 2000);
        this.loadInvoices().then(() => this.calculateSummary());
      },
      error: (error) => {
        console.error('Error deleting invoice:', error);
        notify(`Error deleting invoice: ${error.message}`, 'error', 3000);
      }
    });
  };

  onSaveInvoice() {
    if (!this.validateInvoice()) return;

    // Prepare invoice data for API
    const invoiceData: any = {
      dateIssued: this.formatDateForAPI(this.currentInvoice.dateIssued),
      dueDate: this.formatDateForAPI(this.currentInvoice.dueDate),
      totalAmount: Number(this.currentInvoice.totalAmount) || 0,
      status: this.currentInvoice.status,
      notes: this.currentInvoice.notes || '',
      customerId: Number(this.currentInvoice.customerId)
    };

    // Add invoiceId for updates
    if (this.isEditMode && this.currentInvoice.invoiceId) {
      invoiceData.invoiceId = this.currentInvoice.invoiceId;
    }

    console.log('Saving invoice data:', invoiceData);

    const action = this.isEditMode
      ? this.apiService.put('Invoices', this.currentInvoice.invoiceId, invoiceData)
      : this.apiService.post('Invoices', invoiceData);

    action.subscribe({
      next: (response: any) => {
        const actionText = this.isEditMode ? 'updated' : 'created';
        notify(`Invoice ${actionText} successfully`, 'success', 2000);
        this.isInvoicePopupOpened = false;
        this.loadInvoices().then(() => this.calculateSummary());
      },
      error: (error) => {
        console.error('Error saving invoice:', error);
        const actionText = this.isEditMode ? 'updating' : 'creating';
        notify(`Error ${actionText} invoice: ${error.message}`, 'error', 3000);
      }
    });
  }

  private formatDateForAPI(date: any): string {
    if (!date) return new Date().toISOString().split('T')[0];

    if (typeof date === 'string') {
      return new Date(date).toISOString().split('T')[0];
    }

    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }

    return new Date().toISOString().split('T')[0];
  }

  private validateInvoice(): boolean {
    if (!this.currentInvoice.customerId) {
      notify('Please select a customer', 'warning', 2000);
      return false;
    }
    if (!this.currentInvoice.dateIssued) {
      notify('Please select a date issued', 'warning', 2000);
      return false;
    }
    if (!this.currentInvoice.dueDate) {
      notify('Please select a due date', 'warning', 2000);
      return false;
    }
    return true;
  }

  // Invoice Detail Operations
  viewInvoiceDetails = (e: any) => {
    const invoice = e.row?.data || e;
    if (!invoice) return;

    this.selectedInvoice = invoice;
    this.loadInvoiceLines(invoice.invoiceId).then(() => {
      this.isInvoiceDetailPopupOpened = true;
    });
  };

  // Invoice Line CRUD Operations
  addInvoiceLine() {
    if (!this.selectedInvoice) return;

    this.currentLine = {
      ...this.getDefaultLine(),
      invoiceId: this.selectedInvoice.invoiceId
    };
    this.linePopupTitle = 'Add Invoice Line';
    this.isLineEditMode = false;
    this.isLinePopupOpened = true;
  }

  editInvoiceLine = (e: any) => {
    const line = e.row?.data || e;
    if (!line) return;

    this.currentLine = { ...line };
    this.linePopupTitle = 'Edit Invoice Line';
    this.isLineEditMode = true;
    this.isLinePopupOpened = true;
  };

  deleteInvoiceLine = (e: any) => {
    const line = e.row?.data || e;
    if (!line || !line.lineId) return;

    const result = confirm('Are you sure you want to delete this invoice line?');
    if (!result) return;

    this.apiService.delete('InvoiceLines', line.lineId).subscribe({
      next: () => {
        notify('Invoice line deleted successfully', 'success', 2000);
        if (this.selectedInvoice) {
          this.loadInvoiceLines(this.selectedInvoice.invoiceId);
          this.loadInvoices().then(() => this.calculateSummary()); // Refresh to update totals
        }
      },
      error: (error) => {
        console.error('Error deleting invoice line:', error);
        notify(`Error deleting invoice line: ${error.message}`, 'error', 3000);
      }
    });
  };

  onSaveLine() {
    if (!this.validateLine()) return;

    // Prepare line data for API
    const lineData: any = {
      taskLineId: this.currentLine.taskLineId || null,
      inventoryId: this.currentLine.inventoryId || null,
      description: this.currentLine.description,
      quantity: Number(this.currentLine.quantity),
      unitPrice: Number(this.currentLine.unitPrice),
      lineTotal: Number(this.currentLine.lineTotal)
    };

    // Add lineId for updates, invoiceId for creates
    if (this.isLineEditMode && this.currentLine.lineId) {
      lineData.lineId = this.currentLine.lineId;
    } else if (this.selectedInvoice) {
      // For new lines, we need to associate with the invoice
      lineData.invoiceId = this.selectedInvoice.invoiceId;
    }

    console.log('Saving line data:', lineData);

    const action = this.isLineEditMode
      ? this.apiService.put('InvoiceLines', this.currentLine.lineId, lineData)
      : this.apiService.post('InvoiceLines', lineData);

    action.subscribe({
      next: (response: any) => {
        const actionText = this.isLineEditMode ? 'updated' : 'added';
        notify(`Invoice line ${actionText} successfully`, 'success', 2000);
        this.isLinePopupOpened = false;

        if (this.selectedInvoice) {
          this.loadInvoiceLines(this.selectedInvoice.invoiceId);
          this.loadInvoices().then(() => this.calculateSummary()); // Refresh to update totals
        }
      },
      error: (error) => {
        console.error('Error saving invoice line:', error);
        const actionText = this.isLineEditMode ? 'updating' : 'adding';
        notify(`Error ${actionText} invoice line: ${error.message}`, 'error', 3000);
      }
    });
  }

  private validateLine(): boolean {
    if (!this.currentLine.description?.trim()) {
      notify('Please enter a description', 'warning', 2000);
      return false;
    }
    if (!this.currentLine.quantity || this.currentLine.quantity <= 0) {
      notify('Please enter a valid quantity', 'warning', 2000);
      return false;
    }
    if (this.currentLine.unitPrice < 0) {
      notify('Unit price cannot be negative', 'warning', 2000);
      return false;
    }
    return true;
  }

  // Generate PDF
  generatePDF = (e: any) => {
    const invoice = e.row?.data || e;
    if (!invoice || !invoice.invoiceId) return;

    notify('PDF generation functionality would be implemented here', 'info', 2000);

    /*
    this.apiService.get(`Invoices/${invoice.invoiceId}/pdf`, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_${invoice.invoiceId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        notify('PDF generated successfully', 'success', 2000);
      },
      error: (error) => {
        console.error('Error generating PDF:', error);
        notify(`Error generating PDF: ${error.message}`, 'error', 3000);
      }
    });
    */
  };

  // Calculations
  calculateLineTotal() {
    const quantity = Number(this.currentLine.quantity) || 0;
    const unitPrice = Number(this.currentLine.unitPrice) || 0;
    this.currentLine.lineTotal = quantity * unitPrice;
  }

  onTaskLineChanged(taskLineId: any) {
    if (taskLineId) {
      const taskLine = this.taskLines.find(tl => tl.taskLineId === taskLineId);
      if (taskLine) {
        this.currentLine.description = taskLine.description || '';
        this.currentLine.unitPrice = taskLine.rate || taskLine.unitPrice || 0;
        this.currentLine.inventoryId = null; // Clear inventory selection
        this.calculateLineTotal();
      }
    }
  }

  onInventoryItemChanged(inventoryId: any) {
    if (inventoryId) {
      const inventoryItem = this.inventoryItems.find(item => item.inventoryId === inventoryId);
      if (inventoryItem) {
        this.currentLine.description = inventoryItem.name || inventoryItem.description || '';
        this.currentLine.unitPrice = inventoryItem.price || inventoryItem.unitPrice || 0;
        this.currentLine.taskLineId = null; // Clear task line selection
        this.calculateLineTotal();
      }
    }
  }

  // Utility methods
  formatCurrency = (value: number): string => {
    if (value === null || value === undefined) return '$0.00';
    return `$${Number(value).toFixed(2)}`;
  };

  formatDate = (date: string | Date): string => {
    if (!date) return '';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return '';
      return dateObj.toLocaleDateString('en-GB');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  getStatusClass = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'status-paid';
      case 'unpaid': return 'status-unpaid';
      case 'overdue': return 'status-overdue';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-unknown';
    }
  };

  getCustomerName = (customerId: number): string => {
    const customer = this.customers.find(c => c.customerId === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  // This method is used for the grid display when customerName is already included in the invoice data
  getCustomerDisplayName = (invoice: any): string => {
    return invoice.customerName || this.getCustomerName(invoice.customerId);
  };

  // Cancel operations
  onCancelInvoice() {
    this.isInvoicePopupOpened = false;
    this.currentInvoice = this.getDefaultInvoice();
  }

  onCancelLine() {
    this.isLinePopupOpened = false;
    this.currentLine = this.getDefaultLine();
  }

  onCancelInvoiceDetail() {
    this.isInvoiceDetailPopupOpened = false;
    this.selectedInvoice = null;
    this.invoiceLines = [];
  }

  // Refresh data
  refreshData() {
    this.loadAllData();
  }
}
