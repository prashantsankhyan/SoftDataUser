import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentReceipt } from './payment-receipt';

const routes: Routes = [
  {
    path:'',component:PaymentReceipt
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentReceiptRoutingModule { }
