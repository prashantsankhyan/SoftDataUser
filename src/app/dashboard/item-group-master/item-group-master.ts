import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllApiService } from '../../_core/_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiUrl } from '../../_core/apiUrl';
import { AddEditItemGroupMaster } from './add-edit-item-group-master/add-edit-item-group-master';
import { DeleteGroupMaster } from '../group-master/delete-group-master/delete-group-master';
import { DeleteItemGroup } from './delete-item-group/delete-item-group';

@Component({
  selector: 'app-item-group-master',
  imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule],
  templateUrl: './item-group-master.html',
  styleUrl: './item-group-master.scss',
})
export class ItemGroupMaster {
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
    .getAllDataId(ApiUrl.getItemGroupBy, this.companyId)
    .subscribe((res: any) => {

      if (!res || !Array.isArray(res.data)) {
        this.listOfData = [];
        return;
      }

      const filtered = res.data.filter(
        (x: any) => x.companyId === 0 || x.companyId === this.companyId
      );

      this.originalList = filtered.sort((a: any, b: any) =>
        a.itemGroupName.localeCompare(b.itemGroupName)
      );

      this.listOfData = [...this.originalList];
      this.cdr.detectChanges();
    });
}

// applyFilter() {
//   const text = this.searchText.toLowerCase();

//   this.listOfData = this.originalList.filter(item =>
//     item.itemGroupName?.toLowerCase().includes(text)
//   );
//      if (this.listOfData.length === 1) {
//     this.selectedRowIndex = 0;
//   } else {
//     this.selectedRowIndex = -1;
//   }
// }


applyFilter() {

  const search = this.searchText.trim().toLowerCase();

  this.listOfData = [...this.originalList]
    .filter((item: any) =>
      (item.itemGroupName || '').toLowerCase().includes(search)
    )
    .sort((a: any, b: any) => {

      const aName = (a.itemGroupName || '').toLowerCase();
      const bName = (b.itemGroupName || '').toLowerCase();

      const getRank = (name: string) => {
        if (name.startsWith(search)) return 1;
        if (name.includes(search)) return 2;
        return 3;
      };

      const rankA = getRank(aName);
      const rankB = getRank(bName);

      if (rankA !== rankB) {
        return rankA - rankB;
      }

      return aName.localeCompare(bName);
    });

  this.selectedRowIndex = this.listOfData.length === 1 ? 0 : -1;
}
filterByAlphabet(letter: string) {
  this.searchText = '';

  this.listOfData = this.originalList.filter(item =>
    item.itemGroupName?.toUpperCase().startsWith(letter)
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
  const dialogRef = this.dialog.open(AddEditItemGroupMaster, {
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
  const dialogRef = this.dialog.open(DeleteItemGroup, {
    width: '360px',
    disableClose: true,
    data:row.id
  });
}

}
