import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullLedgerDetails } from './full-ledger-details';

const routes: Routes = [
  {
    path:'',component:FullLedgerDetails
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FullLedgerDetailsRoutingModule { }
