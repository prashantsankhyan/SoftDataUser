import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllApiService } from '../../_core/_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiUrl } from '../../_core/apiUrl';

import { DeleteGroupMaster } from '../group-master/delete-group-master/delete-group-master';
import { AddEditUnitMaster } from './add-edit-unit-master/add-edit-unit-master';
import { DeleteUnitMaster } from './delete-unit-master/delete-unit-master';


@Component({
  selector: 'app-unit-master',
  imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule],
  templateUrl: './unit-master.html',
  styleUrl: './unit-master.scss',
})
export class UnitMaster {
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
    .getAllDataId(ApiUrl.listOfUnitMaster, this.companyId)
    .subscribe((res: any) => {

      if (!res || !Array.isArray(res.data)) {
        this.listOfData = [];
        return;
      }

      const filtered = res.data.filter(
        (x: any) => x.companyId === 0 || x.companyId === this.companyId
      );

      this.originalList = filtered.sort((a: any, b: any) =>
        a.unitName.localeCompare(b.unitName)
      );

      this.listOfData = [...this.originalList];
      this.cdr.detectChanges();
    });
}

applyFilter() {
  const text = this.searchText.toLowerCase();

  this.listOfData = this.originalList.filter(item =>
    item.unitName?.toLowerCase().includes(text)
  );
}
filterByAlphabet(letter: string) {
  this.searchText = '';

  this.listOfData = this.originalList.filter(item =>
    item.unitName?.toUpperCase().startsWith(letter)
  );
}


resetFilter() {
  this.searchText = '';
  this.listOfData = this.originalList;
}


addEditData(data?: any) {
  const dialogRef = this.dialog.open(AddEditUnitMaster, {
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
  const dialogRef = this.dialog.open(DeleteUnitMaster, {
    width: '360px',
    disableClose: true,
    data:row.id
  });
}

}
