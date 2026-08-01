import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiUrl } from '../../_core/apiUrl';
import { AllApiService } from '../../_core/_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddEditAccount } from '../account-master/add-edit-account/add-edit-account';
import { AddEditPaymentReceipt } from '../payment-receipt/add-edit-payment-receipt/add-edit-payment-receipt';
import { AddEditSale } from '../sale-master/add-edit-sale/add-edit-sale';
import { NgxPrintModule } from 'ngx-print';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-account-name-ledger',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, FormsModule,NgxPrintModule],
  templateUrl: './account-name-ledger.html',
  styleUrl: './account-name-ledger.scss',
  standalone: true,
})
export class AccountNameLedger implements OnInit {
  // 1. Initialized to false to prevent NG0100 error on page load
  showSpinner = false; 
  
  companyId: any;
  permission: any;
  searchText: string = '';

  listOfData: any[] = [];
  originalList: any[] = [];
  selectedAccount: any = null;
  listOfReceiptData: any[] = [];

  openingBalance: number = 0;
  _id:any;
  openingType: string = '';
  accountName: string = '';
  closingBalance: number = 0;
  closingType: string = '';
  totalCR: number = 0;
  totalDR: number = 0;
  grandTotal: number = 0;
accountSearchText: any = '';   // account dropdown
ledgerSearchText: string = '';    // ledger filter
fromDate: string = '';
toDate: string = '';


  constructor(
    private api: AllApiService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getLoggedUser();
    this.getPermissions();
    
    // 2. Wrap initial call in setTimeout to avoid ExpressionChanged error
    setTimeout(() => {
      this.getAllData();
    });
  }

 
  getLoggedUser() {
    const user = localStorage.getItem('loggedUser');
    this.companyId = JSON.parse(user || '{}')?.companyId;
    return user ? JSON.parse(user) : null;
  }

  getPermissions() {
    this.permission = localStorage.getItem('permissions');
  }

  getAllData() {
    this.showSpinner = true;
    this.cdr.detectChanges(); // Update UI to show spinner

    this.api.getAllDataId(ApiUrl.listOfAccount, this.companyId).subscribe({
      next: (res: any) => {
        if (!res?.data || !Array.isArray(res.data)) {
          this.listOfData = [];
          this.originalList = [];
          return;
        }

        const filtered = res.data.filter(
          (x: any) => x.companyId === 0 || x.companyId === this.companyId
        );

        this.originalList = filtered.sort((a: any, b: any) =>
          a.accountName.localeCompare(b.accountName)
        );

        this.listOfData = [...this.originalList];
      },
      error: (err) => {
        console.error(err);
        this.showSpinner = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.showSpinner = false;
        this.cdr.detectChanges();
      }
    });
  }

// applyFilter() {
//   const text = (
//     typeof this.accountSearchText === 'string'
//       ? this.accountSearchText
//       : this.accountSearchText?.accountName || ''
//   ).toLowerCase();

//   if (!text) {
//     this.listOfData = [...this.originalList];
//     return;
//   }

//   this.listOfData = this.originalList.filter(item =>
//     item.accountName?.toLowerCase().includes(text)
//   );
// }
onLedgerSearchChange() {

  // when textbox becomes empty
  if (!this.ledgerSearchText?.trim()) {

    if (this.selectedAccount) {

      const id =
        this.selectedAccount._id ||
        this.selectedAccount.id;

      this.getPaymentReceiptDataByAccountId(id);
    }
  }
}
applyFilter() {

  const text = (
    typeof this.accountSearchText === 'string'
      ? this.accountSearchText
      : this.accountSearchText?.accountName || ''
  ).toLowerCase();

  // ✅ When cleared
  if (!text) {

    this.listOfData = [...this.originalList];

    // clear selected account
    this.selectedAccount = null;

    // clear ledger
    this.listOfReceiptData = [];

    this.accountName = '';
    this.openingBalance = 0;
    this.closingBalance = 0;
    this.totalCR = 0;
    this.totalDR = 0;

    return;
  }

  this.listOfData = this.originalList.filter(item =>
    item.accountName?.toLowerCase().includes(text)
  );
}

  displayAccount(account: any): string {
  // When typing → string
  if (typeof account === 'string') return account;

  // When selected → object
  return account?.accountName || '';
}

 onSelectAccount(account: any) {
  this.selectedAccount = account;

  // 🔥 IMPORTANT: set input text properly
  this.accountSearchText = account.accountName;

  const accountId = account._id || account.id;

  if (accountId) {
    this.getPaymentReceiptDataByAccountId(accountId);
  }
}
applyLedgerFilter() {
  // 🚫 Stop if account not selected
  if (!this.selectedAccount) {
    alert('Please select account first');
    return;
  }

  const id = this.selectedAccount._id || this.selectedAccount.id;

  // ✅ If ALL filters are empty → load original data
  if (
    !this.ledgerSearchText?.trim() &&
    !this.fromDate &&
    !this.toDate
  ) {
    this.getPaymentReceiptDataByAccountId(id);
    return;
  }

  // ✅ Otherwise apply filter
  this.getPaymentReceiptDataByAccountId(id);
}
clearLedgerFilter() {
  this.ledgerSearchText = '';
  this.fromDate = '';
  this.toDate = '';

  if (this.selectedAccount) {
    const id = this.selectedAccount._id || this.selectedAccount.id;
    this.getPaymentReceiptDataByAccountId(id);
  }
}
convertToApiDate(date: string): string | null {
  if (!date) return null;

  const parts = date.split('-'); // dd-MM-yyyy

  if (parts.length !== 3) return null;

  const [dd, mm, yyyy] = parts;

  return `${yyyy}-${mm}-${dd}`; // ✅ API format
}
formatDateInput(type: 'from' | 'to') {
  let value = type === 'from' ? this.fromDate : this.toDate;

  if (!value) return;

  // Remove non-digits
  let digits = value.replace(/\D/g, '');

  if (digits.length > 8) digits = digits.substring(0, 8);

  let formatted = '';

  if (digits.length >= 2) {
    formatted += digits.substring(0, 2);
  }
  if (digits.length >= 4) {
    formatted += '-' + digits.substring(2, 4);
  }
  if (digits.length > 4) {
    formatted += '-' + digits.substring(4, 8);
  }

  if (type === 'from') {
    this.fromDate = formatted;
  } else {
    this.toDate = formatted;
  }
}
getPaymentReceiptDataByAccountId(id: number) {
  this.showSpinner = true;
  this.cdr.detectChanges();

  // ✅ USE HERE
let params: any = {
  searchText: this.ledgerSearchText || null,
  fromDate: this.convertToApiDate(this.fromDate),
  toDate: this.convertToApiDate(this.toDate)
};
  this.api.getWithParams(
    `${ApiUrl.getDataBaseOfAccountPaymentReceipt}/${id}`,
    params
  ).subscribe({
    next: (res: any) => {
      if (!res?.success || !res.data) {
        this.listOfReceiptData = [];
        return;
      }

      let ledger;
      try {
        ledger = typeof res.data === 'string'
          ? JSON.parse(res.data)
          : res.data;
      } catch (e) {
        console.error("JSON Parsing Error", e);
        return;
      }

      this.openingBalance = ledger.opBalance || 0;
      this._id = ledger._id || 0;
      this.openingType = (ledger.openingBalanceType || '').toUpperCase();
      this.accountName = ledger.accountName || '';
      this.closingBalance = ledger.clsBalance || 0;
      this.closingType = ledger.closingBalanceType || '';

      this.listOfReceiptData = ledger.Details || [];

      this.calculateTotals(this.listOfReceiptData);
    },
    error: (err:any) => {
      console.error('API Error:', err);
      this.showSpinner = false;
      this.cdr.detectChanges();
    },
    complete: () => {
      this.showSpinner = false;
      this.cdr.detectChanges();
    }
  });
}
  calculateTotals(data: any[]) {
    this.totalCR = 0;
    this.totalDR = 0;

    // 1. Calculate using Opening Balance
    const opening = Number(this.openingBalance) || 0;
    if (this.openingType === 'CR') {
      this.totalCR += opening;
    } else {
      this.totalDR += opening;
    }

    // 2. Calculate using the new Debit/Credit columns from SQL
    data.forEach(item => {
      this.totalDR += Number(item.Debit || 0);
      this.totalCR += Number(item.Credit || 0);
    });
  }

  // Helper methods for Template
  getAbsValue(value: number): number {
    return Math.abs(value || 0);
  }

  resetFilter() {
    this.searchText = '';
    this.listOfData = [...this.originalList];
    this.selectedAccount = null;
  }

 addEditData(data?: any) {
  // Ensure _id is set
  this._id = data?._id || 0;
  console.log('Selected ID:', this._id);

  // Prepare data to pass to dialog
  const dialogData = {
    ...data,       // spread existing data if any
    id: this._id  // explicitly include _id
  };

  // Open the Add/Edit dialog
  const dialogRef = this.dialog.open(AddEditAccount, {
    width: '95vw',
    maxWidth: '1500px',
    maxHeight: '100vh',
    data: dialogData
  });

  // Handle after dialog closes
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('Dialog result:', result);
     this.getPaymentReceiptDataByAccountId(this._id)
    }
  });
}





