import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterType } from './register-type';

const routes: Routes = [
  {
    path:'',component:RegisterType
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterTypeRoutingModule { }
