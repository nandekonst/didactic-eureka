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
import { ConjugationService } from './services/conjugation.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { HttpService } from './services/http.service';
import {AuthService} from './services/auth.service';
import { ResourceService } from './shared-services/resource.service';
import { GrammarService } from './shared-services/grammar.service';
import { ScreenlanguageService } from './services/screenlanguage.service';
import { FooterComponent } from './footer/footer.component';
import { ConjugatedTranslationsComponent } from './components/conjugated-translations/conjugated-translations.component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';


export const APP_ID = 'my-app';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: APP_ID }),
    AppRoutingModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient] 
      }
    })
  ],
  exports: [ AppRoutingModule ],
  providers: [MergerService, HttpService, AuthService, ResourceService,ConjugationService, GrammarService, ScreenlanguageService ],
  bootstrap: [ AppComponent ],
  declarations: [HomeComponent, NavbarComponent, OverviewPanelComponent, FooterComponent, ConjugatedTranslationsComponent]
})
export class AppModule { }
