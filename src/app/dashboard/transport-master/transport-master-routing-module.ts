import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransportMaster } from './transport-master';

const routes: Routes = [
  {
    path:'',component:TransportMaster
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransportMasterRoutingModule { }
