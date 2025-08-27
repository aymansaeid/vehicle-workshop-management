import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DxListModule, DxRadioGroupModule, DxToolbarModule } from 'devextreme-angular';
import { DxDrawerModule, DxDrawerComponent, DxDrawerTypes } from 'devextreme-angular/ui/drawer';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [
    CommonModule,
    DxDrawerModule,
    DxListModule,
    DxRadioGroupModule,
    DxToolbarModule,
    RouterModule
  ],
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css'],
})
export class DrawerComponent {
  @ViewChild(DxDrawerComponent, { static: false }) drawer!: DxDrawerComponent;
  selectedOpenMode: DxDrawerTypes.OpenedStateMode = 'shrink';
  selectedPosition: DxDrawerTypes.PanelLocation = 'left';
  selectedRevealMode: DxDrawerTypes.RevealMode = 'slide';
  navigation = [
    { id: 1, text: 'Dashboard', path: '/', icon: 'home' },
    { id: 2, text: 'Customers', path: '/customers', icon: 'user' },
    { id: 3, text: 'Inventory', path: '/Inventory', icon: 'box' },
    { id: 4, text: 'Invoices', path: '/Invoices', icon: 'money' },
    { id: 5, text: 'Tasks', path: '/Tasks', icon: 'tasks' },
    { id: 6, text: 'Projects', path: '/Projects', icon: 'folder' },
    { id: 7, text: 'Employees', path: '/Employees', icon: 'group' }
  ];
  topRightMenuItems = [
    { id: 8, text: 'Attendance', path: '/Attendance', icon: 'event' },
    { id: 9, text: 'Logout', action: 'logout', icon: 'runner' }
  ];

  text = `<h2>Welcome to Vehicle Management System</h2><p>Select an option from the menu.</p>`;

  isDrawerOpen = true;

  toolbarContent = [{
    widget: 'dxButton',
    location: 'before',
    options: {
      icon: 'menu',
      stylingMode: 'text',
      onClick: () => this.isDrawerOpen = !this.isDrawerOpen,
    },
  },
  {
    widget: 'dxButton',
    location: 'after',
    options: {
      icon: 'event',
      text: 'Attendance',
      stylingMode: 'text',
      onClick: () => this.router.navigate(['/Attendance']),
    },
  },
  {
    widget: 'dxButton',
    location: 'after',
    options: {
      icon: 'runner',
      text: 'Logout',
      stylingMode: 'text',
      onClick: () => this.logout(),
    },
  }
  ];

  constructor(private router: Router) { }


  onItemClick(e: any) {
    const item = e.itemData;
    if (item.path) {
      this.router.navigate([item.path]);
      this.isDrawerOpen = false;
    }
  }
  logout() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
      // Add your logout logic here
      console.log('Logging out...');

      // Redirect to login page or perform logout actions
      this.router.navigate(['/login']);
      // You might want to add actual logout logic like:
      // - Clearing localStorage/sessionStorage
      // - Calling your authentication service logout method
      // - Resetting application state
    }
  }
}
