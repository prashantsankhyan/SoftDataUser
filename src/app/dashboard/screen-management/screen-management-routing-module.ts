import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScreenManagement } from './screen-management';

const routes: Routes = [
  {
    path:'',component:ScreenManagement
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScreenManagementRoutingModule { }
