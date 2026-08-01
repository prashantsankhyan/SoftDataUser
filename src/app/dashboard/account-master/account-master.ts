import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllApiService } from '../../_core/_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiUrl } from '../../_core/apiUrl';
import { AddEditAccount } from './add-edit-account/add-edit-account';
import { DeleteAccount } from './delete-account/delete-account';

@Component({
  selector: 'app-account-master',
  imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule],
  templateUrl: './account-master.html',
  styleUrl: './account-master.scss',
})
export class AccountMaster {
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

getAllData() {
  this.api
    .getAllDataId(ApiUrl.listOfAccount, this.companyId)
    .subscribe((res: any) => {

      if (!res || !Array.isArray(res.data)) {
        this.listOfData = [];
        return;
      }

      const filtered = res.data.filter(
        (x: any) => x.companyId === 0 || x.companyId === this.companyId
      );

      this.originalList = filtered.sort((a: any, b: any) =>
        a.accountName.localeCompare(b.accountName)
      );

      this.listOfData = [...this.originalList];
      this.cdr.detectChanges();
    });
}

applyFilter() {

  const search = this.searchText.trim().toLowerCase();

  this.listOfData = [...this.originalList].sort((a: any, b: any) => {

    const getRank = (item: any) => {

      const name = (item.accountName || '').toLowerCase();
      const phone = String(item.phone || '').toLowerCase();
      const gst = (item.gstNo || '').toLowerCase();

      if (name.startsWith(search)) return 1;
      if (name.includes(search)) return 2;

      if (phone.startsWith(search)) return 3;
      if (phone.includes(search)) return 4;

      if (gst.startsWith(search)) return 5;
      if (gst.includes(search)) return 6;

      return 7;
    };

    return getRank(a) - getRank(b) ||
           (a.accountName || '').localeCompare(b.accountName || '');
  });

  if (search) {
    this.listOfData = this.listOfData.filter(item => {

      const name = (item.accountName || '').toLowerCase();
      const phone = String(item.phone || '').toLowerCase();
      const gst = (item.gstNo || '').toLowerCase();

      return (
        name.includes(search) ||
        phone.includes(search) ||
        gst.includes(search)
      );
    });
  }

  this.selectedRowIndex = this.listOfData.length === 1 ? 0 : -1;
}
// filterByAlphabet(letter: string) {
//   this.searchText = '';

//   this.listOfData = this.originalList.filter(item =>
//     item.accountName?.toUpperCase().startsWith(letter)
//   );
//    if (this.listOfData.length === 1) {
//     this.selectedRowIndex = 0;
//   } else {
//     this.selectedRowIndex = -1;
//   }
// }

filterByAlphabet(letter: string) {

  this.searchText = '';

  const search = letter.trim().toUpperCase();

  const getRank = (item: any) => {

    const name = (item.accountName || '').trim().toUpperCase();
    const phone = String(item.phone || item.mobileNo || '').trim().toUpperCase();
    const gst = (item.gstNo || '').trim().toUpperCase();

    if (name.startsWith(search)) return 1;
    if (name.includes(search)) return 2;

    if (phone.startsWith(search)) return 3;
    if (phone.includes(search)) return 4;

    if (gst.startsWith(search)) return 5;
    if (gst.includes(search)) return 6;

    return 7;
  };

  this.listOfData = [...this.originalList].sort((a, b) => {

    const rankA = getRank(a);
    const rankB = getRank(b);

    if (rankA !== rankB) {
      return rankA - rankB;
    }

    return (a.accountName || '')
      .trim()
      .localeCompare((b.accountName || '').trim());
  });

  this.selectedRowIndex = this.listOfData.length === 1 ? 0 : -1;
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
  const dialogRef = this.dialog.open(AddEditAccount, {
    width: '95vw',
    maxWidth: '1500px',
   maxHeight: '100vh',   // only limit, not fixed height
    data: data || null
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
       this.getAllData(); // reload list automatically
    }
  });
}

deleteData(row: any) {
  const dialogRef = this.dialog.open(DeleteAccount, {
    width: '360px',
    disableClose: true,
    data:row.id
  });
}
}
