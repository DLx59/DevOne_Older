import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './component/main/app.component';
import {AppRoutingModule} from './app-routing.module';
import {NavbarComponent} from './component/navbar/navbar.component';
import { HeroComponent } from './component/hero/hero.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HeroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
