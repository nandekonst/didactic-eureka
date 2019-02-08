import { Component, OnInit } from '@angular/core';
import {ScreenlanguageService} from '../../services/screenlanguage.service';
import { FlexLayoutModule } from "@angular/flex-layout";

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private screenlanguageService: ScreenlanguageService) { }

  ngOnInit() {
    let screenlanguage = this.screenlanguageService.getScreenLanguage();
    console.log("NAVBAR screenlang" + screenlanguage)
    this.screenlanguageService.setScreenLanguage(screenlanguage);
  }

}
