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
import { SuppCusComponent } from './components/SuppCus/SuppCus.component';
import { HomeComponent } from './components/home/home.component';
import { MainmenuComponent } from './components/mainmenu/mainmenu.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { UsersComponent } from './components/users/users.component';
import { GeneralComponent } from './components/general/general.component';
import { SigninComponent } from './components/signin/signin.component';
import { LookupsComponent } from './components/lookups/lookups.component';
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



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
    SigninComponent,
    LookupsComponent
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    TreeModule.forRoot(),
    HttpModule,
    FormsModule,
    BrowserAnimationsModule

  ],
  providers: [HttpService, ShareService],
  bootstrap: [AppComponent]
})
export class AppModule { }





