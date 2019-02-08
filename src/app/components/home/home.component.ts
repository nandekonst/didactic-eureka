import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import {NavbarComponent} from '../navbar/navbar.component';
import {OverviewPanelComponent} from '../overview-panel/overview-panel.component';
import {TmPanelComponent} from '../tm-panel/tm-panel.component';
import { Languages } from '../../interfaces/languages';
import { MergerService } from '../../services/merger.service';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { TimerObservable } from 'rxjs/Observable/TimerObservable';
import {SearchLemmas} from '../../interfaces/searchlemmas';
import {Login} from '../../classes/login';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import { ResourceService } from '../../shared-services/resource.service';
import { ScreenlanguageService} from '../../services/screenlanguage.service';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';



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
  @ViewChild(TmPanelComponent) tmpanelcomponent: TmPanelComponent;
  @ViewChild(MatAutocompleteTrigger) matAutocompleteTrigger: MatAutocompleteTrigger;
  translations: any[];
  concepts: any[];
  reference_concepts: any[];
  reference_translations: any[];
  sourceFlag: string;
  targetFlag: string;
  pronounce: any[]
  hasPronounce: boolean;
  sourceForm: string;



  constructor(private injector: Injector, private activatedRoute:ActivatedRoute, private location: Location,  private title: Title, private meta: Meta, private mergerService: MergerService, private resourceService:ResourceService, private screenlanguageService: ScreenlanguageService) {
    this.login = new Login(injector);
  }

  ngOnInit() {
    if (this.activatedRoute !=undefined){
      this.sourceLang = this.activatedRoute.snapshot.paramMap.get('sourcelang');
      this.targetLang = this.activatedRoute.snapshot.paramMap.get('targetlang');
      this.surroundingsValue = this.activatedRoute.snapshot.paramMap.get('search');
      this.searchTranslations();
    }

    this.title.setTitle("Euroglot Online | Vertalen woorden, synoniemen, uitdrukkingen en spreekwoorden");
    this.meta.addTag({name: 'description', content: 'Online vertaalwoordenboek kruislings woorden en uitdrukkingen vertalen Nederlands, Engels, Frans, Duits, Spaans, Italiaans'}, true);
    this.login.onLoginSubmit();
    this.getSourceLangIcon();
    this.getTargetLangIcon();
    let screenlanguage = this.screenlanguageService.getScreenLanguage();
    this.screenlanguageService.setScreenLanguage(screenlanguage);

  
    


  }

  getSourceLangIcon(){
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
      this.loadAutocomplete(this.switchLemma, true)
    }

  }

 loadAutocomplete(query: string, lookup:boolean){
    return this.mergerService.search(this.sourceLang, query, this.caseSensitive, this.diacriticSensitive).subscribe(
      data => this.handleAutocomplete(data, lookup),
      error => this.handleAutcompleteError(error)
    )

  }

  handleAutocomplete(data, lookup:boolean){
    this.forms = data.data.forms;
    let center: number = data.data.center_word_position;
    this.searchlemmas = this.getSearchLemmas(this.forms[center].data);
    this.sourceForm = this.searchlemmas.form_texts[0];
    
    if (lookup) {
      this.loadTranslations();
    }

  }
  handleAutcompleteError(error){
    console.log(error)
  }

  triggerAutocomplete(query: string, lookup){
    this.autocompleteInput = query;

    let timer = TimerObservable.create(1000);
    this.autocompleteTimerSubscription = timer.subscribe( t => {
      this.loadAutocomplete(this.autocompleteInput, false)
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

  selectItem(item){
    this.surroundingsValue = item.data.form;
    this.searchlemmas = this.getSearchLemmas(item.data);
    this.loadAutocomplete(item.data.form, false );
    console.log("SURRVALUE2" + this.surroundingsValue)

  }

  routeProvider(): string {
    let screenlanguage = this.screenlanguageService.getScreenLanguage();
    let url = '';
    switch(screenlanguage){
      case 'nl': {
        url += 'vertaal';
        break;
      }
      case 'en': {
        url += 'translate';
        break;
      }
      case 'fr': {
        url += 'traduire';
        break;
      }
      case 'de': {
        url += 'ubersetzung';
        break;
      }
      case 'es': {
        url += 'traduccion';
        break;
      }
      case 'it': {
        url += 'traduizzone';
        break;
      }
      default: {
        url += 'translate';
        break;
      }
      
      
    }

    url += '/';
    url += this.sourceLang;
    url += '/';
    url += this.targetLang;
    url += '/';
    url += this.surroundingsValue;
    
    return url
  }

  getPronounce(){
    //todo
  }

  onSearchTranslations(){
    //this.clear();
    //this.tmpanelcomponent.clear();
    console.log("RouteProv" + this.routeProvider())

    this.location.go(this.routeProvider());
    
    this.searchTranslations();
    this.tmpanelcomponent.loadTranslations();
    
    
  }

  searchTranslations(){
    if((this.surroundingsValue == undefined) || (this.surroundingsValue == "")) {
      return
    }
    this.stopAutoComplete();
    if(this.searchlemmas == undefined){
      if(this.surroundingsValue == undefined){
        return
      }
      this.loadAutocomplete(this.surroundingsValue, true)
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
    //this.router.navigate(['/translate', this.sourceLang, this.targetLang, this.surroundingsValue])

    this.translations = data.data.translations;
    this.concepts = data.data.concepts;
    this.fetchWordTypes(this.concepts);
    //this.getPronounce(this.translations);

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

  clear(){
    this.concepts = [];
    this.reference_concepts = [];
    this.translations = [];
    this.reference_translations = [];
    if(this.searchlemmas != undefined){
      this.searchlemmas.clear();
    }

    this.surroundingsValue = "";
    this.forms = [];

  }

}