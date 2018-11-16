import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "../compoennts/login/login.component";
import { SettingsComponent } from "../compoennts/settings/settings.component";
import { SuppCusComponent } from "../compoennts/SuppCus/SuppCus.component";
import { HomeComponent } from "../compoennts/home/home.component";
import { MainmenuComponent } from '../compoennts/mainmenu/mainmenu.component';
import { NavigationComponent } from '../compoennts/navigation/navigation.component';
import { UsersComponent } from "../compoennts/forms/users/users.component";
import { GeneralComponent } from "../compoennts/printing/general/general.component";
const routes: Routes = [
  {path:'login', component:LoginComponent},
  {path:'settings', component:SettingsComponent},
  {path:'SuppCus', component:SuppCusComponent},
  {path:'home', component:HomeComponent},
  {path:'menu', component:MainmenuComponent},
  {path:'menu', component:NavigationComponent},
  {path:'userforms',component:UsersComponent},
  {path:'printing',component:GeneralComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
