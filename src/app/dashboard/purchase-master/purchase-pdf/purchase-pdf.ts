import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, ViewChild } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { ApiUrl } from '../../../_core/apiUrl';
import { AllApiService } from '../../../_core/_service/all-api.service';
import { NgxPrintModule } from 'ngx-print';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
interface GstSummary {
  hsn: string;
  remarks:string;
  taxableAmount: number;
  qty: number;
  taxRate: number;
  sgst: number;
  cgst: number;
  igst: number;
}
@Component({
  selector: 'app-purchase-pdf',
  imports: [CommonModule,MaterialModule,ReactiveFormsModule,FormsModule,NgxPrintModule],
  templateUrl: './purchase-pdf.html',
  styleUrl: './purchase-pdf.scss',
})
export class PurchasePdf {
 
  @ViewChild('printBtn')
printBtn!: ElementRef;
  
showSpinner = true;
companyId:any
screenConfig:any;
  purchaseInvoiceId: any;
  header: any = {};
  details: any[] = [];
    totalRowAmount: number = 0;   // ← add this
   groupedGstData: GstSummary[] = [];
   totalQty: number = 0;
   showBarcode = false;
showHsn = false;
showMRate = false;
showDiscPer = false;
showDiscAmt = false;
showRemarks = false;
showArt = false;
showSize = false;
showColor = false;
showPack1 = false;
showPack2 = false;

  constructor(
    private api: AllApiService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PurchasePdf>,
     
  ) {}

