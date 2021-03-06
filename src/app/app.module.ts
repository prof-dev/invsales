import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './modules/routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SettingsComponent } from './components/settings/settings.component';
import { MaterialModule } from './modules/material.module';
import { TreeModule } from "angular-tree-component";
import { HttpModule } from '@angular/http';
import { HttpService } from './services/http.service';
import { ShareService } from './services/share.service';
import { SuppcusComponent } from './components/suppcus/suppcus.component';
import { HomeComponent } from './components/home/home.component';
import { MainmenuComponent } from './components/mainmenu/mainmenu.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { UsersComponent } from './components/users/users.component';
import { GeneralComponent } from './components/general/general.component';
import { SigninComponent } from './components/signin/signin.component';
import { LookupsComponent, LookupsComponentDialog } from './components/lookups/lookups.component';
import { FormsModule,FormControl, ReactiveFormsModule} from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { ChecksComponent } from './components/checks/checks.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SettingsComponent,
    SuppcusComponent,
    HomeComponent,
    MainmenuComponent,
    NavigationComponent,
    UsersComponent,
    GeneralComponent,
    SigninComponent,
    LookupsComponent,
    InvoiceComponent,
    ChecksComponent,LookupsComponentDialog,
    

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
  bootstrap: [AppComponent,LookupsComponentDialog],
  entryComponents: [LookupsComponent,LookupsComponentDialog]
})
export class AppModule { }





