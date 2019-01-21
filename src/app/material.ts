import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import { NgModule } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatAutocompleteModule} from '@angular/material/autocomplete';


@NgModule({
    imports: [MatToolbarModule, MatIconModule,MatCardModule,MatExpansionModule, MatAutocompleteModule],
    exports: [MatToolbarModule, MatIconModule,MatCardModule, MatExpansionModule, MatAutocompleteModule],
})

export class CustomMaterialModule {

}