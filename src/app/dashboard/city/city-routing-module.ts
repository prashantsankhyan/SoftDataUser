import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { City } from './city';

const routes: Routes = [
  {
    path:'',component:City
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CityRoutingModule { }
