import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountNameLedger } from './account-name-ledger';

const routes: Routes = [
  {
    path:'',component:AccountNameLedger
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountNameLedgerRoutingModule { }
