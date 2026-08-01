import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Narration } from './narration';

const routes: Routes = [
  {
    path:'',component:Narration
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NarrationRoutingModule { }
