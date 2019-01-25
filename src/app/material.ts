import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import { NgModule } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTooltipModule} from '@angular/material/tooltip';



@NgModule({
    imports: [MatToolbarModule, MatIconModule,MatCardModule,MatExpansionModule, MatAutocompleteModule, MatTooltipModule],
    exports: [MatToolbarModule, MatIconModule,MatCardModule, MatExpansionModule, MatAutocompleteModule, MatTooltipModule],
})

export class CustomMaterialModule {

}