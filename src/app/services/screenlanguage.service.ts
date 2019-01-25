import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ScreenlanguageService {

  browserLang: string;

  constructor(private translate: TranslateService){
      translate.addLangs(['en', 'nl','de','fr','es', 'it']);
      translate.setDefaultLang("en");
      this.browserLang = this.translate.getBrowserLang();
      console.log("BROWSERLANG" + this.browserLang)
  }

  getScreenLanguage(): string {
      return this.browserLang;
  }
}
