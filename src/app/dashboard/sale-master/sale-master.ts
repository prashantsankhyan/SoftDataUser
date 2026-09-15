import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllApiService } from '../../_core/_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiUrl } from '../../_core/apiUrl';
import { DeleteSale } from './delete-sale/delete-sale';
import { AddEditSale } from './add-edit-sale/add-edit-sale';
import { AddEditSaleWithChanges } from './add-edit-sale-with-changes/add-edit-sale-with-changes';

@Component({
  selector: 'app-sale-master',
 imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule],
  templateUrl: './sale-master.html',
  styleUrl: './sale-master.scss',
})
export class SaleMaster {
showSpinner = true;
companyId: any;
permissionForm!: FormGroup;
permission: any;
searchText: string = '';
alphabets: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

listOfData: any[] = [];
originalList: any[] = [];
itemWiseList: any[] = [];
selectedRowIndex = -1;
constructor(
  private api: AllApiService,
  private cdr: ChangeDetectorRef,
  private dialog: MatDialog,
  private router: Router
) {}

ngOnInit(): void {
  this.getLoggedUser();
  this.getPermissions();

  this.permissionForm = new FormGroup({
    excludedOrIncluded: new FormControl(false)
  });

  // Load toggle from backend
  this.loadToggleValue();

  // Listen toggle change
this.permissionForm
  .get('excludedOrIncluded')
  ?.valueChanges.subscribe(() => {
    this.callAddEditSalePermission();
  });
}

/* ======================================================
   COMMON REFRESH METHOD (MAIN FIX)
====================================================== */
refreshList() {

  if (!this.companyId) return;

  // Always load base data first
  this.getAllData();
}

/* ======================================================
   USER + PERMISSION
====================================================== */

getLoggedUser() {
  const user = JSON.parse(localStorage.getItem('loggedUser') || '{}');
  this.companyId = user?.companyId;
  return user;
}

getPermissions() {
  this.permission = localStorage.getItem('permissions');
}

/* ======================================================
   LOAD TOGGLE VALUE
====================================================== */
loadToggleValue() {
  const body = {
    companyId: this.companyId,
    excludedOrIncluded: null
  };

  this.api
    .postData(ApiUrl.permissionIncludeAndExclude, body)
    .subscribe((res: any) => {

      if (res?.success) {

        const toggleValue = !!res.value; // force boolean

        this.permissionForm.patchValue(
          { excludedOrIncluded: toggleValue },
          { emitEvent: false }
        );

        // 🔥 AFTER toggle set, manually call refresh
        this.refreshList();
      }
    });
}

/* ======================================================
   LOAD NORMAL DATA
====================================================== */

getAllData() {
  this.showSpinner = true;

  this.api
    .getAllDataId(ApiUrl.listOfSaleData, this.companyId)
    .subscribe({
      next: (res: any[]) => {
        if (!Array.isArray(res)) {
          this.listOfData = [];
          return;
        }

        const filtered = res.filter(
          x => x.companyId === 0 || x.companyId === this.companyId
        );

        this.setSortedData(filtered);
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.showSpinner = false;
      }
    });
}

/* ======================================================
   LOAD PERMISSION FILTERED DATA
====================================================== */

callAddEditSalePermission() {

  const body = {
    companyId: this.companyId,
    excludedOrIncluded:
      this.permissionForm.get('excludedOrIncluded')?.value
  };

  this.api
    .postData(ApiUrl.permissionIncludeAndExclude, body)
    .subscribe(() => {

      // after saving toggle setting
      this.refreshList();
    });
}

/* ======================================================
   COMMON SORT METHOD
====================================================== */

setSortedData(data: any[]) {
  this.originalList = data.sort((a: any, b: any) => {

    const dateA = a.invoiceDate ? new Date(a.invoiceDate).getTime() : 0;
    const dateB = b.invoiceDate ? new Date(b.invoiceDate).getTime() : 0;

    // 🔥 First sort by invoiceDate (Newest first)
    if (dateB !== dateA) {
      return dateB - dateA;
    }

    // 🔥 If same date → sort by saleInvoiceId (Highest first)
    return (b.saleInvoiceId || 0) - (a.saleInvoiceId || 0);
  });

  this.listOfData = [...this.originalList];
  this.cdr.detectChanges();
}

/* ======================================================
   FILTERING
====================================================== */

// applyFilter() {
//   const text = this.searchText.toLowerCase();

//   this.listOfData = this.originalList.filter(item =>
//     item.accountName?.toLowerCase().includes(text)
//   );
// }

applyFilter() {
  const text = this.searchText.toLowerCase().trim();

  this.listOfData = this.originalList.filter(item => {

    let formattedDate = '';

    if (item.invoiceDate) {
      const d = new Date(item.invoiceDate);

      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();

      formattedDate = `${day}-${month}-${year}`;
    }

    // Allow both formats in search
    const normalizedSearch = text.replace(/\//g, '-');
    const normalizedDate = formattedDate.replace(/\//g, '-');

    const fullData =
      `${item.accountName} ${item.invoiceNo} ${normalizedDate} ${item.subTotal}`
      .toLowerCase();

    return fullData.includes(normalizedSearch);
  });
  
    if (this.listOfData.length === 1) {
    this.selectedRowIndex = 0;
  } else {
    this.selectedRowIndex = -1;
  }
   
}
filterByAlphabet(letter: string) {
  this.searchText = '';

  this.listOfData = this.originalList.filter(item =>
    item.accountName?.toUpperCase().startsWith(letter)
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
  if (this.selectedRowIndex >= 0) {
    this.addEditData(this.listOfData[this.selectedRowIndex]);
  }
}
/* ======================================================
   ROUTING
====================================================== */

goToPdf(data: any) {
  this.router.navigate(
    ['/dashboard/sale/salePdf', data.saleInvoiceId]
  );
}

/* ======================================================
   DIALOGS
====================================================== */

addEditData(data?: any) {
  const dialogRef = this.dialog.open(AddEditSale, {
    width: '99vw',
    maxWidth: '2000px',
    maxHeight: '95vh',
    
    disableClose: false, // allow close on outside click
    data: data || null
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.refreshList();   // 🔥 keeps toggle state
    }
  });
    dialogRef.backdropClick().subscribe(() => {
    this.refreshList();
  });
}

addEditDataWithChanges(data?: any) {
  const dialogRef = this.dialog.open(AddEditSaleWithChanges, {
    width: '99vw',
    maxWidth: '2000px',
    maxHeight: '95vh',
    
    disableClose: false, // allow close on outside click
    data: data || null
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.refreshList();   // 🔥 keeps toggle state
    }
  });
    dialogRef.backdropClick().subscribe(() => {
    this.refreshList();
  });
}

deleteData(row: any) {
  const dialogRef = this.dialog.open(DeleteSale, {
    width: '360px',
    disableClose: true,
    data: row.saleInvoiceId
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.refreshList();   // 🔥 keeps toggle state
    }
  });
}

/* ======================================================
   GETTER
====================================================== */

get isExcluded(): boolean {
  return this.permissionForm.get('excludedOrIncluded')?.value;
}
}
