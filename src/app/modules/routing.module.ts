import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "../components/login/login.component";
import { SettingsComponent } from "../components/settings/settings.component";
import { SuppCusComponent } from "../components/SuppCus/SuppCus.component";
import { HomeComponent } from "../components/home/home.component";
import { MainmenuComponent } from '../components/mainmenu/mainmenu.component';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { UsersComponent } from "../components/users/users.component";
import { GeneralComponent } from "../components/general/general.component";
import { LookupsComponent } from '../components/lookups/lookups.component';
const routes: Routes = [
  {path:'login', component:LoginComponent},
  {path:'settings', component:SettingsComponent},
  {path:'SuppCus', component:SuppCusComponent},
  {path:'', component:HomeComponent},
  {path:'menu', component:MainmenuComponent},
  {path:'menu', component:NavigationComponent},
  {path:'userforms',component:UsersComponent},
  {path:'printing',component:GeneralComponent},
  {path:'lookups',component:LookupsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
