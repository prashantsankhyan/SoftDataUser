import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllApiService } from '../../_core/_service/all-api.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiUrl } from '../../_core/apiUrl';
import { startWith, map } from 'rxjs/operators';
import { AddEditItemMaster } from '../item-master/add-edit-item-master/add-edit-item-master';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@Component({
  selector: 'app-stock-management',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMatSelectSearchModule
  ],
  templateUrl: './stock-management.html',
  styleUrl: './stock-management.scss',
})
export class StockManagement {

  permission: any;

  itemId: number | null = null;
  searchText: string = '';
  companyId: any;

  alphabets: string[] =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  listOfData: any[] = [];
  originalList: any[] = [];

  // Stock summary
  stockData: any[] = [];

  // Purchase / Sale transactions
  transactions: any[] = [];

  filteredItems: any[] = [];

  itemSearchCtrl = new FormControl('');

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
    this.getAllData();
  }

  getLoggedUser() {

    const user = localStorage.getItem('loggedUser');

    this.companyId =
      JSON.parse(user || '{}').companyId;

    return user ? JSON.parse(user) : null;
  }

  getPermissions() {
    this.permission =
      localStorage.getItem('permissions');
  }

  getAllData() {

    this.api
      .getAllDataId(
        ApiUrl.listOfItemMaster,
        this.companyId
      )
      .subscribe((res: any) => {

        if (!res || !Array.isArray(res.data)) {

          this.listOfData = [];
          this.originalList = [];
          this.filteredItems = [];

          return;
        }

        const filtered = res.data.filter(
          (x: any) =>
            x.companyId === 0 ||
            x.companyId === this.companyId
        );

        // FIXED SORT
        this.originalList = filtered.sort(
          (a: any, b: any) =>
            (a.itemName || '').localeCompare(
              b.itemName || ''
            )
        );

        this.listOfData = [
          ...this.originalList
        ];

        this.filteredItems = [
          ...this.originalList
        ];

        this.setupItemSearch();

        this.cdr.detectChanges();
      });
  }

  setupItemSearch() {

    this.itemSearchCtrl.valueChanges
      .pipe(
        startWith(''),
        map(value => {

          const search =
            (value || '')
              .toString()
              .trim()
              .toLowerCase();

          return this.originalList.filter(
            (item: any) =>
              (item.itemName || '')
                .toLowerCase()
                .includes(search)
          );

        })
      )
      .subscribe(items => {

        this.filteredItems = items;

      });
  }

  onItemChange(itemId: number) {

    if (!itemId) {

      this.itemId = null;

      this.stockData = [];
      this.transactions = [];

      return;
    }

    this.itemId = itemId;

    this.getStockManagementData(itemId);
  }

  getStockManagementData(itemId: number) {

    this.itemId = itemId;

    this.api
      .getItemWiseStock(
        ApiUrl.stockManagement,
        this.companyId,
        itemId
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Stock Response:',
            res
          );

          // =========================
          // STOCK SUMMARY
          // =========================

          if (
            res &&
            Array.isArray(res.data)
          ) {

            this.stockData = res.data;

          } else {

            this.stockData = [];

          }

          // =========================
          // TRANSACTIONS
          // =========================

          if (
            res &&
            Array.isArray(res.transactions)
          ) {

            this.transactions =
              res.transactions;

          } else {

            this.transactions = [];

          }

          this.cdr.detectChanges();
        },

        error: (err) => {

          console.error(
            'Stock API Error:',
            err
          );

          this.stockData = [];
          this.transactions = [];

        }

      });
  }

  filterByAlphabet(letter: string): void {

    this.itemSearchCtrl.setValue('');

    this.filteredItems =
      this.originalList.filter(
        (item: any) =>
          (item.itemName || '')
            .toUpperCase()
            .startsWith(letter)
      );

    this.listOfData = [
      ...this.filteredItems
    ];

    this.selectedRowIndex =
      this.listOfData.length === 1
        ? 0
        : -1;
  }

  addEditData(data?: any) {

    const dialogRef =
      this.dialog.open(
        AddEditItemMaster,
        {
          width: '95vw',
          maxWidth: '1500px',
          maxHeight: '100vh',
          data: data || null
        }
      );

    dialogRef.afterClosed()
      .subscribe(result => {

        if (result) {

          this.getAllData();

        }

      });
  }

  // =========================
  // HELPERS
  // =========================

  getTransactionClass(type: string): string {

    return type?.toLowerCase() === 'purchase'
      ? 'purchase'
      : 'sale';
  }

  getTransactionIcon(type: string): string {

    return type?.toLowerCase() === 'purchase'
      ? 'shopping_cart'
      : 'point_of_sale';
  }

}