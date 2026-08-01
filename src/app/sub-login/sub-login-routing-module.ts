import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubLogin } from './sub-login';

const routes: Routes = [
  {
    path:'',component:SubLogin
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubLoginRoutingModule { }
