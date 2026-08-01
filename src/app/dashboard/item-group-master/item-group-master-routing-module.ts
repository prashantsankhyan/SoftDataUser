import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemGroupMaster } from './item-group-master';

const routes: Routes = [
  {
    path:'',component:ItemGroupMaster
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemGroupMasterRoutingModule { }
