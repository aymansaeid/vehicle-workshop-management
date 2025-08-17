import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Add Router imports
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
    RouterModule // Add RouterModule
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
    { id: 3, text: 'Vehicles', path: '/vehicles' },
    { id: 4, text: 'Invoices', path: '/invoices' },
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

  // Add this method to handle navigation
  onItemClick(e: any) {
    const item = e.itemData;
    if (item.path) {
      this.router.navigate([item.path]);
      this.isDrawerOpen = false; // Optional: close drawer after navigation
    }
  }
}
