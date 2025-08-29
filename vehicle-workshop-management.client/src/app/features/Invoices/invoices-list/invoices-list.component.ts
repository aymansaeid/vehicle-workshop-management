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
  DxDateBoxModule
} from 'devextreme-angular';
import { ApiService } from '../../../api/api';
import notify from "devextreme/ui/notify";
import { DxTextAreaModule, DxCheckBoxModule } from 'devextreme-angular';

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
  // Invoices data
  invoices: any[] = [];
  customers: any[] = [];
  invoiceLines: any[] = [];
  taskLines: any[] = [];
  inventoryItems: any[] = [];

  // Popup controls
  isInvoicePopupOpened = false;
  isLinePopupOpened = false;
  isLinesViewPopupOpened = false;

  // Current items for editing/adding
  currentInvoice: any = {
    dateIssued: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    totalAmount: 0,
    status: 'Draft',
    notes: '',
    customerId: null
  };

  currentLine: any = {
    taskLineId: null,
    inventoryId: null,
    description: '',
    quantity: 1,
    unitPrice: 0,
    lineTotal: 0
  };

  selectedInvoice: any = null;

  popupTitle = 'Add Invoice';
  linePopupTitle = 'Add Invoice Line';

  // Options
  statusOptions = ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadInvoices();
    this.loadCustomers();
    this.loadTaskLines();
    this.loadInventoryItems();
  }

  // Load data methods
  loadInvoices() {
    this.apiService.get('Invoices').subscribe({
      next: (data: any) => {
        this.invoices = data;
      },
      error: (error) => {
        notify(`Error loading invoices: ${error.message}`, 'error', 2000);
      }
    });
  }

  loadCustomers() {
    this.apiService.get('Customers').subscribe({
      next: (data: any) => {
        this.customers = data;
      },
      error: (error) => {
        notify(`Error loading customers: ${error.message}`, 'error', 2000);
      }
    });
  }

  loadTaskLines() {
    this.apiService.get('TaskLines').subscribe({
      next: (data: any) => {
        this.taskLines = data;
      },
      error: (error) => {
        notify(`Error loading task lines: ${error.message}`, 'error', 2000);
      }
    });
  }

  loadInventoryItems() {
    this.apiService.get('Inventories').subscribe({
      next: (data: any) => {
        this.inventoryItems = data;
      },
      error: (error) => {
        notify(`Error loading inventory items: ${error.message}`, 'error', 2000);
      }
    });
  }

  loadInvoiceLines(invoiceId: number) {
    this.apiService.get(`Invoices/${invoiceId}/lines`).subscribe({
      next: (data: any) => {
        this.invoiceLines = data;
      },
      error: (error) => {
        notify(`Error loading invoice lines: ${error.message}`, 'error', 2000);
      }
    });
  }

  // Invoice CRUD Operations
  addInvoice() {
    this.currentInvoice = {
      dateIssued: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      totalAmount: 0,
      status: 'Draft',
      notes: '',
      customerId: null
    };
    this.popupTitle = 'Add Invoice';
    this.isInvoicePopupOpened = true;
  }

  editInvoice(invoice: any) {
    this.currentInvoice = { ...invoice };
    this.popupTitle = 'Edit Invoice';
    this.isInvoicePopupOpened = true;
  }

  deleteInvoice(invoiceId: number) {
    if (confirm('Are you sure you want to delete this invoice?')) {
      this.apiService.delete('Invoices', invoiceId).subscribe({
        next: () => {
          notify('Invoice deleted successfully', 'success', 2000);
          this.loadInvoices();
        },
        error: (error) => {
          notify(`Error deleting invoice: ${error.message}`, 'error', 2000);
        }
      });
    }
  }

  onSaveInvoice() {
    const action = this.popupTitle === 'Add Invoice'
      ? this.apiService.post('Invoices', this.currentInvoice)
      : this.apiService.put('Invoices', this.currentInvoice.invoiceId, this.currentInvoice);

    action.subscribe({
      next: () => {
        notify(`Invoice ${this.popupTitle === 'Add Invoice' ? 'created' : 'updated'} successfully`, 'success', 2000);
        this.isInvoicePopupOpened = false;
        this.loadInvoices();
      },
      error: (error) => {
        notify(`Error ${this.popupTitle === 'Add Invoice' ? 'creating' : 'updating'} invoice: ${error.message}`, 'error', 2000);
      }
    });
  }

  // Invoice Line Operations
  addInvoiceLine(invoice: any) {
    this.selectedInvoice = invoice;
    this.currentLine = {
      taskLineId: null,
      inventoryId: null,
      description: '',
      quantity: 1,
      unitPrice: 0,
      lineTotal: 0
    };
    this.linePopupTitle = 'Add Invoice Line';
    this.isLinePopupOpened = true;
  }

  editInvoiceLine(line: any) {
    this.currentLine = { ...line };
    this.linePopupTitle = 'Edit Invoice Line';
    this.isLinePopupOpened = true;
  }

  deleteInvoiceLine(lineId: number) {
    if (confirm('Are you sure you want to delete this invoice line?')) {
      this.apiService.delete('InvoiceLines', lineId).subscribe({
        next: () => {
          notify('Invoice line deleted successfully', 'success', 2000);
          this.loadInvoiceLines(this.selectedInvoice.invoiceId);
        },
        error: (error) => {
          notify(`Error deleting invoice line: ${error.message}`, 'error', 2000);
        }
      });
    }
  }

  onSaveLine() {
    if (!this.selectedInvoice) return;

    const action = this.linePopupTitle === 'Add Invoice Line'
      ? this.apiService.post('InvoiceLines', {
        ...this.currentLine,
        invoiceId: this.selectedInvoice.invoiceId
      })
      : this.apiService.put('InvoiceLines', this.currentLine.lineId, this.currentLine);

    action.subscribe({
      next: () => {
        notify(`Invoice line ${this.linePopupTitle === 'Add Invoice Line' ? 'added' : 'updated'} successfully`, 'success', 2000);
        this.isLinePopupOpened = false;
        this.loadInvoiceLines(this.selectedInvoice.invoiceId);
        this.loadInvoices(); // Refresh invoices to update totals
      },
      error: (error) => {
        notify(`Error ${this.linePopupTitle === 'Add Invoice Line' ? 'adding' : 'updating'} invoice line: ${error.message}`, 'error', 2000);
      }
    });
  }

  // View invoice lines
  viewInvoiceLines(invoice: any) {
    this.selectedInvoice = invoice;
    this.loadInvoiceLines(invoice.invoiceId);
    this.isLinesViewPopupOpened = true;
  }

  // Generate PDF
  generatePDF(invoiceId: number) {
    /*
    this.apiService.get(`Invoices/${invoiceId}/pdf`, { responseType: 'blob' , e }).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoiceId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        notify('PDF generated successfully', 'success', 2000);
      },
      error: (error) => {
        notify(`Error generating PDF: ${error.message}`, 'error', 2000);
      }
    });
    */ 
  }

  // Calculate line total
  calculateLineTotal() {
    if (this.currentLine.quantity && this.currentLine.unitPrice) {
      this.currentLine.lineTotal = this.currentLine.quantity * this.currentLine.unitPrice;
    }
  }

  // Utility methods
  formatCurrency = (value: number) => {
    return value ? `$${value.toFixed(2)}` : '$0.00';
  };

  formatDate = (date: string) => {
    return date ? new Date(date).toLocaleDateString('en-GB') : '';
  };

  getStatusClass = (status: string) => {
    switch (status) {
      case 'Paid': return 'status-paid';
      case 'Sent': return 'status-sent';
      case 'Draft': return 'status-draft';
      case 'Overdue': return 'status-overdue';
      case 'Cancelled': return 'status-cancelled';
      default: return 'status-unknown';
    }
  };

  // Cancel operations
  onCancelInvoice() {
    this.isInvoicePopupOpened = false;
  }

  onCancelLine() {
    this.isLinePopupOpened = false;
  }

  onCancelLinesView() {
    this.isLinesViewPopupOpened = false;
    this.selectedInvoice = null;
  }
}
