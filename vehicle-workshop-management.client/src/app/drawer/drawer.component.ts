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
    { id: 1, text: 'Dashboard', path: '/' },
    { id: 2, text: 'Customers', path: '/customers' },
    { id: 3, text: 'Customers Cars', path: '/Customers-Cars' },
    { id: 4, text: 'Inventory', path: '/Inventory' },
    { id: 5, text: 'Invoices', path: '/Invoices' },
    { id: 6, text: 'Tasks', path: '/Tasks' },
    { id: 7, text: 'Projects', path: '/Projects' },
    { id: 8, text: 'Employees', path: '/Employees' },
    { id: 9, text: 'Attendance', path: '/Attendance' },
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
  }];

  constructor(private router: Router) { }

  
  onItemClick(e: any) {
    const item = e.itemData;
    if (item.path) {
      this.router.navigate([item.path]);
      this.isDrawerOpen = false; 
    }
  }
}
