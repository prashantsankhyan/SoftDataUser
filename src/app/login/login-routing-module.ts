import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login';
import { ViewSubUserdetails } from './view-sub-userdetails/view-sub-userdetails';

const routes: Routes = [
  {
    path:'',component:Login
  },
  {
    path:'viewSubUser',component:ViewSubUserdetails
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
