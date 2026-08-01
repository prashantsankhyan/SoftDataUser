import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemMaster } from './item-master';

const routes: Routes = [
  {
    path:'',component:ItemMaster
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemMasterRoutingModule { }
