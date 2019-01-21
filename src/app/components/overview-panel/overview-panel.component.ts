import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { MergerService } from '../../services/merger.service';
import { ResourceService, ResourceMapInterface } from '../../shared-services/resource.service';



@Component({
  selector: 'overview-panel',
  templateUrl: './overview-panel.component.html',
  styleUrls: ['./overview-panel.component.css']
})
export class OverviewPanelComponent implements OnInit {
 
  @Input() concepts: any[];
  @Input() translations: any[];
   sourceLang: string
  @Input() targetFlag: string;
  @Input() sourceFlag: string;
  currentResourceMaps: ResourceMapInterface;

  constructor(private mergerService: MergerService, private resourceService: ResourceService) { 
   
  }

  ngOnInit() {
    this.resourceService.currentResourceMaps.subscribe(currentResourceMap => this.currentResourceMaps = currentResourceMap);

    console.log("CurrentResourcemaps" + JSON.stringify(this.currentResourceMaps))
  }

 

  

  

}