  ngOnInit(): void {

     this.companyId = JSON.parse(localStorage.getItem('loggedUser') || '{}').companyId;

     this.data;
    
    
      this.purchaseInvoiceId = Number(this.data?.purchaseInvoiceId) || 0;
   
    // this.purchaseInvoiceId = this.route.snapshot.paramMap.get('purchaseInvoiceId');
    console.log('Invoice ID:', this.purchaseInvoiceId);
    this.getScreenManagement();
    this.getAllData();
    
  }

//  getAllData() {
//   this.api
//     .getAllDataId(ApiUrl.getPdfForSale, this.purchaseInvoiceId)
//     .subscribe((res: any) => {

//       if (!res || !res.success) {
//         return;
//       }

//       this.header = res.header;
//       this.details = res.details || [];

//       // Calculate total
//       this.totalRowAmount = this.details.reduce(
//         (sum, item) => sum + (item.rowTotal || 0),
//         0
//       );

//       // ✅ PLACE IT HERE (INSIDE METHOD)
//       this.groupedGstData = this.getGroupedGstData();

//       this.showSpinner = false;
//       this.cdr.detectChanges();
//     });
// }



applyPurchaseScreenConfig(): void {

  const config = this.screenConfig;

  if (!config) {
    console.warn('No screen configuration available');
    return;
  }

  this.showBarcode = config.barcodePurchase === true;
  this.showHsn = config.hsnPurchase === true;
  this.showMRate = config.mRatePurchase === true;
  this.showDiscPer = config.discPercentPurchase === true;
  this.showDiscAmt = config.discountPurchase === true;
  this.showRemarks = config.remarksPurchase === true;
  this.showArt = config.artPurchase === true;
  this.showSize = config.sizePurchase === true;
  this.showColor = config.colorPurchase === true;
  this.showPack1 = config.pack1Purchase === true;
  this.showPack2 = config.pack2Purchase === true;

  console.log('===== PURCHASE SCREEN CONFIG =====');
  console.log('Barcode:', this.showBarcode);
  console.log('HSN:', this.showHsn);
  console.log('MRate:', this.showMRate);
  console.log('Disc %:', this.showDiscPer);
  console.log('Disc Amt:', this.showDiscAmt);
  console.log('Remarks:', this.showRemarks);
  console.log('Art:', this.showArt);
  console.log('Size:', this.showSize);
  console.log('Color:', this.showColor);
  console.log('Pack1:', this.showPack1);
  console.log('Pack2:', this.showPack2);
}
getScreenManagement(): void {

  this.api
    .getAllDataId(
      ApiUrl.listOfScreenManagement,
      this.companyId
    )
    .subscribe({
      next: (res: any) => {

        console.log('SCREEN CONFIG API:', res);

        if (
          res?.success === true &&
          Array.isArray(res.data) &&
          res.data.length > 0
        ) {

          // Find configuration for current company
          this.screenConfig = res.data.find(
            (x: any) =>
              Number(x.companyId) === Number(this.companyId)
          ) ?? res.data[0];

          console.log(
            'SELECTED PURCHASE SCREEN CONFIG:',
            this.screenConfig
          );

          this.applyPurchaseScreenConfig();
        }
        else {

          console.warn(
            'No screen management configuration found'
          );

          // Optional defaults
          this.showBarcode = false;
          this.showHsn = false;
          this.showMRate = false;
          this.showDiscPer = false;
          this.showDiscAmt = false;
          this.showRemarks = false;
          this.showArt = false;
          this.showSize = false;
          this.showColor = false;
          this.showPack1 = false;
          this.showPack2 = false;
        }

        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error(
          'Screen Management API Error:',
          err
        );
      }
    });
}

getAllData() {
  this.api
    .getAllDataId(ApiUrl.purchaseInvoicePdf, this.purchaseInvoiceId)
    .subscribe((res: any) => {

      if (!res || !res.success) {
        return;
      }

      this.header = res.header;
      this.details = res.details || [];
      console.log(this.details);

      // Total Row Amount
      this.totalRowAmount = this.details.reduce(
        (sum, item) => sum + (Number(item.rowTotal) || 0),
        0
      );

      // ✅ Total Quantity
      this.totalQty = this.details.reduce(
        (sum, item) => sum + (Number(item.qty) || 0),
        0
      );

      this.groupedGstData = this.getGroupedGstData();

      this.showSpinner = false;
      this.cdr.detectChanges();
       if (this.data?.autoPrint) {
  setTimeout(() => {

    // Open print
    this.printBtn?.nativeElement.click();

    // Detect when user closes Save/Print dialog
    window.addEventListener('focus', () => {
      setTimeout(() => {
        this.dialogRef.close(true);
      }, 500);
    }, { once: true });

  }, 1000);
}
    });
}

getFirstGstRate(data: any): number {
  const central = data?.gstApplicabeCentralRate;
  const local = data?.gstApplicabeLocalRate;

  // IGST case (only central exists)
  if (central && !local) {
    return central;
  }

  return 0;
}

getCentralRate(data: any): number {
  const central = data?.gstApplicabeCentralRate;
  const local = data?.gstApplicabeLocalRate;

  // CGST case (both exist)
  if (central && local) {
    return central;
  }

  return 0;
}

getLocalRate(data: any): number {
  const central = data?.gstApplicabeCentralRate;
  const local = data?.gstApplicabeLocalRate;

  // SGST case (both exist)
  if (central && local) {
    return local;
  }

  return 0;
}
 closeModel(){
  
   this.dialogRef.close(true);
 }

// getGroupedGstData(): {
//   hsn: string;
//   taxableAmount: number;
//   qty: number;
//   taxRate: number;
//   sgst: number;
//   cgst: number;
//   igst: number;
// }[] {

//   const grouped: any = {};

//   this.details.forEach((item: any) => {

//     const cgstRate = this.getCentralRate(item);
//     const sgstRate = this.getLocalRate(item);
//     const igstRate = this.getFirstGstRate(item);

//     const taxRate = igstRate > 0 ? igstRate : sgstRate;

//     // const key = item.hsn + '_' + sgstRate;

//         const key = sgstRate + '_' + cgstRate + '_' + igstRate;

//     if (!grouped[key]) {
//       grouped[key] = {
//         hsn: item.hsn,
//         taxableAmount: 0,
//         qty: 0,
//         taxRate: taxRate,
//         sgst: 0,
//         cgst: 0,
//         igst: 0
//       };
//     }

//     grouped[key].taxableAmount += Number(item.rowTotal);
//     grouped[key].qty += Number(item.qty);

//     // ✅ Add percentage when merged
//     grouped[key].sgst += sgstRate;
//     grouped[key].cgst += cgstRate;
//     grouped[key].igst += igstRate;
//   });

//   return Object.values(grouped);
// }


getGroupedGstData(): {
  hsn: string;
  remarks:string;
  barcode:string;
  color:string;
pack1:string;
pack2:string;
size:string;
discAmt: number;
artNo:string;
  taxableAmount: number;
  qty: number;
  taxRate: number;
  sgst: number;
  cgst: number;
  igst: number;
}[] {

  const grouped: any = {};

  this.details.forEach((item: any) => {

    const cgstRate = this.getCentralRate(item);
    const sgstRate = this.getLocalRate(item);
    const igstRate = this.getFirstGstRate(item);

    const taxable = Number(item.rowTotal) || 0;

    // ✅ Calculate TAX AMOUNT (not percent)
    const cgstAmount = taxable * cgstRate / 100;
    const sgstAmount = taxable * sgstRate / 100;
    const igstAmount = taxable * igstRate / 100;

    const taxRate = igstRate > 0
      ? igstRate
      : (cgstRate + sgstRate);

    const key = sgstRate + '_' + cgstRate + '_' + igstRate;

    if (!grouped[key]) {
      grouped[key] = {
        hsn: item.hsn,
        remarks: item.remarks,
        color:item.color,
pack1:item.pack1,
pack2:item.pack2,
size:item.size,
discAmt:item.size,
artNo:item.size,
        taxableAmount: 0,
        qty: 0,
        taxRate: taxRate,
        sgst: 0,
        cgst: 0,
        igst: 0
      };
    }

    grouped[key].taxableAmount += taxable;
    grouped[key].qty += Number(item.qty);

    // 🔥 ADD TAX AMOUNT (₹)
    grouped[key].sgst += sgstAmount;
    grouped[key].cgst += cgstAmount;
    grouped[key].igst += igstAmount;
  });

  return Object.values(grouped);
}

get leftColspan(): number {
  let count = 3; // Sr + Description + Qty

  if (this.showBarcode) count++;
  if (this.showRemarks) count++;
  if (this.showHsn) count++;
  if (this.showColor) count++;
  if (this.showArt) count++;
  if (this.showPack1) count++;
  if (this.showPack2) count++;

  return count;
}

get rightColspan(): number {
  let count = 5; // Rate + IGST + CGST + SGST + Amount

  if (this.showDiscPer) count++;

  return count;
}



// get rightColspan(): number {
//   let count = 8; // Qty, Rate, IGST, CGST, SGST, Amount

//   if (this.showDiscPer) count++;

//   return count;
// }

  numberToWords(amount: number): string {
  if (!amount) return 'Zero';

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five',
    'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen',
    'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];

  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty',
    'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  function convert(num: number): string {
    if (num < 20) return ones[num];
    if (num < 100)
      return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    if (num < 1000)
      return ones[Math.floor(num / 100)] + ' Hundred' +
        (num % 100 ? ' ' + convert(num % 100) : '');
    if (num < 100000)
      return convert(Math.floor(num / 1000)) + ' Thousand' +
        (num % 1000 ? ' ' + convert(num % 1000) : '');
    if (num < 10000000)
      return convert(Math.floor(num / 100000)) + ' Lakh' +
        (num % 100000 ? ' ' + convert(num % 100000) : '');
    return convert(Math.floor(num / 10000000)) + ' Crore' +
      (num % 10000000 ? ' ' + convert(num % 10000000) : '');
  }

  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  let words = convert(rupees) + ' Rupees';
  if (paise > 0) {
    words += ' and ' + convert(paise) + ' Paise';
  }

  return words + ' Only';
}
exportToExcel() {

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sale Invoice', {
    pageSetup: {
      paperSize: 9,
      orientation: 'portrait',
      fitToPage: true,
      fitToWidth: 1
    }
  });

  // =========================
  // COLUMN WIDTH
  // =========================

  worksheet.columns = [
    { width: 6 },
    { width: 30 },
    { width: 12 },
    { width: 10 },
    { width: 12 },
    { width: 10 },
    { width: 10 },
    { width: 10 },
    { width: 10 },
    { width: 15 }
  ];

  // =========================
  // TITLE
  // =========================

  worksheet.mergeCells('A1:J1');
  worksheet.getCell('A1').value = 'TAX INVOICE';
  worksheet.getCell('A1').font = {
    bold: true,
    size: 18
  };

  worksheet.getCell('A1').alignment = {
    horizontal: 'center'
  };

  worksheet.mergeCells('A2:J2');
  worksheet.getCell('A2').value = 'Original for Buyer';
  worksheet.getCell('A2').alignment = {
    horizontal: 'center'
  };

  // =========================
  // COMPANY
  // =========================

  worksheet.mergeCells('A4:F6');
  worksheet.getCell('A4').value =
`${this.header.companyName}
(${this.header.stateCode}-${this.header.stateName})`;

  worksheet.mergeCells('G4:J6');
  worksheet.getCell('G4').value =
