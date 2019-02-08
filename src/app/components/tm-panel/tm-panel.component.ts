import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { OverviewPanelComponent } from '../overview-panel/overview-panel.component';
import { TmService } from '../../services/tm.service';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import { Languages } from '../../interfaces/languages';

export interface ExampleSentence {
  author: string,
  first: string,
  second: string
}


@Component({
  selector: 'tm-panel',
  templateUrl: './tm-panel.component.html',
  styleUrls: ['./tm-panel.component.css']
})
export class TmPanelComponent implements OnInit {
 haveResults: boolean = true;

 @ViewChild(MatPaginator) paginator: MatPaginator;
 @Input() sourceForm: string;
 @Input() targetLang: string;
 @Input() sourceLang: string;
 translations: any[] = [{first: "string", second: "string2"}];
 displayedColumns: string[] = ["first","second"];
 dataSource:MatTableDataSource<ExampleSentence>;
 languages = Languages;



  constructor(private tm: TmService) { }

  ngOnInit() {
    this.loadTranslations();
  }

  clear(){
    this.translations = [];
  }

  loadTranslations(){
    this.clear();
    this.tm.makeTranslation(this.sourceLang, this.targetLang, this.sourceForm).subscribe(
      data => this.handleTranslationSuccess(data),
      error => this.handleTranslationError(error),
      () => ""
    )
  }

  handleTranslationSuccess(data){
    this.translations = data.examples;
    console.log("TRANSLATION" + JSON.stringify(this.translations))
    this.dataSource = new MatTableDataSource<ExampleSentence>(this.translations);
    for(let i = 0; i < this.translations.length; i++) {
      let splittedSentence = this.splitSentence(this.translations[i].first, this.translations[i].source_markers, this.translations[i].source_end_markers);
      this.translations[i].splittedFirstSentence = splittedSentence;

      splittedSentence = this.splitSentence(this.translations[i].second, this.translations[i].target_markers, this.translations[i].target_end_markers);
      this.translations[i].splittedSecondSentence = splittedSentence;
    }
    if(this.translations.length > 0){
      this.haveResults = true;
    } else {
      this.haveResults = false;
    }
  }

  handleTranslationError(error){
    console.log(error);
  }

  splitSentence(sentence: string, markers: number[], endMarkers: number[]): string[] {
    if (markers == undefined) {
      return [ sentence ];
    }

    let splittedSentence: string[] = [];
    let pos = 0;
    for(let j = 0; j < markers.length; j++) {
      splittedSentence.push(sentence.substr(pos, markers[j] - pos));
      splittedSentence.push(sentence.substr(markers[j], endMarkers[j] - markers[j]));
      pos = endMarkers[j];
    }

    splittedSentence.push(sentence.substr(pos, sentence.length));

    return splittedSentence;
  }

  titleOfLanguageName(name:string): string{
    for(let language of this.languages){
      if(language.name == name) {
        return language.title
      }

    }
    
    return undefined;
  }

}
