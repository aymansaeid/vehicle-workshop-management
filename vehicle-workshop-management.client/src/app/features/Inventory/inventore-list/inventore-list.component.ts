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
  DxLoadPanelModule
} from 'devextreme-angular';
import { ApiService } from '../../../api/api';
import notify from "devextreme/ui/notify";
import { DxTextAreaModule, DxCheckBoxModule } from 'devextreme-angular';
@Component({
  selector: 'app-inventore-list',
  templateUrl: './inventore-list.component.html',
  styleUrls: ['./inventore-list.component.css'],
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
    DxTextAreaModule,
    DxCheckBoxModule
  ]
})
export class InventoreListComponent implements OnInit {

  inventoryItems: any[] = [];
  inventoryGroups: any[] = [];

  
  isInventoryPopupOpened = false;
  isGroupPopupOpened = false;
  isAssignGroupPopupOpened = false;

 
  currentInventory: any = {
    name: '',
    description: '',
    type: '',
    price: 0,
    unit: '',
    status: ''
  };

  currentGroup: any = {
    name: '',
    description: ''
  };

  currentAssignment: any = {
    inventoryId: null,
    groupId: null
  };

  popupTitle = 'Add Inventory Item';
  groupPopupTitle = 'Add Inventory Group';


  activeTab: 'items' | 'groups' = 'items';

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadInventoryItems();
    this.loadInventoryGroups();
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


  loadInventoryGroups() {
    this.apiService.get('InventoryGroups').subscribe({
      next: (data: any) => {
        this.inventoryGroups = data;
      },
      error: (error) => {
        notify(`Error loading inventory groups: ${error.message}`, 'error', 2000);
      }
    });
  }


  addInventory() {
    this.currentInventory = {
      name: '',
      description: '',
      type: '',
      unit: '',
      price: 0,
      status: ''
    };
    this.popupTitle = 'Add Inventory Item';
    this.isInventoryPopupOpened = true;
  }

  editInventory(item: any) {
    this.currentInventory = { ...item };
    this.popupTitle = 'Edit Inventory Item';
    this.isInventoryPopupOpened = true;
  }

  deleteInventory(itemId: number) {
    if (confirm('Are you sure you want to delete this inventory item?')) {
      this.apiService.delete('Inventories', itemId).subscribe({
        next: () => {
          notify('Inventory item deleted successfully', 'success', 2000);
          this.loadInventoryItems();
        },
        error: (error) => {
          notify(`Error deleting inventory item: ${error.message}`, 'error', 2000);
        }
      });
    }
  }

  onSaveInventory() {
    const action = this.popupTitle === 'Add Inventory Item'
      ? this.apiService.post('Inventories', this.currentInventory)
      : this.apiService.put('Inventories', this.currentInventory.inventoryId, this.currentInventory);

    action.subscribe({
      next: () => {
        notify(`Inventory item ${this.popupTitle === 'Add Inventory Item' ? 'added' : 'updated'} successfully`, 'success', 2000);
        this.isInventoryPopupOpened = false;
        this.loadInventoryItems();
      },
      error: (error) => {
        notify(`Error ${this.popupTitle === 'Add Inventory Item' ? 'adding' : 'updating'} inventory item: ${error.message}`, 'error', 2000);
      }
    });
  }


  addGroup() {
    this.currentGroup = {
      name: '',
      description: ''
    };
    this.groupPopupTitle = 'Add Inventory Group';
    this.isGroupPopupOpened = true;
  }

  editGroup(group: any) {
    this.currentGroup = { ...group };
    this.groupPopupTitle = 'Edit Inventory Group';
    this.isGroupPopupOpened = true;
  }

  deleteGroup(groupId: number) {
    if (confirm('Are you sure you want to delete this inventory group?')) {
      this.apiService.delete('InventoryGroups', groupId).subscribe({
        next: () => {
          notify('Inventory group deleted successfully', 'success', 2000);
          this.loadInventoryGroups();
        },
        error: (error) => {
          notify(`Error deleting inventory group: ${error.message}`, 'error', 2000);
        }
      });
    }
  }

  onSaveGroup() {
    const action = this.groupPopupTitle === 'Add Inventory Group'
      ? this.apiService.post('InventoryGroups', this.currentGroup)
      : this.apiService.put('InventoryGroups', this.currentGroup.groupId, this.currentGroup);

    action.subscribe({
      next: () => {
        notify(`Inventory group ${this.groupPopupTitle === 'Add Inventory Group' ? 'added' : 'updated'} successfully`, 'success', 2000);
        this.isGroupPopupOpened = false;
        this.loadInventoryGroups();
      },
      error: (error) => {
        notify(`Error ${this.groupPopupTitle === 'Add Inventory Group' ? 'adding' : 'updating'} inventory group: ${error.message}`, 'error', 2000);
      }
    });
  }


  openAssignGroupPopup() {
    this.currentAssignment = {
      inventoryId: null,
      groupId: null
    };
    this.isAssignGroupPopupOpened = true;
  }

  onAssignGroup() {
    if (!this.currentAssignment.inventoryId || !this.currentAssignment.groupId) {
      notify('Please select both inventory item and group', 'error', 2000);
      return;
    }

    const assignmentData = {
      inventoryId: this.currentAssignment.inventoryId,
      groupId: this.currentAssignment.groupId
    };

    this.apiService.post('Inventories/AssignToGroup', assignmentData).subscribe({
      next: () => {
        notify('Inventory item assigned to group successfully', 'success', 2000);
        this.isAssignGroupPopupOpened = false;
      },
      error: (error) => {
        notify(`Error assigning inventory to group: ${error.message}`, 'error', 2000);
      }
    });
  }


  formatCurrency = (value: number) => {
    return value ? `$${value.toFixed(2)}` : '$0.00';
  };

  getStockLevelClass = (quantity: number, minStockLevel: number) => {
    if (quantity === 0) return 'stock-out';
    if (quantity <= minStockLevel) return 'stock-low';
    return 'stock-ok';
  };


  onCancelInventory() {
    this.isInventoryPopupOpened = false;
  }

  onCancelGroup() {
    this.isGroupPopupOpened = false;
  }

  onCancelAssignment() {
    this.isAssignGroupPopupOpened = false;
  }
}
