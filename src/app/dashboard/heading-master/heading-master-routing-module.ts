import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeadingMaster } from './heading-master';

const routes: Routes = [
  {
    path:'',component:HeadingMaster
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HeadingMasterRoutingModule { }
