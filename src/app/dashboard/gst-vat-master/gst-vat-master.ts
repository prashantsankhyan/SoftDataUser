import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllApiService } from '../../_core/_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiUrl } from '../../_core/apiUrl';
import { AddEditGstVatMaster } from './add-edit-gst-vat-master/add-edit-gst-vat-master';
import { DeleteGstVatMaster } from './delete-gst-vat-master/delete-gst-vat-master';

@Component({
  selector: 'app-gst-vat-master',
  imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule],
  templateUrl: './gst-vat-master.html',
  styleUrl: './gst-vat-master.scss',
})
export class GstVatMaster {
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
    .getAllDataId(ApiUrl.listOfGstVat, this.companyId)
    .subscribe((res: any) => {

      if (!res || !Array.isArray(res.data)) {
        this.originalList = [];
        this.listOfData = [];
        return;
      }

      // SQL procedure already handles:
      // 1-4 = common records
      // Other records = current company only
      // Ordering = 1,2,3,4 then newest ID first

      this.originalList = [...res.data];

      this.listOfData = [...this.originalList];

      this.cdr.detectChanges();
    });
}

applyFilter() {
  const text = this.searchText.toLowerCase();

  this.listOfData = this.originalList.filter(item =>
    item.className?.toLowerCase().includes(text)
  );
}
filterByAlphabet(letter: string) {
  this.searchText = '';

  this.listOfData = this.originalList.filter(item =>
    item.className?.toUpperCase().startsWith(letter)
  );
}


resetFilter() {
  this.searchText = '';
  this.listOfData = this.originalList;
}


addEditData(data?: any) {
  const dialogRef = this.dialog.open(AddEditGstVatMaster, {
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
  const dialogRef = this.dialog.open(DeleteGstVatMaster, {
    width: '360px',
    disableClose: true,
    data:row.id
  });
}
}
