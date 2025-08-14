import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css']
})
export class DrawerComponent {
  isOpen = false;
  menuItems = ['Home', 'About', 'Services', 'Contact'];

  toggleDrawer() {
    this.isOpen = !this.isOpen;
  }
}
