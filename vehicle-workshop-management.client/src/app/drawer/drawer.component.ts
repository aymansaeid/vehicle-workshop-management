import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    DxToolbarModule
  ],
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css'],
})
export class DrawerComponent {
  @ViewChild(DxDrawerComponent, { static: false }) drawer!: DxDrawerComponent;

  navigation = [
    { id: 1, text: 'Dashboard' },
    { id: 2, text: 'Customers' },
    { id: 3, text: 'Vehicles' },
    { id: 4, text: 'Invoices' },
  ];

  text = `<h2>Welcome to Vehicle Management System</h2><p>Select an option from the menu.</p>`;

  showSubmenuModes: DxDrawerTypes.RevealMode[] = ['slide', 'expand'];
  positionModes: DxDrawerTypes.PanelLocation[] = ['left', 'right'];
  showModes: DxDrawerTypes.OpenedStateMode[] = ['push', 'shrink', 'overlap'];

  selectedOpenMode: DxDrawerTypes.OpenedStateMode = 'shrink';
  selectedPosition: DxDrawerTypes.PanelLocation = 'left';
  selectedRevealMode: DxDrawerTypes.RevealMode = 'slide';

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
}
