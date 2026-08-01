import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GstVatMaster } from './gst-vat-master';

const routes: Routes = [
  {
    path:'',component:GstVatMaster
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GstVatMasterRoutingModule { }
