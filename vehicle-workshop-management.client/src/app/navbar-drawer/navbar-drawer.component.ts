import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar-drawer',
  templateUrl: './navbar-drawer.component.html',
  styleUrls: ['./navbar-drawer.component.css']
})
export class NavbarDrawerComponent {
  drawerOpen = false;
  menuItems = ['Home', 'About', 'Contact'];

  toggleDrawer() {
    this.drawerOpen = !this.drawerOpen;
  }
}
