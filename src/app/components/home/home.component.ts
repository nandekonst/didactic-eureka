import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import {NavbarComponent} from '../navbar/navbar.component';
import {OverviewPanelComponent} from '../overview-panel/overview-panel.component';
import { Languages } from '../../interfaces/languages';
import { MergerService } from '../../services/merger.service';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { TimerObservable } from 'rxjs/Observable/TimerObservable';
import {SearchLemmas} from '../../interfaces/searchlemmas';
import {Login} from '../../classes/login';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import { ResourceService } from '../../shared-services/resource.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  sourceLang: string;
  targetLang: string;
  languages = Languages;
  switchLemma: string  = "";
  surroundingsValue: string;
  caseSensitive: boolean = false;
  diacriticSensitive: boolean = false;
  autocompleteInput: string;
  autocompleteTimerSubscription: Subscription = null;
  forms: any[];
  searchlemmas: SearchLemmas;
  login: Login;
  @ViewChild(MatAutocompleteTrigger) matAutocompleteTrigger: MatAutocompleteTrigger;
  translations: any[];
  concepts: any[];
  reference_concepts: any[];
  reference_translations: any[];
  sourceFlag: string;
  targetFlag: string;
  pronounce: any[]
  hasPronounce: boolean;



  constructor(private injector: Injector, private title: Title, private meta: Meta, private mergerService: MergerService, private resourceService:ResourceService,) {
    this.login = new Login(injector);
  }

  ngOnInit() {
    console.log("SL" + this.sourceLang)
    this.title.setTitle("Euroglot Online | Vertalen woorden, synoniemen, uitdrukkingen en spreekwoorden");
    this.meta.addTag({name: 'description', content: 'Online vertaalwoordenboek kruislings woorden en uitdrukkingen vertalen Nederlands, Engels, Frans, Duits, Spaans, Italiaans'}, true);
    this.login.onLoginSubmit();
    this.getSourceLangIcon();
    this.getTargetLangIcon();
  }

  getPronounce(pronounceArray){
    
  }

  getSourceLangIcon(){
    console.log("SOURCELANG" + this.sourceLang)
    let sourceLang = this.sourceLang;
    
    if(sourceLang == "nl"){
      this.sourceFlag = "assets/icons/nl.png";
    } else if(sourceLang == "de"){
      this.sourceFlag = "assets/icons/de.png";
    } else if(sourceLang == "fr"){
      this.sourceFlag = "assets/icons/fr.png";
    }else if(sourceLang == "en"){
      this.sourceFlag = "assets/icons/en.png";
    }else if(sourceLang == "it"){
      this.sourceFlag = "assets/icons/it.png";
    } else if(sourceLang == "es"){
      this.sourceFlag = "assets/icons/es.png";
    }
  }
  getTargetLangIcon(){
    let targetLang = this.targetLang;
    if(targetLang == "nl"){
      this.targetFlag = "assets/icons/nl.png";
    } else if(targetLang == "de"){
      this.targetFlag = "assets/icons/de.png";
    } else if(targetLang == "fr"){
      this.targetFlag = "assets/icons/fr.png";
    }else if(targetLang == "en"){
      this.targetFlag = "assets/icons/en.png";
    }else if(targetLang == "it"){
      this.targetFlag = "assets/icons/it.png";
    } else if(targetLang == "es"){
      this.targetFlag = "assets/icons/es.png";
    }
  }
 

  switchLanguages(){
    let sourceLang = this.sourceLang;
    let targetLang = this.targetLang;
    if(this.sourceLang == this.targetLang){
      return;
    }
    this.sourceLang = targetLang
    this.targetLang = sourceLang

    if(this.switchLemma != ""){
      this.surroundingsValue = this.switchLemma;
      this.loadAutocomplete(this.switchLemma, this.sourceLang)
    }

  }

 loadAutocomplete(query: string, sourceLang: string){
    return this.mergerService.search(sourceLang, query, this.caseSensitive, this.diacriticSensitive).subscribe(
      data => this.handleAutocomplete(data),
      error => this.handleAutcompleteError(error)
    )

  }

  handleAutocomplete(data){
    this.forms = data.data.forms;
    let center: number = data.data.center_word_position;
    this.searchlemmas = this.getSearchLemmas(this.forms[center].data)

  }
  handleAutcompleteError(error){
    console.log(error)
  }

  triggerAutocomplete(query: string, sourceLang: string){
    this.autocompleteInput = query;

    let timer = TimerObservable.create(1000);
    this.autocompleteTimerSubscription = timer.subscribe( t => {
      this.loadAutocomplete(this.autocompleteInput, sourceLang)
      this.stopAutoComplete();
    
    })
  }

  stopAutoComplete() {
    if(this.autocompleteTimerSubscription != null) {
      this.autocompleteTimerSubscription.unsubscribe();
      this.autocompleteTimerSubscription = null;
    }

    
  }

  getSearchLemmas(surroundData:any): SearchLemmas {
    let searchLemmas = new SearchLemmas();

    for(let lemma of surroundData.lemmas){
      searchLemmas.lemmas.push(lemma.data.lemma);
      searchLemmas.form_texts.push(surroundData.form);
    }

    return searchLemmas
  }

  selectItem(item, sourceLang){
    sourceLang = this.sourceLang
    this.surroundingsValue = item.data.form;
    this.searchlemmas = this.getSearchLemmas(item.data);
    this.loadAutocomplete(item.data.form, sourceLang);
  }

  searchTranslations(){
    if((this.surroundingsValue = undefined) || (this.surroundingsValue = "")) {
      return
    }
    this.stopAutoComplete();
    if(this.searchlemmas == undefined){
      if(this.surroundingsValue == undefined){
        return
      }
      this.loadAutocomplete(this.surroundingsValue, this.sourceLang)
    } else {
      this.loadTranslations()
    }
  }

  loadTranslations(){
    this.getSourceLangIcon();
    this.getTargetLangIcon();
    if((this.searchlemmas == undefined) || (this.searchlemmas.lemmas.length == 0)){
      return
    }
    this.matAutocompleteTrigger.closePanel();
    return this.mergerService.makeTranslationsPOST(this.sourceLang, this.targetLang, this.searchlemmas, this.caseSensitive, this.diacriticSensitive).subscribe(
      data => this.handleTranslationSuccess(data),
      error => this.handleTranslationError(error)
    )
  }

  handleTranslationSuccess(data){
    this.translations = data.data.translations;
    this.concepts = data.data.concepts;
    this.fetchWordTypes(this.concepts);
    this.getPronounce(this.translations);

    console.log("CONCEPTS FROM HANDLETRANS" + JSON.stringify(this.concepts))
    this.reference_concepts = data.data.reference_concepts;
    this.reference_translations = data.data.reference_translations;
  }
  
  handleTranslationError(error){
    console.log(error);
  }

  fetchWordTypes(concepts: any[]) {
    for(let concept of concepts) {
      let wt = concept.data.lemmas[0].data.word_type
      this.resourceService.resourceWordType(wt, this.sourceLang)
    }

  }

}