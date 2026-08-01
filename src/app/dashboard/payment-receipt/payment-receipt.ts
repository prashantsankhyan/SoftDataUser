import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllApiService } from '../../_core/_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiUrl } from '../../_core/apiUrl';
import { DeletePaymentReceipt } from './delete-payment-receipt/delete-payment-receipt';
import { AddEditPaymentReceipt } from './add-edit-payment-receipt/add-edit-payment-receipt';
import { Narration } from '../narration/narration';
@Component({
  selector: 'app-payment-receipt',
   imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule],
  templateUrl: './payment-receipt.html',
  styleUrl: './payment-receipt.scss',
})
export class PaymentReceipt {
showSpinner = true;
companyId:any;
permission:any;
searchText: string = '';
alphabets: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

listOfData: any[] = [];        // filtered data (shown)
originalList: any[] = [];      // full data (backup)
selectedRowIndex = -1;
  constructor(
    private api: AllApiService,
    private cdr: ChangeDetectorRef,
     private dialog: MatDialog,
     private router:Router
 
  ) {}

  ngOnInit(): void {
    this.getLoggedUser();
    this.getPermissions();
    this.getAllData();
   
  }

  getLoggedUser() {
  const user = localStorage.getItem('loggedUser');
 this.companyId = JSON.parse(localStorage.getItem('loggedUser') || '{}').companyId;

  return user ? JSON.parse(user) : null;
}

getPermissions() {
  this.permission =localStorage.getItem('permissions');
}

// getAllData() {
//   this.api
//     .getAllDataId(ApiUrl.getPaymentReciptVoucherCompanyId, this.companyId)
//     .subscribe((res: any) => {

//       const receipts = res?.data?.PaymentReceipts ?? [];

//       // ✅ map data
//       const mapped = receipts.map((m: any) => ({
//         ...m,
//         expanded: false,
//         details: (m.Details || []).map((d: any) => ({
//           ...d,
//           Name: d.AccountNameText,
//           station: d.Station,
//           Narration: d.Narration,
//           Amount: d.Amount,
//           CrOrDr: d.CrOrDr
//         }))
//       }));

//       // ✅ sort by ReceiptDate (latest first)
//       this.originalList = mapped.sort((a: any, b: any) =>
//         this.parseDate(b.ReceiptDate) - this.parseDate(a.ReceiptDate)
//       );

//       this.listOfData = [...this.originalList];
//       this.cdr.detectChanges();
//     });
// }

getAllData() {
  this.api
    .getAllDataId(ApiUrl.getPaymentReciptVoucherCompanyId, this.companyId)
    .subscribe((res: any) => {

      const receipts = res?.data?.PaymentReceipts ?? [];

      // ✅ map data
      const mapped = receipts.map((m: any) => ({
        ...m,

        // Auto expand if details length > 1
        expanded: (m.Details?.length || 0) > 1,

        details: (m.Details || []).map((d: any) => ({
          ...d,
          Name: d.AccountNameText,
          station: d.Station,
          Narration: d.Narration,
          Amount: d.Amount,
          CrOrDr: d.CrOrDr
        }))
      }));

      // ✅ sort by ReceiptDate (latest first)
      this.originalList = mapped.sort((a: any, b: any) =>
        this.parseDate(b.ReceiptDate) - this.parseDate(a.ReceiptDate)
      );

      this.listOfData = [...this.originalList];
      this.cdr.detectChanges();
    });
}
parseDate(dateStr: string): number {
  if (!dateStr) return 0;

  const [mm, dd, yyyy] = dateStr.split('-').map(Number);
  return new Date(yyyy, mm - 1, dd).getTime();
}
applyFilter() {
  const text = this.searchText.trim().toLowerCase();

  this.listOfData = this.originalList.filter((row: any) => {

    const partyNames = (row.Details || [])
      .map((d: any) => d.AccountNameText || '')
      .join(' ');

    const searchText = `
      ${row.AccountNameText || ''}
      ${partyNames}
      ${row.VoucherNo || ''}
      ${row.ReceiptDate || ''}
      ${row.DayName || ''}
      ${row.Total || ''}
    `.toLowerCase();

    return searchText.includes(text);
  });

  this.selectedRowIndex = this.listOfData.length > 0 ? 0 : -1;
}

filterByAlphabet(letter: string) {
  this.searchText = '';

  this.listOfData = this.originalList.filter(item =>
    item.itemName?.toUpperCase().startsWith(letter)
  );
  
   if (this.listOfData.length === 1) {
    this.selectedRowIndex = 0;
  } else {
    this.selectedRowIndex = -1;
  }
}


resetFilter() {
 this.searchText = '';
  this.listOfData = [...this.originalList];
  this.selectedRowIndex = -1;
}
openSelectedAccount() {
  if (this.listOfData.length === 1) {
    this.addEditData(this.listOfData[0]);
  }
}

addEditData(data?: any) {
  const dialogRef = this.dialog.open(AddEditPaymentReceipt, {
    width: '80vw',
    maxWidth: '1200px',
    data: data || null
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
       this.getAllData(); // reload list automatically
    }
  });
}

deleteData(row: any) {
  const dialogRef = this.dialog.open(DeletePaymentReceipt, {
    width: '360px',
    disableClose: true,
    data:row.PaymentReceiptId
  });
}
}
