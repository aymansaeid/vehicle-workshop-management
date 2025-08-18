import { Component } from '@angular/core';
import { DrawerComponent } from '../../../drawer/drawer.component';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [DrawerComponent],
  templateUrl: './vehicle-list.component.html',
  template: `<h2>Vehicle List Works!</h2>`
})
export class VehicleListComponent { }
