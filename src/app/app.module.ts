import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './modules/routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MaterialModule } from './modules/material.module';
import { TreeModule } from "angular-tree-component";
import { HttpModule } from '@angular/http';
import { HttpService } from './services/http.service';
import { ShareService } from './services/share.service';
import { SuppcusComponent } from './components/suppcus/suppcus.component';
import { HomeComponent } from './components/home/home.component';
import { UsersComponent } from './components/users/users.component';
import { LookupsComponent } from './components/lookups/lookups.component';
import { FormsModule,FormControl, ReactiveFormsModule} from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { ChecksComponent } from './components/checks/checks.component';
import { DialogsComponent } from "./components/dialogs/dialogs.component";
import { ReturnsComponent } from './components/returns/returns.component';
import { LogComponent } from './components/log/log.component';
import { SadadComponent } from './components/sadad/sadad.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { SpendingsComponent } from './components/spendings/spendings.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ItemsComponent } from './components/items/items.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ItemsmoveComponent } from './components/itemsmove/itemsmove.component';
import { DeliveriesComponent } from './components/deliveries/deliveries.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SuppcusComponent,
    HomeComponent,
    UsersComponent,
    LookupsComponent,
    InvoiceComponent,
    ChecksComponent,DialogsComponent, ReturnsComponent, LogComponent, SadadComponent, InventoryComponent, SpendingsComponent, ReportsComponent,ItemsComponent, ProfileComponent, ItemsmoveComponent, DeliveriesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    TreeModule.forRoot(),
    HttpModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule

  ],
  providers: [HttpService, ShareService,{provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check'}],
  bootstrap: [AppComponent],
  entryComponents: [DialogsComponent]
})
export class AppModule { }