addEditPayment(data?: any) {
  this._id = data.AccountId

  let saleInvoiceId = data.RefId    

  let Sale = data.VoucherNo 

  if(Sale == 'Sale'){
    const dialogData = {
    ...data,       // spread existing data if any
    saleInvoiceId: saleInvoiceId  // explicitly include _id
  };
   const dialogRef = this.dialog.open(AddEditSale, {
    width: '95vw',
    maxWidth: '1500px',
    data: dialogData
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
       this.getPaymentReceiptDataByAccountId(this._id)
    }
  });
  }
  else{
 const dialogRef = this.dialog.open(AddEditPaymentReceipt, {
    width: '80vw',
    maxWidth: '1200px',
    data: data || null
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
        this.getPaymentReceiptDataByAccountId(this._id)
    }
  });
  }

 
}

formatExcelDate(date: any): string {
  if (!date) return '';

  const d = new Date(date);
  const day = ('0' + d.getDate()).slice(-2);
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}
applyBorder(row: any) {
  row.eachCell((cell: any) => {
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    cell.alignment = { vertical: 'middle' };
  });
}

exportToExcel(): void {

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Ledger');

  // ✅ 🔷 ADD CLEAN REPORT SETTINGS HERE
  worksheet.views = [{ showGridLines: false }];

  worksheet.pageSetup = {
    paperSize: 9, // A4
    orientation: 'portrait',
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    horizontalCentered: true,
     verticalCentered: false // ✅ ADD THIS
  };

  // 🔷 Column Setup
  worksheet.columns = [
    { header: 'Date', key: 'Date', width: 12 },
    { header: 'Particulars', key: 'Particulars', width: 35 },
    { header: 'Vch.Type', key: 'VchType', width: 12 },
    { header: 'Debit', key: 'Debit', width: 12 },
    { header: 'Credit', key: 'Credit', width: 12 },
    { header: 'Balance', key: 'Balance', width: 15 },
    { header: 'Type', key: 'Type', width: 8 }
  ];

  // 🔷 Title Row
  worksheet.mergeCells('A1:G1');
  worksheet.getCell('A1').value = 'LEDGER REPORT';
  worksheet.getCell('A1').font = { bold: true, size: 16 };
  worksheet.getCell('A1').alignment = { horizontal: 'center' };

  // 🔷 Account Info
  worksheet.mergeCells('A2:G2');
  worksheet.getCell('A2').value = `Account: ${this.accountName}`;
  worksheet.getCell('A2').font = { bold: true };

  worksheet.mergeCells('A3:G3');
  worksheet.getCell('A3').value = `From: ${this.fromDate || '-'} To: ${this.toDate || '-'}`;

  // 🔷 Empty Row
  worksheet.addRow([]);

  // 🔷 Header Row
  const headerRow = worksheet.addRow([
    'Date', 'Particulars', 'Vch.Type', 'Debit', 'Credit', 'Balance', 'Type'
  ]);

  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9E1F2' }
    };
  });

  // 🔷 Opening Balance Row
  const openingRow = worksheet.addRow([
    '-',
    'Opening Balance',
    '-',
    this.openingType === 'DR' ? this.openingBalance : '',
    this.openingType === 'CR' ? this.openingBalance : '',
    this.openingBalance,
    this.openingType
  ]);

  this.applyBorder(openingRow);

  // 🔷 Ledger Data
  this.listOfReceiptData.forEach((item: any) => {
    const row = worksheet.addRow([
      this.formatExcelDate(item.ReceiptDate),
      item.Narration || '---',
      item.VoucherNo,
      item.Debit > 0 ? item.Debit : '',
      item.Credit > 0 ? item.Credit : '',
      item.Balance,
      item.BalanceType
    ]);

    this.applyBorder(row);
  });

  // 🔷 Total Row
  const totalRow = worksheet.addRow([
    '',
    'TOTAL',
    '',
    this.totalDR,
    this.totalCR,
    this.closingBalance,
    this.closingType
  ]);

  totalRow.font = { bold: true };
  this.applyBorder(totalRow);

  // ✅ 🔷 LIMIT PRINT AREA (IMPORTANT)
  worksheet.pageSetup.printArea = `A1:G${worksheet.rowCount}`;

  // 🔷 Download
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    FileSaver.saveAs(blob, `Ledger_${this.accountName}.xlsx`);
  });
}


}
