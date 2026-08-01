import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentMaster } from './agent-master';

const routes: Routes = [
  {
    path:'',component:AgentMaster
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentMasterRoutingModule { }
