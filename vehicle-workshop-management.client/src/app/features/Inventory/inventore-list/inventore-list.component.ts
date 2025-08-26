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
  DxTagBoxModule
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
    DxTagBoxModule,
    DxTextAreaModule,
    DxCheckBoxModule
  ]
})
export class InventoreListComponent implements OnInit {
  // Inventory data
  inventoryItems: any[] = [];
  inventoryGroups: any[] = [];

  // Popup controls
  isInventoryPopupOpened = false;
  isGroupPopupOpened = false;
  isAssignGroupPopupOpened = false;
  isManageGroupsPopupOpened = false;

  // Current items for editing/adding
  currentInventory: any = {
    name: '',
    description: '',
    type: '',
    unit: '',
    price: 0,
    status: 'Available'
  };

  currentGroup: any = {
    name: '',
    description: ''
  };

  currentAssignment: any = {
    inventoryId: null,
    groupId: null
  };

  selectedInventoryForGroups: any = null;
  inventoryGroupsToManage: any[] = [];

  popupTitle = 'Add Inventory Item';
  groupPopupTitle = 'Add Inventory Group';

  // Options
  statusOptions = ['Available', 'OutOfStock', 'Discontinued', 'OnOrder'];
  typeOptions = ['Raw Material', 'Finished Product', 'Component', 'Tool', 'Equipment'];

  // View mode
  activeTab: 'items' | 'groups' = 'items';

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadInventoryItems();
    this.loadInventoryGroups();
  }

  // Load inventory items
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

  // Load inventory groups
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

  // Load groups for a specific inventory item
  loadInventoryGroupsForItem(inventoryId: number) {
    this.apiService.get(`Inventories/${inventoryId}/Groups`).subscribe({
      next: (data: any) => {
        this.inventoryGroupsToManage = data;
      },
      error: (error) => {
        notify(`Error loading inventory groups: ${error.message}`, 'error', 2000);
      }
    });
  }

  // Inventory CRUD Operations
  addInventory() {
    this.currentInventory = {
      name: '',
      description: '',
      type: '',
      unit: '',
      price: 0,
      status: 'Available'
    };
    this.popupTitle = 'Add Inventory Item';
    this.isInventoryPopupOpened = true;
  }

  editInventory = (e: any) => {
    const item = e.row.data;
    this.currentInventory = { ...item };
    this.popupTitle = 'Edit Inventory Item';
    this.isInventoryPopupOpened = true;
  }

  deleteInventory = (e: any) => {
    const itemId = e.row.data.inventoryId;
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
    if (!this.currentInventory.name || !this.currentInventory.name.trim()) {
      notify('Please enter a name for the inventory item', 'error', 2000);
      return;
    }

    if (this.currentInventory.price < 0) {
      notify('Price cannot be negative', 'error', 2000);
      return;
    }

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

  // Group CRUD Operations
  addGroup() {
    this.currentGroup = {
      name: '',
      description: ''
    };
    this.groupPopupTitle = 'Add Inventory Group';
    this.isGroupPopupOpened = true;
  }

  editGroup = (e: any) => {
    const group = e.row.data;
    this.currentGroup = { ...group };
    this.groupPopupTitle = 'Edit Inventory Group';
    this.isGroupPopupOpened = true;
  }

  deleteGroup = (e: any) => {
    const groupId = e.row.data.groupId;
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
    if (!this.currentGroup.name || !this.currentGroup.name.trim()) {
      notify('Please enter a name for the group', 'error', 2000);
      return;
    }

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

  // Group Assignment Operations
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

    this.apiService.post('Inventories/AssignToGroup', this.currentAssignment).subscribe({
      next: () => {
        notify('Inventory item assigned to group successfully', 'success', 2000);
        this.isAssignGroupPopupOpened = false;
        this.loadInventoryItems();
      },
      error: (error) => {
        notify(`Error assigning inventory to group: ${error.message}`, 'error', 2000);
      }
    });
  }

  // Manage Groups for Inventory Item
  openManageGroupsPopup = (e: any) => {
    const item = e.row.data;
    this.selectedInventoryForGroups = item;
    this.loadInventoryGroupsForItem(item.inventoryId);
    this.isManageGroupsPopupOpened = true;
  }

  openAssignFromManage() {
    this.onCancelManageGroups();
    this.currentAssignment.inventoryId = this.selectedInventoryForGroups?.inventoryId;
    this.currentAssignment.groupId = null;
    this.isAssignGroupPopupOpened = true;
  }

  removeFromGroup(inventoryId: number, groupId: number) {
    if (!inventoryId || !groupId) {
      notify('Invalid inventory or group ID', 'error', 2000);
      return;
    }

    if (confirm('Are you sure you want to remove this inventory item from the group?')) {
      this.apiService.delete(`Inventories/${inventoryId}/Groups/${groupId}`).subscribe({
        next: () => {
          notify('Inventory item removed from group successfully', 'success', 2000);
          this.loadInventoryGroupsForItem(inventoryId);
          this.loadInventoryItems();
        },
        error: (error) => {
          notify(`Error removing inventory from group: ${error.message}`, 'error', 2000);
        }
      });
    }
  }

  // Utility methods
  formatCurrency = (value: number) => {
    return value ? `$${value.toFixed(2)}` : '$0.00';
  };

  getStatusClass = (status: string) => {
    switch (status) {
      case 'Available': return 'status-available';
      case 'OutOfStock': return 'status-outofstock';
      case 'Discontinued': return 'status-discontinued';
      case 'OnOrder': return 'status-onorder';
      default: return 'status-unknown';
    }
  };

  // Cancel operations
  onCancelInventory() {
    this.isInventoryPopupOpened = false;
  }

  onCancelGroup() {
    this.isGroupPopupOpened = false;
  }

  onCancelAssignment() {
    this.isAssignGroupPopupOpened = false;
  }

  onCancelManageGroups() {
    this.isManageGroupsPopupOpened = false;
    this.selectedInventoryForGroups = null;
  }
}
