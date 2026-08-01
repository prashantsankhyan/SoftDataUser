import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaxTableMaster } from './tax-table-master';

const routes: Routes = [
  {
    path:'',component:TaxTableMaster
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxTableMasterRoutingModule { }
