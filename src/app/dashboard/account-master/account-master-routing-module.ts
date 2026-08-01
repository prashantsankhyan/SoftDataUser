import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountMaster } from './account-master';

const routes: Routes = [
  {
    path:'',component:AccountMaster
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountMasterRoutingModule { }
