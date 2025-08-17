import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DrawerComponent } from './drawer/drawer.component';
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { routes } from './app.routes';
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
  providers: [provideRouter(routes, withEnabledBlockingInitialNavigation())],
  bootstrap: [AppComponent]
})
export class AppModule { }
