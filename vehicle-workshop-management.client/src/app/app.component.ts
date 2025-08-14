import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerComponent } from './drawer/drawer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DrawerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular Drawer Test';
}
