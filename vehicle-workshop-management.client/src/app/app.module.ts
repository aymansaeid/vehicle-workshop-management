import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DrawerComponent } from './drawer/drawer.component';

@NgModule({
  declarations: [
    AppComponent,
    DrawerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    DrawerComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
