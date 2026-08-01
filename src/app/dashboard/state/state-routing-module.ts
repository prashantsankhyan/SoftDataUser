import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { State } from './state';

const routes: Routes = [
  {
    path:'',component:State
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StateRoutingModule { }
