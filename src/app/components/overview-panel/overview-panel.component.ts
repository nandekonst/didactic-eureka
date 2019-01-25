import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { MergerService } from '../../services/merger.service';
import { ResourceService, ResourceMapInterface } from '../../shared-services/resource.service';
import { HomeComponent } from '../home/home.component';

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

  currentResourceMaps: ResourceMapInterface;

  constructor(private mergerService: MergerService, private resourceService: ResourceService) { }

  ngOnInit() {

   // console.log("SURR" + this.homeComponent.surroundingsValue)
    this.resourceService.currentResourceMaps.subscribe(currentResourceMap => this.currentResourceMaps = currentResourceMap);

  }

  showAttributes(lemmaJSON){
    console.log("LEMMAJSON" + JSON.stringify(lemmaJSON))
  }
  

 

  

  

}
