import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockManagement } from './stock-management';

const routes: Routes = [
  {
    path:'',component:StockManagement
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockManagementRoutingModule { }
