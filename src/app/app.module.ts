import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './modules/routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './compoennts/login/login.component';
import { SettingsComponent } from './compoennts/settings/settings.component';
import { MaterialModule } from './modules/material.module';
import { TreeModule } from "angular-tree-component";
import { HttpModule } from '@angular/http';
import { HttpService } from './services/http.service';
import { ShareService } from './services/share.service';
import { SuppCusComponent } from './compoennts/SuppCus/SuppCus.component';
import { NgbModule,NgbAlertModule,NgbAlertConfig } from "@ng-bootstrap/ng-bootstrap";
import { HomeComponent } from './compoennts/home/home.component';
import { MainmenuComponent } from './compoennts/mainmenu/mainmenu.component';
import { NavigationComponent } from './compoennts/navigation/navigation.component';
import { UsersComponent } from './compoennts/forms/users/users.component';
import { GeneralComponent } from './compoennts/printing/general/general.component';
import { SigninComponent } from './compoennts/signin/signin.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SettingsComponent,
    SuppCusComponent,
    HomeComponent,
    MainmenuComponent,
    NavigationComponent,
    UsersComponent,
    GeneralComponent,
    SigninComponent
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    TreeModule.forRoot(),
    HttpModule,
    NgbModule,
    NgbAlertModule,
    

  ],
  providers: [HttpService, ShareService,NgbAlertConfig],
  bootstrap: [AppComponent]
})
export class AppModule { }
