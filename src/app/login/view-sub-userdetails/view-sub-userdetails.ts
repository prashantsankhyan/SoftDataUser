import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllApiService } from '../../_core/_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../_core/apiUrl';
import { finalize } from 'rxjs';
import { CreateSubUser } from '../create-sub-user/create-sub-user';
import { Router } from '@angular/router';
import { DeleteSubUser } from '../delete-sub-user/delete-sub-user';
interface LoggedUser {
  id: number;
  clientName: string;
  phoneNumber: string;
  email: string;
  package: string;
  isActive: boolean;
}


@Component({
  selector: 'app-view-sub-userdetails',
  imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule],
  templateUrl: './view-sub-userdetails.html',
  styleUrl: './view-sub-userdetails.scss',
})
export class ViewSubUserdetails {
 showSpinner = true;
  listOfData: any = [];
  searchText = '';
  loggedUser:any;
  clinetId:any;
  companyId:any;
  companyName:any

  clientName:any;
  phoneNumber:any;

  constructor(
    private api: AllApiService,
    private cdr: ChangeDetectorRef,
     private dialog: MatDialog,
     private router:Router
 
  ) {}

  ngOnInit(): void {
     const user = localStorage.getItem('loggedUser');

     

      


     

  if (user) {
    this.loggedUser = JSON.parse(user);
    this.clinetId = this.loggedUser.id;
    this.clientName = this.loggedUser.clientName;
    this.phoneNumber = this.loggedUser.phoneNumber;
     this.companyId = this.loggedUser.companyId;
      this.companyName = this.loggedUser.companyName;
    
    console.log('User ID:', this.companyId);
    this.getAllData();
  }
    
  }
getAllData() {
  this.api.getAllDataId(ApiUrl.getSubUser, this.companyId)
    .subscribe(data => {
      const obj = data as any;
      this.listOfData = obj?.data ?? [];

      // 🔑 force Angular to re-check safely
      this.cdr.detectChanges();
    });
}
get filteredList() {
  if (!this.searchText) {
    return this.listOfData;
  }

  const text = this.searchText.toLowerCase();

  return this.listOfData.filter((user:any) =>
    user.username?.toLowerCase().includes(text) ||
    user.phoneNumber?.toLowerCase().includes(text) ||
    user.permissions?.toLowerCase().includes(text)
  );
}

  goBack() {
  this.router.navigateByUrl('/loging');
}


 addEditData(data?: any) {

  const dialogRef = this.dialog.open(CreateSubUser, {
    width: '600px',
    data: {
      editData: data || null,
      companyId: this.loggedUser.companyId,
      clientName: this.loggedUser.clientName,
      phoneNumber: this.loggedUser.phoneNumber,
      clientId:this.loggedUser.id
      
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.getAllData(); // reload list
    }
  });
}


deleteData(row: any) {
  const dialogRef = this.dialog.open(DeleteSubUser, {
    width: '360px',
    disableClose: true,
    data:row.id
  });

  
}


}
