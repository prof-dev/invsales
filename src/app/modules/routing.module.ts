import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "../components/login/login.component";
import { SettingsComponent } from "../components/settings/settings.component";
import { SuppcusComponent } from "../components/suppcus/suppcus.component";
import { HomeComponent } from "../components/home/home.component";
import { MainmenuComponent } from '../components/mainmenu/mainmenu.component';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { UsersComponent } from "../components/users/users.component";
import { GeneralComponent } from "../components/general/general.component";
import { LookupsComponent } from '../components/lookups/lookups.component';
import { InvoiceComponent } from '../components/invoice/invoice.component';
import { ChecksComponent } from '../components/checks/checks.component';
const routes: Routes = [
  {path:'login', component:LoginComponent},
  {path:'settings', component:SettingsComponent},
  {path:'supcus', component:SuppcusComponent},
  {path:'', component:HomeComponent},
  {path:'menu', component:MainmenuComponent},
  {path:'menu', component:NavigationComponent},
  {path:'users',component:UsersComponent},
  {path:'printing',component:GeneralComponent},
  {path:'lookups',component:LookupsComponent},
  {path:'invoice',component:InvoiceComponent},
  {path:'checks',component:ChecksComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
