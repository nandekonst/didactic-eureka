import {MatButtonModule, MatCheckboxModule, MatInputModule, MatPaginatorModule} from '@angular/material';
import { NgModule } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTableModule} from '@angular/material/table';



@NgModule({
    imports: [MatToolbarModule, MatIconModule,MatCardModule,MatExpansionModule, MatAutocompleteModule, MatTooltipModule, MatTableModule, MatInputModule, MatPaginatorModule],
    exports: [MatToolbarModule, MatIconModule,MatCardModule, MatExpansionModule, MatAutocompleteModule, MatTooltipModule, MatTableModule, MatInputModule, MatPaginatorModule],
})

export class CustomMaterialModule {

}