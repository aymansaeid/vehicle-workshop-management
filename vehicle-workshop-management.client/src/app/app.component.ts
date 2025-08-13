import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  username = 'John Doe';
  count = 0;

  increaseCount() {
    this.count++;
  }
}
