import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path:'',redirectTo:'loging',pathMatch:'full'

    },
   

    {
        path:'loging',
        loadChildren:()=>import('./login/login-module').then(m=>m.LoginModule)
    },

     {
        path:'subLogin',
        loadChildren:()=>import('./sub-login/sub-login-module').then(m=>m.SubLoginModule)
    },
    {
        path:'dashboard',
        loadChildren:()=>import('./dashboard/dashboard-module').then(m=>m.DashboardModule)
    }
];
