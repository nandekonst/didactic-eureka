import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { MergerService } from '../../services/merger.service';
import { ResourceService, ResourceMapInterface } from '../../shared-services/resource.service';
import { HomeComponent } from '../home/home.component';
import {ScreenlanguageService} from '../../services/screenlanguage.service';

@Component({
  selector: 'overview-panel',
  templateUrl: './overview-panel.component.html',
  styleUrls: ['./overview-panel.component.css']
})
export class OverviewPanelComponent implements OnInit {
 
  @Input() concepts: any[];
  @Input() translations: any[];
  @Input() targetFlag: string;
  @Input() sourceFlag: string;
  @Input() sourceLang: string;
  @Input() targetLang: string;
  @Input() sourceForm:string;
  dictionary: string;
  conceptid: number;
  focus: number;
  attributeList: string[];
  contents: string;


  currentResourceMaps: ResourceMapInterface;

  constructor(private mergerService: MergerService, private resourceService: ResourceService, private screenlanguageService: ScreenlanguageService) { }

  ngOnInit() {

   // console.log("SURR" + this.homeComponent.surroundingsValue)
    this.resourceService.currentResourceMaps.subscribe(currentResourceMap => this.currentResourceMaps = currentResourceMap);

  }

  ngAfterViewInit(){
    //this.parseAttributeData();
  }

  showAttributes(conceptattributes, lemmaJSON){
    this.attributeList = [];
    this.attributeList.push('h' + lemmaJSON.word_type);
    if(lemmaJSON.gender){
      this.attributeList.push('g' + lemmaJSON.gender);
    }
    if(conceptattributes){
      conceptattributes.forEach(attribute => {
        this.attributeList.push(attribute);  
      });
    }
    if(lemmaJSON.attributes){
      lemmaJSON.attributes.forEach(attribute => {
        this.attributeList.push(attribute);
      })
    }
    this.parseAttributeData();
    console.log("LEMMAJSON" + JSON.stringify(lemmaJSON) + "CONCEPTATT" + JSON.stringify(conceptattributes) + "LIST" +  this.attributeList)
  }

  parseAttributeData(){
    if(this.attributeList == undefined){
      return;
    }
    let screenlang = this.screenlanguageService.getScreenLanguage()
    this.resourceService.attributes(this.attributeList, screenlang).then(
      resourceResult => {
        this.showResources(resourceResult);
      }
    )

  }

  showResources(resources: string[]){
    this.contents = '';
    resources.forEach(resource => {
      if(this.contents = ''){
        this.contents += ', ';
      }
      this.contents = resource;
      console.log("RESOURCE" + resource)
    })
  }
  

 

  

  

}
