import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalePurchaseLadgerAccountBase } from './sale-purchase-ladger-account-base';

const routes: Routes = [
  {
    path:'',component:SalePurchaseLadgerAccountBase
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalePurchaseLadgerAccountBaseRoutingModule { }
