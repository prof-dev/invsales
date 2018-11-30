import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatToolbarModule, MatTabsModule, MatButtonModule, MatIconModule,
  MatListModule, MatTableModule, MatPaginatorModule, MatSortModule, MatCardModule, MatMenuModule,
  MatInputModule, MatFormFieldModule, MatChipsModule, MatButtonToggleModule, MatDialogModule, MatSliderModule,
   MatProgressBarModule, MatOptionModule, MatSelectModule, MatTooltipModule,
    MatExpansionModule, MatCheckboxModule, MatAutocompleteModule,MatSnackBarModule, MatDatepickerModule, MatNativeDateModule
} from '@angular/material';

import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatGridListModule } from '@angular/material/grid-list';
import {MatRadioModule, MatRadioGroup, MatRadioButton} from "@angular/material/radio";
import { MatSidenavModule } from "@angular/material/sidenav";
@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule,
    MatListModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatGridListModule, MatCardModule, MatMenuModule, MatInputModule,
    MatTabsModule, MatChipsModule, MatFormFieldModule, MatGridListModule,
    MatButtonToggleModule, MatDialogModule, MatSliderModule, MatSlideToggleModule,
    MatProgressBarModule, MatOptionModule, MatSelectModule, MatTooltipModule,
    MatExpansionModule, MatCheckboxModule,MatRadioModule, MatAutocompleteModule,MatSnackBarModule, 
    MatDatepickerModule, MatNativeDateModule
  ],
  exports: [
    MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule,
    MatListModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatGridListModule, MatCardModule, MatMenuModule, MatInputModule,
    MatTabsModule, MatChipsModule, MatFormFieldModule, MatGridListModule,
    MatButtonToggleModule, MatDialogModule, MatSliderModule, MatSlideToggleModule,
    MatProgressBarModule, MatOptionModule, MatSelectModule, MatTooltipModule,
    MatExpansionModule,MatCheckboxModule,MatRadioGroup, MatRadioButton,MatAutocompleteModule,MatSnackBarModule,
    MatDatepickerModule,MatNativeDateModule
  ],
  declarations: [],
 
})
export class MaterialModule { }
