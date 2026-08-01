import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaleMaster } from './sale-master';
import { SalePdf } from './sale-pdf/sale-pdf';

const routes: Routes = [
  {
    path:'',component:SaleMaster
  },
 {
  path: 'salePdf/:saleInvoiceId',
  component: SalePdf
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleMasterRoutingModule { }
