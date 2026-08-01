import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnitMaster } from './unit-master';

const routes: Routes = [
  {
    path:'',component:UnitMaster
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitMasterRoutingModule { }
