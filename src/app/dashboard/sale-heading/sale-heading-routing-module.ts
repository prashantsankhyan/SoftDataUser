import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaleHeading } from './sale-heading';

const routes: Routes = [
  {
    path:'',component:SaleHeading
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleHeadingRoutingModule { }
