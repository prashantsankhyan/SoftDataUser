import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllApiService } from '../../_core/_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiUrl } from '../../_core/apiUrl';
import { AddEditPurchaseHeading } from './add-edit-purchase-heading/add-edit-purchase-heading';
import { DeletePurchaseHeading } from './delete-purchase-heading/delete-purchase-heading';

@Component({
  selector: 'app-purchase-heading',
  imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule],
  templateUrl: './purchase-heading.html',
  styleUrl: './purchase-heading.scss',
})
export class PurchaseHeading {
showSpinner = true;
companyId:any;
permission:any;
searchText: string = '';
alphabets: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

listOfData: any[] = [];        // filtered data (shown)
originalList: any[] = [];      // full data (backup)

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
    .getAllDataId(ApiUrl.getPurchaaseHeadingByCompanyId, this.companyId)
    .subscribe((res: any) => {

      if (!res || !Array.isArray(res.data)) {
        this.listOfData = [];
        return;
      }

      const filtered = res.data.filter(
        (x: any) => x.companyId === 0 || x.companyId === this.companyId
      );

      this.originalList = filtered.sort((a: any, b: any) =>
        a.typeOfPurchase.localeCompare(b.typeOfPurchase)
      );

      this.listOfData = [...this.originalList];
      this.cdr.detectChanges();
    });
}

applyFilter() {
  const text = this.searchText.toLowerCase();

  this.listOfData = this.originalList.filter(item =>
    item.typeOfPurchase?.toLowerCase().includes(text)
  );
}
filterByAlphabet(letter: string) {
  this.searchText = '';

  this.listOfData = this.originalList.filter(item =>
    item.typeOfPurchase?.toUpperCase().startsWith(letter)
  );
}


resetFilter() {
  this.searchText = '';
  this.listOfData = this.originalList;
}


addEditData(data?: any) {
  const dialogRef = this.dialog.open(AddEditPurchaseHeading, {
    width: '500px',
    data: data || null
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
       this.getAllData(); // reload list automatically
    }
  });
}

deleteData(row: any) {
  const dialogRef = this.dialog.open(DeletePurchaseHeading, {
    width: '360px',
    disableClose: true,
    data:row.id
  });
}
}