`Invoice No : ${this.header.invoiceNo}

Date : ${this.header.invoiceDate}`;

  worksheet.getCell('A4').alignment = {
    wrapText: true,
    vertical: 'top'
  };

  worksheet.getCell('G4').alignment = {
    wrapText: true,
    vertical: 'top'
  };

  // =========================
  // BILL TO
  // =========================

  worksheet.mergeCells('A7:F12');

  worksheet.getCell('A7').value =
`Bill To :

${this.header.accountName}

${this.header.cityName}

STATE : (${this.header.stateCode}-${this.header.stateName})

Phone : ${this.header.companyPhone}`;

  worksheet.getCell('A7').alignment = {
    wrapText: true,
    vertical: 'top'
  };

  worksheet.mergeCells('G7:J12');

  worksheet.getCell('G7').value =
`Order No :

GR/RR No :

Transport :

Vehicle :

Due Date :`;

  worksheet.getCell('G7').alignment = {
    wrapText: true,
    vertical: 'top'
  };

  // =========================
  // TABLE HEADER
  // =========================

  const startRow = 14;

  worksheet.getRow(startRow).height = 25;

  const headers = [
    'Sr',
    'Description',
    'HSN',
    'Qty',
    'Rate',
    'Disc%',
    'IGST%',
    'CGST%',
    'SGST%',
    'Amount'
  ];

  headers.forEach((h, i) => {
    const cell = worksheet.getCell(startRow, i + 1);

    cell.value = h;

    cell.font = {
      bold: true
    };

    cell.alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };

    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // =========================
  // DETAILS
  // =========================

  let rowIndex = startRow + 1;

  this.details.forEach((data: any, index: number) => {

    const row = worksheet.getRow(rowIndex);

    row.values = [
      index + 1,
      data.itemName,
      data.hsn,
      data.qty,
      data.rate,
      data.discPer,
      this.getFirstGstRate(data),
      this.getCentralRate(data),
      this.getLocalRate(data),
      data.rowTotal
    ];

    row.eachCell((cell) => {

      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };

      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };

    });

    rowIndex++;
  });

  // =========================
  // TOTAL
  // =========================

  worksheet.mergeCells(`A${rowIndex}:D${rowIndex}`);

  worksheet.getCell(`A${rowIndex}`).value =
    `Total Qty : ${this.totalQty}`;

  worksheet.mergeCells(`E${rowIndex}:J${rowIndex}`);

  worksheet.getCell(`E${rowIndex}`).value =
    `Total Amount : ${this.totalRowAmount}`;

  // =========================
  // GST SUMMARY
  // =========================

  rowIndex += 2;

  const gstHeaders = [
    'HSN',
    'Taxable',
    'Qty',
    'Tax %',
    'SGST',
    'CGST',
    'IGST'
  ];

  gstHeaders.forEach((h, i) => {

    const cell = worksheet.getCell(rowIndex, i + 1);

    cell.value = h;

    cell.font = {
      bold: true
    };

    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  rowIndex++;

  this.groupedGstData.forEach((gst: any) => {

    const row = worksheet.getRow(rowIndex);

    row.values = [
      gst.hsn,
      gst.taxableAmount,
      gst.qty,
      gst.taxRate,
      gst.sgst,
      gst.cgst,
      gst.igst
    ];

    row.eachCell((cell) => {

      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };

    });

    rowIndex++;
  });

  // =========================
  // AMOUNT IN WORDS
  // =========================

  rowIndex += 2;

  worksheet.mergeCells(`A${rowIndex}:J${rowIndex}`);

  worksheet.getCell(`A${rowIndex}`).value =
    `Amount in Words : ${this.numberToWords(this.header.subTotal)}`;

  worksheet.getCell(`A${rowIndex}`).alignment = {
    wrapText: true
  };

  // =========================
  // SIGNATURE
  // =========================

  rowIndex += 4;

  worksheet.mergeCells(`H${rowIndex}:J${rowIndex}`);

  worksheet.getCell(`H${rowIndex}`).value =
`For DEMO

Authorized Signatory`;

  worksheet.getCell(`H${rowIndex}`).alignment = {
    horizontal: 'center'
  };

  // =========================
  // DOWNLOAD
  // =========================

  workbook.xlsx.writeBuffer().then((buffer: any) => {

    const blob = new Blob(
      [buffer],
      {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    );

    FileSaver.saveAs(blob, `SaleInvoice_${this.header.invoiceNo}.xlsx`);

  });

}

goBack() {
  this.router.navigate(['/dashboard/sale']);
}
}

