import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseHeading } from './purchase-heading';

const routes: Routes = [
  {
    path:'',component:PurchaseHeading
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseHeadingRoutingModule { }
