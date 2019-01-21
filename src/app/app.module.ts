import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CustomMaterialModule } from './material';
import { NavbarComponent } from './components/navbar/navbar.component';
import { OverviewPanelComponent } from './components/overview-panel/overview-panel.component';
import { MergerService } from './services/merger.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { HttpService } from './services/http.service';
import {AuthService} from './services/auth.service';
import { ResourceService } from './shared-services/resource.service';
import { FooterComponent } from './footer/footer.component';

export const APP_ID = 'my-app';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: APP_ID }),
    AppRoutingModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    HttpModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [ AppRoutingModule ],
  providers: [MergerService, HttpService, AuthService, ResourceService ],
  bootstrap: [ AppComponent ],
  declarations: [HomeComponent, NavbarComponent, OverviewPanelComponent, FooterComponent]
})
export class AppModule { }
