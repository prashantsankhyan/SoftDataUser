import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard';

const routes: Routes = [
  {
    path:'',component:Dashboard,children:[
      {
        path:'groupMaster',
        loadChildren:()=>import('./group-master/group-master-module').then(m=>m.GroupMasterModule)
      },
            {
        path:'itemGroupMaster',
        loadChildren:()=>import('./item-group-master/item-group-master-module').then(m=>m.ItemGroupMasterModule)
      },
      {
        path:'unitMaster',
        loadChildren:()=>import('./unit-master/unit-master-module').then(m=>m.UnitMasterModule)
      },
       {
        path:'agentMaster',
        loadChildren:()=>import('./agent-master/agent-master-module').then(m=>m.AgentMasterModule)
      },
      {
        path:'categoryMaster',
        loadChildren:()=>import('./category-master/category-master-module').then(m=>m.CategoryMasterModule)
      
    },
    {
        path:'transportMaster',
        loadChildren:()=>import('./transport-master/transport-master-module').then(m=>m.TransportMasterModule)
    },
     {
        path:'headingMaster',
        loadChildren:()=>import('./heading-master/heading-master-module').then(m=>m.HeadingMasterModule)
    },
       {
        path:'gstVat',
        loadChildren:()=>import('./gst-vat-master/gst-vat-master-module').then(m=>m.GstVatMasterModule)
    },
    {
        path:'saleHeading',
        loadChildren:()=>import('./sale-heading/sale-heading-module').then(m=>m.SaleHeadingModule)
    },
     {
        path:'screen',
        loadChildren:()=>import('./screen-management/screen-management-module').then(m=>m.ScreenManagementModule)
    },
    {
        path:'itemMaster',
        loadChildren:()=>import('./item-master/item-master-module').then(m=>m.ItemMasterModule)
    },
     {
        path:'accountMaster',
        loadChildren:()=>import('./account-master/account-master-module').then(m=>m.AccountMasterModule)
    },
     {
        path:'taxtable',
        loadChildren:()=>import('./tax-table-master/tax-table-master-module').then(m=>m.TaxTableMasterModule)
    },
     {
        path:'sale',
        loadChildren:()=>import('./sale-master/sale-master-module').then(m=>m.SaleMasterModule)
    },
      {
        path:'state',
        loadChildren:()=>import('./state/state-module').then(m=>m.StateModule)
    },
      {
        path:'city',
        loadChildren:()=>import('./city/city-module').then(m=>m.CityModule)
    },
    {
        path:'narration',
        loadChildren:()=>import('./narration/narration-module').then(m=>m.NarrationModule)
    },
     {
        path:'paymentReceipt',
        loadChildren:()=>import('./payment-receipt/payment-receipt-routing-module').then(m=>m.PaymentReceiptRoutingModule)
    },
     {
        path:'accountNameLedger',
        loadChildren:()=>import('./account-name-ledger/account-name-ledger-module').then(m=>m.AccountNameLedgerModule)
    },
     {
        path:'fullLedger',
        loadChildren:()=>import('./full-ledger-details/full-ledger-details-module').then(m=>m.FullLedgerDetailsModule)
    },


    {
        path:'registertType',
        loadChildren:()=>import('./register-type/register-type-module').then(m=>m.RegisterTypeModule)
    },

    
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
