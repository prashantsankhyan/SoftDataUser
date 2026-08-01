import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupMaster } from './group-master';

const routes: Routes = [
  {
    path:'',component:GroupMaster
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupMasterRoutingModule { }
