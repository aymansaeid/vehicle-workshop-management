import { Component } from '@angular/core';
import { DrawerComponent } from '../../drawer/drawer.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DrawerComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent { }
