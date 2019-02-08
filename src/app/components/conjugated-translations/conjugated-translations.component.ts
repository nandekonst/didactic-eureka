import { Component, OnInit, Input } from '@angular/core';
import { OverviewPanelComponent } from '../overview-panel/overview-panel.component';
import { ConjugationService } from '../../services/conjugation.service';
import { ResourceService, ResourceMapInterface  } from '../../shared-services/resource.service';
import { ScreenlanguageService } from '../../services/screenlanguage.service';

@Component({
  selector: 'conjugated-translations',
  templateUrl: './conjugated-translations.component.html',
  styleUrls: ['./conjugated-translations.component.css']
})
export class ConjugatedTranslationsComponent implements OnInit {
 currentResourceMaps: ResourceMapInterface;

 @Input() targetLang: string;
 @Input() sourceLang: string;
 @Input() conceptid: number;
 @Input() dictionary: string;
 @Input() focus: number;
 @Input() sourceForm: string;
 hasResult: boolean = false;
 form: string;
 lemma: string;
 translations: any[] = [];
 screenLanguage: string;

  constructor(private conjugationService: ConjugationService, private screenLanguageService: ScreenlanguageService, private resourceService: ResourceService) {
    this.screenLanguage = this.screenLanguageService.getScreenLanguage();
    console.log("SCREENLANG" + this.screenLanguage)
   }

  ngOnInit() {
    this.resourceService.currentResourceMaps.subscribe(currentResourceMap => this.currentResourceMaps = currentResourceMap);

    console.log("Conceptid" + this.conceptid + "dictionary" + this.dictionary + "focus" + this.focus + "sourceForm" + this.sourceForm);
    this.loadConjugatedTranslations();
  }

  loadConjugatedTranslations(){
    let diacritic_insensitive = false;
    let case_insensitive = false
    this.conjugationService.getTranslatedConjugations(this.dictionary, this.sourceLang, this.targetLang, this.conceptid, this.focus, this.sourceForm, case_insensitive, diacritic_insensitive).subscribe(
      data => this.handleConjugatedTranslationSuccess(data),
      error => this.handleConjugatedTranslationError(error),
      () => {}
    )

    }

    handleConjugatedTranslationSuccess(data){
      this.form = data.data.form;
      this.lemma = data.data.lemma;
      this.translations = data.data.translations;
      if(this.translations == undefined){
        return;
      }
      if(this.translations.length === 0){
        this.hasResult = false;
      } else {
        this.hasResult = true;
      }
      console.log("TRANS" + JSON.stringify(this.translations))
      this.getResources();
    }

    handleConjugatedTranslationError(error){
      console.log(error)
    }

    getResources(){
      var userLang = navigator.language
      console.log("userlang" + userLang)
      
      if(this.translations){
        for(var translation of this.translations) {
          this.resourceService.resource(translation.source_variant_name, this.screenLanguage);
          for(var variant of translation.conjugations.variants){
            this.resourceService.resource(variant.variant_name, this.screenLanguage)
          }
        }

      }
    
   
    }
    
  }



