import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxPrintModule } from 'ngx-print';

import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

import { MaterialModule } from '../../material.module';
import { ApiUrl } from '../../_core/apiUrl';
import { AllApiService } from '../../_core/_service/all-api.service';

import { AddEditAccount } from '../account-master/add-edit-account/add-edit-account';
import { AddEditPaymentReceipt } from '../payment-receipt/add-edit-payment-receipt/add-edit-payment-receipt';
import { AddEditSale } from '../sale-master/add-edit-sale/add-edit-sale';


/* =========================================================
   LEDGER MODEL
========================================================= */

interface AccountLedgerRow {

  date: Date | string | null;

  particulars: string;

  voucherType: string;

  voucherNo: string;

  qty: number;

  items: string;

  debit: number;

  credit: number;

  balance: number;

  balanceType: string;
}


@Component({
  selector: 'app-sale-purchase-ladger-account-base',

  standalone: true,

  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPrintModule
  ],

  templateUrl:
    './sale-purchase-ladger-account-base.html',

  styleUrl:
    './sale-purchase-ladger-account-base.scss'
})
export class SalePurchaseLadgerAccountBase
  implements OnInit {


  /* =========================================================
     BASIC
  ========================================================= */

  showSpinner = false;

  companyId = 0;

  permission: any;

  searchText = '';


  /* =========================================================
     ACCOUNT LIST
  ========================================================= */

  listOfData: any[] = [];

  originalList: any[] = [];

  selectedAccount: any = null;

  accountSearchText = '';


  /* =========================================================
     LEDGER
  ========================================================= */

  listOfReceiptData: AccountLedgerRow[] = [];

  ledgerSearchText = '';

  fromDate = '';

  toDate = '';


  /* =========================================================
     ACCOUNT DETAILS
  ========================================================= */

  _id = 0;

  accountName = '';

  openingBalance = 0;

  openingType = '';

  closingBalance = 0;

  closingType = '';

  totalCR = 0;

  totalDR = 0;

  totalQty = 0;

  grandTotal = 0;


  /* =========================================================
     CONSTRUCTOR
  ========================================================= */

  constructor(
    private api: AllApiService,

    private cdr: ChangeDetectorRef,

    private dialog: MatDialog,

    private router: Router
  ) {}


  /* =========================================================
     INIT
  ========================================================= */

  ngOnInit(): void {

    this.getLoggedUser();

    this.getPermissions();

    this.getAllData();
  }


  /* =========================================================
     LOGGED USER
  ========================================================= */

  getLoggedUser(): any {

    const user =
      localStorage.getItem('loggedUser');

    if (!user) {

      console.warn(
        'loggedUser not found'
      );

      return null;
    }

    try {

      const parsedUser =
        JSON.parse(user);

      this.companyId =
        Number(
          parsedUser?.companyId || 0
        );

      return parsedUser;

    } catch (error) {

      console.error(
        'loggedUser JSON parse error:',
        error
      );

      return null;
    }
  }


  /* =========================================================
     PERMISSION
  ========================================================= */

  getPermissions(): void {

    this.permission =
      localStorage.getItem('permissions');
  }


  /* =========================================================
     GET ACCOUNT LIST
  ========================================================= */

  getAllData(): void {

    if (!this.companyId) {

      console.warn(
        'CompanyId is missing'
      );

      return;
    }

    this.showSpinner = true;

    this.api
      .getAllDataId(
        ApiUrl.listOfAccount,
        this.companyId
      )
      .subscribe({

        next: (res: any) => {

          if (
            !res?.data ||
            !Array.isArray(res.data)
          ) {

            this.listOfData = [];

            this.originalList = [];

            return;
          }


          const filtered =
            res.data.filter(
              (x: any) =>
                Number(x.companyId) === 0 ||
                Number(x.companyId) === this.companyId
            );


          this.originalList =
            filtered.sort(
              (a: any, b: any) =>
                (a.accountName || '')
                  .localeCompare(
                    b.accountName || ''
                  )
            );


          this.listOfData =
            [...this.originalList];
        },

        error: (err: any) => {

          console.error(
            'Account API Error:',
            err
          );

          this.listOfData = [];
        },

        complete: () => {

          this.showSpinner = false;

          this.cdr.detectChanges();
        }
      });
  }


  /* =========================================================
     ACCOUNT SEARCH
  ========================================================= */

  applyFilter(): void {

    const text =
      this.accountSearchText
        .trim()
        .toLowerCase();


    /* Clear search */

    if (!text) {

      this.listOfData =
        [...this.originalList];

      this.selectedAccount = null;

      this.clearLedgerData();

      return;
    }


    /* Search */

    this.listOfData =
      this.originalList.filter(
        (account: any) =>
          (account.accountName || '')
            .toLowerCase()
            .includes(text)
      );
  }


  /* =========================================================
     ACCOUNT SELECT
  ========================================================= */

  onSelectAccount(account: any): void {

    if (!account) {
      return;
    }


    this.selectedAccount =
      account;


    this.accountSearchText =
      account.accountName || '';


    this._id =
      Number(
        account._id ||
        account.id ||
        0
      );


    this.accountName =
      account.accountName || '';


    /* Close dropdown */

    this.listOfData = [];


    if (!this._id) {

      console.warn(
        'AccountId is missing'
      );

      return;
    }


    /* Load ledger */

    this.getAccountLedger(
      this._id
    );
  }


  /* =========================================================
     DISPLAY ACCOUNT
     ========================================================= */

  displayAccount(account: any): string {

    if (!account) {
      return '';
    }

    if (typeof account === 'string') {
      return account;
    }

    return account.accountName || '';
  }


  /* =========================================================
     GET ACCOUNT LEDGER
  ========================================================= */

  getAccountLedger(
    accountId: number
  ): void {

    if (!accountId) {

      console.warn(
        'AccountId is missing'
      );

      return;
    }


   this.showSpinner = false;


    const params: any = {

      companyId:
        this.companyId,

      accountId:
        accountId,

      fromDate:
        this.convertToApiDate(
          this.fromDate
        ),

      toDate:
        this.convertToApiDate(
          this.toDate
        )
    };


    console.log(
      'Account Ledger Params:',
      params
    );


    this.api
      .getWithParams(
        ApiUrl.salePurchaseLadgerAccountBase,
        params
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Account Ledger Response:',
            res
          );


          if (
            !res?.success ||
            !Array.isArray(res.data)
          ) {

            this.clearLedgerData();

            return;
          }
 this.showSpinner = false;

          /* =================================================
             MAP SQL RESPONSE
          ================================================= */

          this.listOfReceiptData =
            res.data.map(
              (item: any): AccountLedgerRow => ({

                date:
                  item.date ??
                  item.Date ??
                  null,


                particulars:
                  item.particulars ??
                  item.Particulars ??
                  '',


                voucherType:
                  item.voucherType ??
                  item['Vch Type'] ??
                  item.vchType ??
                  '',


                voucherNo:
                  item.voucherNo ??
                  item['Vch No'] ??
                  '',


                qty:
                  Number(
                    item.qty ??
                    item.Qty ??
                    0
                  ),


                items:
                  item.items ??
                  item.Items ??
                  '',


                debit:
                  Number(
                    item.debit ??
                    item.Debit ??
                    0
                  ),


                credit:
                  Number(
                    item.credit ??
                    item.Credit ??
                    0
                  ),


                balance:
                  Number(
                    item.balance ??
                    item.Balance ??
                    0
                  ),


                balanceType:
                  item.balanceType ??
                  item['Balance Type'] ??
                  ''
              })
            );


          /* =================================================
             ACCOUNT
          ================================================= */

          this.accountName =
            this.selectedAccount?.accountName ||
            res.accountName ||
            '';


          /* =================================================
             OPENING
          ================================================= */

          this.openingBalance = 0;

          this.openingType = '';


          /* =================================================
             TOTALS
          ================================================= */

          this.calculateTotals(
            this.listOfReceiptData
          );


          /* =================================================
             CLOSING BALANCE
          ================================================= */

          if (
            this.listOfReceiptData.length > 0
          ) {

            const last =
              this.listOfReceiptData[
                this.listOfReceiptData.length - 1
              ];


            this.closingBalance =
              Number(
                last.balance || 0
              );


            this.closingType =
              last.balanceType || '';

          } else {

            this.closingBalance = 0;

            this.closingType = '';
          }
        },


        error: (err: any) => {

          console.error(
            'Account Ledger API Error:',
            err
          );

          this.clearLedgerData();
        },


        complete: () => {

          this.showSpinner = false;

          this.cdr.detectChanges();
        }
      });
  }


  /* =========================================================
     TOTALS
  ========================================================= */

  calculateTotals(
    data: AccountLedgerRow[]
  ): void {

    this.totalDR = 0;

    this.totalCR = 0;

    this.totalQty = 0;


    data.forEach(
      (item: AccountLedgerRow) => {

        this.totalDR +=
          Number(item.debit || 0);

        this.totalCR +=
          Number(item.credit || 0);

        this.totalQty +=
          Number(item.qty || 0);
      }
    );


    this.totalDR =
      Number(
        this.totalDR.toFixed(2)
      );


    this.totalCR =
      Number(
        this.totalCR.toFixed(2)
      );


    this.totalQty =
      Number(
        this.totalQty.toFixed(2)
      );


    this.grandTotal =
      Number(
        (
          this.totalDR -
          this.totalCR
        ).toFixed(2)
      );
  }


  /* =========================================================
     DATE CONVERSION
  ========================================================= */

  convertToApiDate(
    date: string
  ): string | null {

    if (!date) {
      return null;
    }


    const parts =
      date.split('-');


    if (parts.length !== 3) {
      return null;
    }


    const [
      dd,
      mm,
      yyyy
    ] = parts;


    if (
      dd.length !== 2 ||
      mm.length !== 2 ||
      yyyy.length !== 4
    ) {

      return null;
    }


    return `${yyyy}-${mm}-${dd}`;
  }


  /* =========================================================
     DATE INPUT FORMAT
  ========================================================= */

  formatDateInput(
    type: 'from' | 'to'
  ): void {

    let value =
      type === 'from'
        ? this.fromDate
        : this.toDate;


    if (!value) {
      return;
    }


    let digits =
      value.replace(/\D/g, '');


    if (digits.length > 8) {

      digits =
        digits.substring(
          0,
          8
        );
    }


    let formatted = '';


    if (digits.length >= 2) {

      formatted +=
        digits.substring(
          0,
          2
        );
    }


    if (digits.length >= 4) {

      formatted +=
        '-' +
        digits.substring(
          2,
          4
        );
    }


    if (digits.length > 4) {

      formatted +=
        '-' +
        digits.substring(
          4,
          8
        );
    }


    if (type === 'from') {

      this.fromDate =
        formatted;

    } else {

      this.toDate =
        formatted;
    }
  }


  /* =========================================================
     APPLY LEDGER FILTER
  ========================================================= */

  applyLedgerFilter(): void {

    if (!this.selectedAccount) {

      alert(
        'Please select account first'
      );

      return;
    }


    const accountId =
      Number(
        this.selectedAccount._id ||
        this.selectedAccount.id ||
        0
      );


    if (!accountId) {

      alert(
        'Invalid account selected'
      );

      return;
    }


    this.getAccountLedger(
      accountId
    );
  }


  /* =========================================================
     LEDGER SEARCH
  ========================================================= */

  onLedgerSearchChange(): void {

    const text =
      this.ledgerSearchText
        .trim()
        .toLowerCase();


    /* Client-side search */

    if (text) {

      const filtered =
        this.listOfReceiptData.filter(
          (item: AccountLedgerRow) =>

            item.particulars
              ?.toLowerCase()
              .includes(text)

            ||

            item.voucherType
              ?.toLowerCase()
              .includes(text)

            ||

            item.voucherNo
              ?.toLowerCase()
              .includes(text)

            ||

            item.items
              ?.toLowerCase()
              .includes(text)
        );


      this.calculateTotals(
        filtered
      );

      return;
    }


    /* Reload complete ledger */

    if (this.selectedAccount) {

      const accountId =
        Number(
          this.selectedAccount._id ||
          this.selectedAccount.id ||
          0
        );


      this.getAccountLedger(
        accountId
      );
    }
  }


  /* =========================================================
     CLEAR LEDGER FILTER
  ========================================================= */

  clearLedgerFilter(): void {

    this.ledgerSearchText = '';

    this.fromDate = '';

    this.toDate = '';


    if (this.selectedAccount) {

      const accountId =
        Number(
          this.selectedAccount._id ||
          this.selectedAccount.id ||
          0
        );


      this.getAccountLedger(
        accountId
      );
    }
  }


  /* =========================================================
     CLEAR LEDGER
  ========================================================= */

  clearLedgerData(): void {

    this.listOfReceiptData = [];

    this.openingBalance = 0;

    this.openingType = '';

    this.closingBalance = 0;

    this.closingType = '';

    this.totalCR = 0;

    this.totalDR = 0;

    this.totalQty = 0;

    this.grandTotal = 0;
  }


  /* =========================================================
     ABS VALUE
  ========================================================= */

  getAbsValue(
    value: number
  ): number {

    return Math.abs(
      Number(value || 0)
    );
  }


  /* =========================================================
     RESET ACCOUNT
  ========================================================= */

  resetFilter(): void {

    this.searchText = '';

    this.accountSearchText = '';

    this.listOfData =
      [...this.originalList];

    this.selectedAccount = null;

    this.clearLedgerData();
  }


  /* =========================================================
     ADD / EDIT ACCOUNT
  ========================================================= */

  addEditData(
    data?: any
  ): void {

    this._id =
      Number(
        data?._id ||
        data?.id ||
        0
      );


    const dialogData = {

      ...(data || {}),

      id: this._id
    };


    const dialogRef =
      this.dialog.open(
        AddEditAccount,
        {
          width: '95vw',

          maxWidth: '1500px',

          maxHeight: '100vh',

          data: dialogData
        }
      );


    dialogRef.afterClosed()
      .subscribe(
        (result: any) => {

          if (!result) {
            return;
          }


          this.getAllData();


          if (this.selectedAccount) {

            this.getAccountLedger(
              this._id
            );
          }
        }
      );
  }


  /* =========================================================
     OPEN VOUCHER
  ========================================================= */

  addEditPayment(
    data: any
  ): void {

    if (!data) {
      return;
    }


    const accountId =
      Number(
        data.accountId ||
        data.AccountId ||
        0
      );


    const referenceId =
      Number(
        data.referenceId ||
        data.RefId ||
        0
      );


    const voucherType =
      (
        data.voucherType ||
        data.VoucherType ||
        data['Vch Type'] ||
        ''
      )
        .toString()
        .toUpperCase();


    /* =====================================================
       SALE
    ===================================================== */

    if (
      voucherType === 'SALE'
    ) {

      const dialogData = {

        ...data,

        saleInvoiceId:
          referenceId
      };


      const dialogRef =
        this.dialog.open(
          AddEditSale,
          {
            width: '95vw',

            maxWidth: '1500px',

            data: dialogData
          }
        );


      dialogRef.afterClosed()
        .subscribe(
          (result: any) => {

            if (
              result &&
              accountId
            ) {

              this.getAccountLedger(
                accountId
              );
            }
          }
        );


      return;
    }


    /* =====================================================
       PAYMENT / RECEIPT
    ===================================================== */

    const dialogRef =
      this.dialog.open(
        AddEditPaymentReceipt,
        {
          width: '80vw',

          maxWidth: '1200px',

          data: data
        }
      );


    dialogRef.afterClosed()
      .subscribe(
        (result: any) => {

          if (
            result &&
            accountId
          ) {

            this.getAccountLedger(
              accountId
            );
          }
        }
      );
  }


  /* =========================================================
     EXCEL DATE
  ========================================================= */

  formatExcelDate(
    date: any
  ): string {

    if (!date) {
      return '';
    }


    const d =
      new Date(date);


    if (
      Number.isNaN(
        d.getTime()
      )
    ) {

      return '';
    }


    const day =
      ('0' + d.getDate())
        .slice(-2);


    const month =
      ('0' + (d.getMonth() + 1))
        .slice(-2);


    return `${day}-${month}-${d.getFullYear()}`;
  }


  /* =========================================================
     EXCEL BORDER
  ========================================================= */

  applyBorder(
    row: any
  ): void {

    row.eachCell(
      (cell: any) => {

        cell.border = {

          top: {
            style: 'thin'
          },

          left: {
            style: 'thin'
          },

          bottom: {
            style: 'thin'
          },

          right: {
            style: 'thin'
          }
        };


        cell.alignment = {

          vertical: 'middle',

          wrapText: true
        };
      }
    );
  }


  /* =========================================================
     EXPORT EXCEL
  ========================================================= */

  exportToExcel(): void {

    if (
      !this.listOfReceiptData.length
    ) {

      alert(
        'No ledger data available'
      );

      return;
    }


    const workbook =
      new ExcelJS.Workbook();


    const worksheet =
      workbook.addWorksheet(
        'Ledger'
      );


    worksheet.views = [
      {
        showGridLines: false
      }
    ];


    worksheet.pageSetup = {

      paperSize: 9,

      orientation: 'landscape',

      fitToPage: true,

      fitToWidth: 1,

      fitToHeight: 0,

      horizontalCentered: true,

      verticalCentered: false
    };


    worksheet.columns = [

      {
        header: 'Date',
        key: 'Date',
        width: 14
      },

      {
        header: 'Particulars',
        key: 'Particulars',
        width: 25
      },

      {
        header: 'Vch.Type',
        key: 'VchType',
        width: 14
      },

      {
        header: 'Vch No',
        key: 'VchNo',
        width: 14
      },

      {
        header: 'Qty',
        key: 'Qty',
        width: 10
      },

      {
        header: 'Items',
        key: 'Items',
        width: 40
      },

      {
        header: 'Debit',
        key: 'Debit',
        width: 14
      },

      {
        header: 'Credit',
        key: 'Credit',
        width: 14
      },

      {
        header: 'Balance',
        key: 'Balance',
        width: 15
      },

      {
        header: 'Type',
        key: 'Type',
        width: 8
      }
    ];


    /* TITLE */

    worksheet.mergeCells(
      'A1:J1'
    );

    worksheet.getCell(
      'A1'
    ).value =
      'ACCOUNT LEDGER';

    worksheet.getCell(
      'A1'
    ).font = {
      bold: true,
      size: 16
    };

    worksheet.getCell(
      'A1'
    ).alignment = {
      horizontal: 'center'
    };


    /* ACCOUNT */

    worksheet.mergeCells(
      'A2:J2'
    );

    worksheet.getCell(
      'A2'
    ).value =
      `Account: ${this.accountName}`;

    worksheet.getCell(
      'A2'
    ).font = {
      bold: true
    };


    /* DATE */

    worksheet.mergeCells(
      'A3:J3'
    );

    worksheet.getCell(
      'A3'
    ).value =
      `From: ${this.fromDate || '-'} To: ${this.toDate || '-'}`;


    worksheet.addRow([]);


    /* HEADER */

    const headerRow =
      worksheet.addRow([

        'Date',

        'Particulars',

        'Vch.Type',

        'Vch No',

        'Qty',

        'Items',

        'Debit',

        'Credit',

        'Balance',

        'Type'
      ]);


    headerRow.eachCell(
      (cell: any) => {

        cell.font = {
          bold: true
        };

        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle'
        };

        cell.border = {

          top: {
            style: 'thin'
          },

          left: {
            style: 'thin'
          },

          bottom: {
            style: 'thin'
          },

          right: {
            style: 'thin'
          }
        };
      }
    );


    /* DATA */

    this.listOfReceiptData.forEach(
      (
        item: AccountLedgerRow
      ) => {

        const row =
          worksheet.addRow([

            this.formatExcelDate(
              item.date
            ),

            item.particulars ||
              '---',

            item.voucherType ||
              '---',

            item.voucherNo ||
              '---',

            item.qty || 0,

            item.items ||
              '---',

            item.debit > 0
              ? item.debit
              : '',

            item.credit > 0
              ? item.credit
              : '',

            item.balance || 0,

            item.balanceType ||
              ''
          ]);


        this.applyBorder(
          row
        );
      }
    );


    /* TOTAL */

    const totalRow =
      worksheet.addRow([

        '',

        'TOTAL',

        '',

        '',

        this.totalQty,

        '',

        this.totalDR,

        this.totalCR,

        this.closingBalance,

        this.closingType
      ]);


    totalRow.font = {
      bold: true
    };


    this.applyBorder(
      totalRow
    );


    /* PRINT AREA */

    worksheet.pageSetup.printArea =
      `A1:J${worksheet.rowCount}`;


    /* DOWNLOAD */

    workbook.xlsx
      .writeBuffer()
      .then(
        (
          buffer: ArrayBuffer
        ) => {

          const blob =
            new Blob(
              [buffer],
              {
                type:
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              }
            );


          FileSaver.saveAs(
            blob,

            `Ledger_${
              this.accountName ||
              'Account'
            }.xlsx`
          );
        }
      );
  }
  hasAccountSearch(): boolean {
  return !!this.accountSearchText &&
         this.accountSearchText.trim().length > 0;
}
}