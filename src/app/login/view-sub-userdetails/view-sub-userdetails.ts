import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllApiService } from '../../_core/_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiUrl } from '../../_core/apiUrl';
import { CreateSubUser } from '../create-sub-user/create-sub-user';
import { Router } from '@angular/router';
import { DeleteSubUser } from '../delete-sub-user/delete-sub-user';

@Component({
  selector: 'app-view-sub-userdetails',
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './view-sub-userdetails.html',
  styleUrl: './view-sub-userdetails.scss'
})
export class ViewSubUserdetails {

  listOfData: any[] = [];
  clinetListData: any[] = [];

  searchText = '';

  loggedUser: any;

  clinetId = 0;
  companyId = 0;

  companyName = '';
  clientName = '';
  phoneNumber = '';

  constructor(
    private api: AllApiService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  // =====================================================
  // INIT
  // =====================================================

ngOnInit(): void {

  const user = localStorage.getItem('loggedUser');

  if (!user) {
    return;
  }

  try {

    this.loggedUser = JSON.parse(user);

    this.clinetId =
      Number(this.loggedUser.id) || 0;

    this.clientName =
      this.loggedUser.clientName || '';

    this.phoneNumber =
      this.loggedUser.phoneNumber || '';

    this.companyId =
      Number(this.loggedUser.companyId) || 0;

    this.companyName =
      this.loggedUser.companyName || '';

    // FIRST load company
    this.getCompanyDetailByClient();

  } catch (error) {

    console.error(
      'Logged user parse error:',
      error
    );

  }
}


  // =====================================================
  // GET COMPANY LIST
  // =====================================================

  getCompanyDetailByClient(): void {

  if (!this.clinetId) {
    return;
  }

  this.api
    .getAllDataId(
      ApiUrl.getCompanyByClinetId,
      this.clinetId
    )
    .subscribe({

      next: (response: any) => {

        this.clinetListData =
          Array.isArray(response?.data)
            ? response.data
            : [];

        console.log(
          'Company List:',
          this.clinetListData
        );

        if (
          this.clinetListData.length === 0
        ) {

          this.listOfData = [];

          return;
        }

        // Find company saved during login
        const selectedCompany =
          this.clinetListData.find(
            company =>
              Number(company.id) ===
              Number(this.companyId)
          );

        if (selectedCompany) {

          this.companyId =
            Number(selectedCompany.id);

          this.companyName =
            selectedCompany.companyName || '';

        } else {

          // If saved company not found,
          // select first company
          const firstCompany =
            this.clinetListData[0];

          this.companyId =
            Number(firstCompany.id);

          this.companyName =
            firstCompany.companyName || '';
        }

        // SECOND API CALL
        // Only after company API completes
        this.getAllData();

      },

      error: (error) => {

        console.error(
          'Company API Error:',
          error
        );

        this.clinetListData = [];
        this.listOfData = [];

      }

    });
}


  // =====================================================
  // COMPANY CHANGE
  // =====================================================

onCompanyChange(companyId: any): void {

  this.companyId =
    Number(companyId) || 0;

  const company =
    this.clinetListData.find(
      x =>
        Number(x.id) ===
        this.companyId
    );

  if (!company) {
    return;
  }

  this.companyName =
    company.companyName || '';

  this.searchText = '';

  // Load data for newly selected company
  this.getAllData();
}


  // =====================================================
  // GET SUB USERS
  // =====================================================

  getAllData(): void {

    if (!this.companyId) {
      return;
    }

    this.api
      .getAllDataId(
        ApiUrl.getSubUser,
        this.companyId
      )
      .subscribe({

        next: (response: any) => {

          this.listOfData =
            response?.data || [];

          console.log(
            'Sub Users:',
            this.listOfData
          );
        },

        error: (error) => {

          console.error(
            'Sub User API Error:',
            error
          );

          this.listOfData = [];
        }

      });
  }


  // =====================================================
  // SEARCH
  // =====================================================

  get filteredList(): any[] {

    if (!this.searchText) {
      return this.listOfData;
    }

    const text =
      this.searchText.toLowerCase();

    return this.listOfData.filter(user =>
      String(user.username || '')
        .toLowerCase()
        .includes(text)

      ||

      String(user.phoneNumber || '')
        .toLowerCase()
        .includes(text)

      ||

      String(user.permissions || '')
        .toLowerCase()
        .includes(text)
    );
  }


  // =====================================================
  // ADD / EDIT
  // =====================================================

  addEditData(data?: any): void {

    const dialogRef =
      this.dialog.open(
        CreateSubUser,
        {
          width: '600px',
          disableClose: true,

          data: {

            editData:
              data || null,

            companyId:
              this.companyId,

            companyName:
              this.companyName,

            clientId:
              this.clinetId,

            clientName:
              this.clientName,

            phoneNumber:
              this.phoneNumber
          }
        }
      );

    dialogRef
      .afterClosed()
      .subscribe(result => {

        if (result) {
          this.getAllData();
        }

      });
  }


  // =====================================================
  // DELETE
  // =====================================================

  deleteData(row: any): void {

    const dialogRef =
      this.dialog.open(
        DeleteSubUser,
        {
          width: '360px',
          disableClose: true,
          data: row.id
        }
      );

    dialogRef
      .afterClosed()
      .subscribe(result => {

        if (result) {
          this.getAllData();
        }

      });
  }


  // =====================================================
  // BACK
  // =====================================================

  goBack(): void {

    this.router.navigateByUrl(
      '/loging'
    );

  }

}