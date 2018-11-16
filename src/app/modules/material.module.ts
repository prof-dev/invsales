import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatToolbarModule, MatTabsModule, MatButtonModule, MatSidenavModule, MatIconModule,
  MatListModule, MatTableModule, MatPaginatorModule, MatSortModule, MatCardModule, MatMenuModule,
  MatInputModule, MatFormFieldModule, MatChipsModule, MatButtonToggleModule, MatDialogModule, MatSliderModule,
   MatProgressBarModule, MatOptionModule, MatSelectModule, MatTooltipModule,
    MatExpansionModule, MatCheckboxModule, MatAutocompleteModule
} from '@angular/material';

import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatGridListModule } from '@angular/material/grid-list';
import {MatRadioModule, MatRadioGroup, MatRadioButton} from "@angular/material/radio";
@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule,
    MatListModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatGridListModule, MatCardModule, MatMenuModule, MatInputModule,
    MatTabsModule, MatChipsModule, MatFormFieldModule, MatGridListModule,
    MatButtonToggleModule, MatDialogModule, MatSliderModule, MatSlideToggleModule,
    MatProgressBarModule, MatOptionModule, MatSelectModule, MatTooltipModule,
    MatExpansionModule, MatCheckboxModule,MatRadioModule, MatAutocompleteModule
  ],
  exports: [
    MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule,
    MatListModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatGridListModule, MatCardModule, MatMenuModule, MatInputModule,
    MatTabsModule, MatChipsModule, MatFormFieldModule, MatGridListModule,
    MatButtonToggleModule, MatDialogModule, MatSliderModule, MatSlideToggleModule,
    MatProgressBarModule, MatOptionModule, MatSelectModule, MatTooltipModule,
    MatExpansionModule,MatCheckboxModule,MatRadioGroup, MatRadioButton,MatAutocompleteModule
  ],
  declarations: [],
 
})
export class MaterialModule { }
