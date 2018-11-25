import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "../components/login/login.component";
import { SettingsComponent } from "../components/settings/settings.component";
import { SuppcusComponent } from "../components/suppcus/suppcus.component";
import { HomeComponent } from "../components/home/home.component";
import { UsersComponent } from "../components/users/users.component";
import { LookupsComponent } from '../components/lookups/lookups.component';
import { InvoiceComponent } from '../components/invoice/invoice.component';
import { ChecksComponent } from '../components/checks/checks.component';
import { ReturnsComponent } from '../components/returns/returns.component';
import { LogComponent } from '../components/log/log.component';

const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'login', component:LoginComponent},
  {path:'settings', component:SettingsComponent},
  {path:'supcus', component:SuppcusComponent},
  {path:'users',component:UsersComponent},
  {path:'lookups',component:LookupsComponent},
  {path:'invoice',component:InvoiceComponent},
  {path:'checks',component:ChecksComponent},
  {path:'returns',component:ReturnsComponent},
  {path:'log',component:LogComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
