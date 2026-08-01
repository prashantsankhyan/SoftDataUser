import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject,AfterViewInit, NgZone, ViewChild, ElementRef, HostListener, QueryList, ViewChildren } from '@angular/core';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { finalize, take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../material.module';
import { AllApiService } from '../../../_core/_service/all-api.service';
import { ApiUrl } from '../../../_core/apiUrl';
import { AddEditAccount } from '../../account-master/add-edit-account/add-edit-account';
import { AddEditNarration } from '../../narration/add-edit-narration/add-edit-narration';
import { MatSelect } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
@Component({
  selector: 'app-add-edit-payment-receipt',
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule,
    NgxMatSelectSearchModule
  ],
  templateUrl: './add-edit-payment-receipt.html',
  styleUrl: './add-edit-payment-receipt.scss',
})
export class AddEditPaymentReceipt {
   isSaving = false;
@HostListener('keydown', ['$event'])
onKeyDown(event: KeyboardEvent) {

  if (this.isSaving) {
    event.preventDefault();
    return;
  }

  // Shift + Enter = do nothing here
  if (event.key === 'Enter' && event.shiftKey) {
    return;
  }

  if (event.key !== 'Enter') {
    return;
  }

  event.preventDefault();

  const target = event.target as HTMLElement;

  const form = target.closest('form');
  if (!form) return;

  const elements = Array.from(
    form.querySelectorAll(`
      input:not([disabled]),
      textarea:not([disabled]),
      .mat-mdc-select,
      button:not([disabled])
    `)
  ).filter((x: any) => x.offsetParent !== null) as HTMLElement[];

  const index = elements.indexOf(target);

  if (index > -1 && index < elements.length - 1) {
    elements[index + 1].focus();
  }
}



// focusNext(select: MatSelect) {
//   setTimeout(() => {
//     const current = select._elementRef.nativeElement;

//     const form = current.closest('form');
//     if (!form) return;

//     const elements = Array.from(
//       form.querySelectorAll(
//         'input:not([disabled]), textarea:not([disabled]), .mat-mdc-select, button:not([disabled])'
//       )
//     ).filter(
//       (el: any) =>
//         el.offsetParent !== null &&
//         !el.hasAttribute('readonly')
//     ) as HTMLElement[];

//     const index = elements.findIndex(el => el === current);

//     if (index === -1) return;

//     const next = elements[index + 1];
//     if (!next) return;

//     // Next is a mat-select
//     if (next.classList.contains('mat-mdc-select')) {
//       next.focus();
//     } else {
//       // Next is input/textarea/button
//       next.focus();
//     }
//   });
// }

focusNext(select: MatSelect) {

  requestAnimationFrame(() => {

    requestAnimationFrame(() => {

      const current = select._elementRef.nativeElement;
      const form = current.closest('form');

      if (!form) return;

      const elements = Array.from(
        form.querySelectorAll(`
          input:not([disabled]),
          textarea:not([disabled]),
          .mat-mdc-select,
          button:not([disabled])
        `)
      ).filter((el: any) =>
        el.offsetParent !== null &&
        !el.hasAttribute('readonly')
      ) as HTMLElement[];

      const index = elements.indexOf(current);

      if (index === -1 || index >= elements.length - 1) return;

      const next = elements[index + 1];

      next.focus();

      // If next is mat-select, open it automatically (optional)
      if (next.classList.contains('mat-mdc-select')) {
        next.dispatchEvent(
          new KeyboardEvent('keydown', {
            key: 'Enter',
            bubbles: true
          })
        );
      }

    });

  });

}

focusNextButton(button: HTMLElement) {

  const form = button.closest('form');
  if (!form) return;

  const elements = Array.from(
    form.querySelectorAll(`
       input:not([disabled]),
    textarea:not([disabled]),
    .mat-mdc-select,
    button:not([disabled]),
    button[type="submit"]
    `)
  ).filter((el: any) => el.offsetParent !== null) as HTMLElement[];

  const index = elements.indexOf(button);

  if (index > -1 && index < elements.length - 1) {
    elements[index + 1].focus();
  }
}
focusNextRegd(select: MatSelect) {

  setTimeout(() => {

    const current = select._elementRef.nativeElement;

    const form = current.closest('form');

    if (!form) return;

    const elements = Array.from(
      form.querySelectorAll(
        `
        input:not([disabled]),
        textarea:not([disabled]),
        select:not([disabled]),
        .mat-mdc-select,
        button:not([disabled])
        `
      )
    ).filter(
      (el: any) =>
        el.offsetParent !== null &&
        !el.hasAttribute('readonly')
    ) as HTMLElement[];

    const index = elements.indexOf(current);

    if (index > -1 && index < elements.length - 1) {
      elements[index + 1].focus();
    }

  });
}

focusNextInput(current: HTMLElement) {
  setTimeout(() => {

    const form = current.closest('form');
    if (!form) return;

    const elements = Array.from(
      form.querySelectorAll(`
        input:not([disabled]):not([readonly]):not([tabindex="-1"]),
        textarea:not([disabled]):not([readonly]):not([tabindex="-1"]),
        .mat-mdc-select,
        button:not([disabled]):not([tabindex="-1"])
      `)
    ).filter((x: any) => x.offsetParent !== null) as HTMLElement[];

    const index = elements.indexOf(current);

    console.log(elements);
    console.log(index);

    if (index < 0) return;

    const next = elements[index + 1];

    if (!next) return;

    next.focus();

  }, 0);
}
focusNextButtonNext() {
  this.saveBtn.nativeElement.focus();
}
onAmountKeyDown(event: KeyboardEvent, index: number) {

  if (event.shiftKey && event.key === 'Enter') {
    event.preventDefault();
    this.addRowAndFocus();
    return;
  }

  if (event.key !== 'Enter' && event.key !== 'Tab') {
    return;
  }

  const control = this.details.at(index).get('amount');

  control?.markAsTouched();

  if (control?.invalid) {
    event.preventDefault();
    (event.target as HTMLInputElement).focus();
    return;
  }

  event.preventDefault();
  this.focusNextInput(event.target as HTMLElement);
}

addRowAndFocus() {
  this.addRow();

  this.cdr.detectChanges();

  setTimeout(() => {
    const triggers = document.querySelectorAll('.mat-mdc-select-trigger');
    const lastTrigger = triggers[triggers.length - 1] as HTMLElement;

    if (lastTrigger) {
      lastTrigger.focus();
      lastTrigger.click(); // Opens the dropdown (optional)
    }
  });
}


handleMatSelectEnter(select: MatSelect, controlName: string) {

  const value = this.addEditForm.get(controlName)?.value;

  event?.preventDefault();

  if (select.panelOpen) {
    return;
  }

  // Value exists (including 0)
  if (value !== null && value !== undefined && value !== '') {
    this.focusNext(select);
  } else {
    select.open();
  }
}

handleMatSelectEnterIndex(
  event: any,
  select: MatSelect,
  rowIndex: number,
  controlName: string
): void {

  event.preventDefault();
  event.stopPropagation();

  // If dropdown is open, let user select an option
  if (select.panelOpen) {
    return;
  }

  const value = this.details.at(rowIndex).get(controlName)?.value;

  if (value === null || value === undefined || value === '' || value === 0) {
    select.open();
    return;
  }

  this.focusNextRegd(select);
}
 @ViewChild('unitSelect') unitSelect!: ElementRef;
@ViewChild('itemGroupSelect') itemGroupSelect!: ElementRef;
@ViewChild('accout') accout!: ElementRef;
@ViewChildren('rowAccountSelect') rowAccountSelect!: QueryList<ElementRef>;
@ViewChildren('rowNarrationSelect') rowNarrationSelect!: QueryList<ElementRef>;
@ViewChild('saveBtn')
saveBtn!: ElementRef<HTMLButtonElement>;
 showSpiner = true;
  submit = false ;
  companyId:any;
  userName:any;
  
  alertMessage =''
  addEditForm!:FormGroup;
  PaymentReceiptId:any;
  successMessage = '';
  errorMessage = '';
  messageSuccess = true;
  listOfData: any[] = [];
  listOfNarration: any[] = [];
   listOfHeading: any[] = []; 
   originalList: any[] = [];
   listOfSale:any [] =[];
activeNarrationRow: number | null = null;
 
 alertShown = false;
 isShortcutTriggered = false;
 isDialogOpen = false;
 isCreatingAccount = false; // 🔥 NEW
  searchCtrl = new FormControl('');
  currentDropdown = '';
  
filteredLists: { [key: string]: any[] } = {};
rowSearchCtrls: FormControl[] = [];
filteredRowAccounts: any[][] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,private http:AllApiService,private cRouter:ActivatedRoute,
  private router: Router,private ngZone: NgZone,public dialog: MatDialog,
  private snackBar: MatSnackBar,
  private cdr: ChangeDetectorRef,public dialogRef: MatDialogRef<AddEditPaymentReceipt>){}
 

 ngOnInit(): void {

  this.companyId = JSON.parse(localStorage.getItem('loggedUser') || '{}').companyId;
  this.userName = JSON.parse(localStorage.getItem('loggedUser') || '{}').username;

  this.PaymentReceiptId = this.data?.PaymentReceiptId || 0;

  this.getAllData();
  this.getAllSale();
  this.getAllNarration();

  this.makeForm();
  this.watchDateChange();
  this.watchVoucherType();

  this.addRow();   // create first row

  if (this.PaymentReceiptId) {
    this.updateData();
  } else {
    this.showSpiner = false;
  }

  
  this.searchCtrl.valueChanges.subscribe(search => {

  search = (search || '').toLowerCase();

  switch (this.currentDropdown) {

    case 'account':
      this.filteredLists['account'] = this.listOfData.filter(x =>
        (x.accountName || '').toLowerCase().includes(search)
      );
      break;

    case 'itemGroup':
      this.filteredLists['itemGroup'] = this.listOfSale.filter((x:any) =>
        (x.itemGroupName || '').toLowerCase().includes(search)
      );
      break;

     
  }

});


}
@HostListener('keydown', ['$event'])
handleTab(event: KeyboardEvent) {
  
  if (event.key === 'Tab') {
    const activeElement = document.activeElement as HTMLElement;

    if (this.accout && this.accout.nativeElement === activeElement) {
      this.checkAccount(this.accout.nativeElement);
    }
  }
}


@HostListener('document:keydown', ['$event'])
handleKeyboardShortcuts(event: KeyboardEvent) {
if (event.altKey && event.key.toLowerCase() === 'c') {

  if (this.isDialogOpen) return;

  const activeElement = document.activeElement as HTMLElement;

  let rowIndex = -1;

  // ✅ Detect row
  this.details.controls.forEach((_, i) => {
    const rowElement = document.querySelector(`[data-row="${i}"]`);
    if (rowElement && rowElement.contains(activeElement)) {
      rowIndex = i;
    }
  });

  const isHeaderAccount =
    this.accout && this.accout.nativeElement === activeElement;

  const isNarrationField =
    activeElement?.getAttribute('formControlName') === 'narration';

  // ❌ If nothing matched → stop
  if (rowIndex === -1 && !isHeaderAccount) return;

  event.preventDefault();

  this.isDialogOpen = true;

  let dialogRef;

  // ✅ DECISION LOGIC (🔥 IMPORTANT)

  if (isNarrationField) {

    // 🔥 OPEN NARRATION
    dialogRef = this.dialog.open(AddEditNarration, {
      width: '95vw',
      maxWidth: '1200px'
    });

  } else {

    // 🔥 OPEN ACCOUNT
    dialogRef = this.dialog.open(AddEditAccount, {
      width: '95vw',
      maxWidth: '1500px'
    });

  }

  dialogRef.afterClosed().subscribe((result) => {

    this.isDialogOpen = false;

    if (result) {

      this.getAllData();
      this.getAllNarration();

      setTimeout(() => {

        // ✅ HEADER ACCOUNT
        if (!isNarrationField && isHeaderAccount) {
          this.addEditForm.get('accountName')
            ?.setValue(result.accountName);
        }

        // ✅ ROW ACCOUNT
        if (!isNarrationField && rowIndex !== -1) {
          this.details.at(rowIndex)
            .get('accountId')
            ?.setValue(result.accountId);
        }

        // ✅ ROW NARRATION
        if (isNarrationField && rowIndex !== -1) {
          this.details.at(rowIndex)
            .get('narration')
            ?.setValue(result.narration);
        }

      }, 200);
    }

    // ✅ FOCUS BACK
    setTimeout(() => {

      if (isNarrationField) {
        const el = document.querySelector(
          `[data-row="${rowIndex}"] input[formControlName="narration"]`
        ) as HTMLElement;

        el?.focus();

      } else {
        const el = document.querySelector(
          `[data-row="${rowIndex}"] select[formControlName="accountId"]`
        ) as HTMLElement;

        el?.focus();
      }

    }, 100);

  });
}
  if (event.altKey && event.key.toLowerCase() === 'c') {

  if (this.isDialogOpen) return;

  const activeElement = document.activeElement as HTMLElement;

  let rowIndex = -1;

  // ✅ Detect row
  this.details.controls.forEach((_, i) => {
    const rowElement = document.querySelector(`[data-row="${i}"]`);
    if (rowElement && rowElement.contains(activeElement)) {
      rowIndex = i;
    }
  });

  if (rowIndex === -1) return;

  event.preventDefault();

  this.isDialogOpen = true;

  const dialogRef = this.dialog.open(AddEditNarration, {
    width: '95vw',
    maxWidth: '1200px'
  });

  dialogRef.afterClosed().subscribe((result) => {

    this.isDialogOpen = false;

    if (result) {

      this.isCreatingAccount = true;

      this.getAllNarration(); // reload list

      setTimeout(() => {

        // ✅ Set narration to SAME ROW
        this.details.at(rowIndex)
          .get('narration')
          ?.setValue(result.narration);

        this.isCreatingAccount = false;

      }, 200);
    }

    // ✅ Focus back to narration input
    setTimeout(() => {
      const el = document.querySelector(
        `[data-row="${rowIndex}"] input[formControlName="narration"]`
      ) as HTMLElement;

      el?.focus();
    }, 100);

  });
}

if (event.altKey && event.key.toLowerCase() === 'f') {

  if (this.isDialogOpen) return;

  const activeElement = document.activeElement as HTMLElement;

  let finalIndex = -1;

  // ✅ Detect row
  this.details.controls.forEach((_, i) => {
    const rowElement = document.querySelector(`[data-row="${i}"]`);
    if (rowElement && rowElement.contains(activeElement)) {
      finalIndex = i;
    }
  });

  if (finalIndex === -1) return;

  event.preventDefault();

  // ✅ Activate dropdown
  this.activeNarrationRow = finalIndex;

  this.cdr.detectChanges();

  // ✅ 🔥 DIRECT DOM FOCUS (NO QueryList)
  setTimeout(() => {
    const el = document.getElementById(`narration-select-${finalIndex}`);
    el?.focus();
  }, 50);
}
}


onVoucherEnter(select: MatSelect, event?: KeyboardEvent) {
  event?.preventDefault();

  // Select the active/first option if nothing is selected
  if (!this.addEditForm.get('voucherNo')?.value) {
    const firstOption = select.options.first;
    if (firstOption) {
      this.addEditForm.get('voucherNo')?.setValue(firstOption.value);
    }
  }

  // Close the dropdown
  select.close();

  // Focus next control after the panel closes
  setTimeout(() => {
    this.focusNextRegd(select);
  }, 0);
}
handleTitleCase(event: KeyboardEvent, controlName: string) {
  const control = this.addEditForm.get(controlName);
  if (!control) return;

  const value = control.value || '';

  // Caps Lock → ALL CAPS
  if (event.getModifierState && event.getModifierState('CapsLock')) {
    control.setValue(value.toUpperCase(), { emitEvent: false });
  } 
  // Otherwise → Title Case
  else {
    const titleCase = value
      .toLowerCase()
      .replace(/\b\w/g, (c: string) => c.toUpperCase());

    control.setValue(titleCase, { emitEvent: false });
  }
}


onOpened(type: string, opened: boolean) {

  if (!opened) {
    return;
  }

  this.currentDropdown = type;

  // Clear previous search
  this.searchCtrl.setValue('', { emitEvent: false });

  switch (type) {

    case 'account':
      this.filteredLists['account'] = [...this.listOfData];
      break;

    case 'rowAccount':
      this.filteredLists['rowAccount'] = [...this.listOfSale];
      break;
  }
}

onDropdownClosed(select: MatSelect, controlName: string) {

  this.searchCtrl.setValue('', { emitEvent: false });

  const currentValue = this.addEditForm.get(controlName)?.value;

  if (currentValue !== null && currentValue !== undefined && currentValue !== '') {
    setTimeout(() => this.focusNext(select), 100);
  }
}




getAllData() {
  this.http
    .getAllDataId(ApiUrl.listOfAccount, this.companyId)
    .subscribe((res: any) => {
      if (!res || !Array.isArray(res.data)) {
        this.listOfData = [];
       
        return;
      }

      // Filter by companyId
      const filtered = res.data.filter(
        (x: any) => x.companyId === 0 || x.companyId === this.companyId
      );

      // Store all filtered data in listOfSale (for the form)
     

      // Filter only BANK ACCOUNTS and CASH-IN-HAND for dropdown
      const accountTypes = ['BANK ACCOUNTS', 'CASH-IN-HAND'];
      this.listOfData = filtered.filter((x: any) =>
        accountTypes.includes(x.groupName)
      );

      // Sort dropdown list alphabetically
      this.listOfData.sort((a: any, b: any) =>
        a.accountName.localeCompare(b.accountName)
      );
this.filteredLists['account'] = [...this.listOfData];
      this.cdr.detectChanges();
    });
}

getAllSale() {
  this.http
    .getAllDataId(ApiUrl.listOfAccount, this.companyId)
    .subscribe((res: any) => {
      if (!res || !Array.isArray(res.data)) {
        this.listOfSale = [];
        return;
      }

      // Filter by companyId
      const filtered = res.data.filter(
        (x: any) => x.companyId === 0 || x.companyId === this.companyId
      );

      // Exclude these account types (case-insensitive & trim)
      const excludedTypes = ['Expense', 'Sale', 'Purchase'];
      this.listOfSale = filtered
        .filter(
          (x: any) =>
            x.groupCategoryName &&
            !excludedTypes.some(
              (type) =>
                type.toLowerCase() === x.groupCategoryName.trim().toLowerCase()
            )
        )
        .sort((a: any, b: any) => a.accountName.localeCompare(b.accountName)); // ✅ Sort listOfSale
 // ✅ Initialize every row's dropdown list
      this.details.controls.forEach((_, index) => {

        if (!this.rowSearchCtrls[index]) {
          this.rowSearchCtrls[index] = new FormControl('');
        }

        this.filteredRowAccounts[index] = [...this.listOfSale];

      });

      this.cdr.detectChanges();
    });
}

getAllNarration() {
  this.http
    .getAllDataId(ApiUrl.getNarrationList, this.companyId)
    .subscribe((res: any) => {

      if (!res || !Array.isArray(res.data)) {
        this.listOfNarration = [];
        return;
      }

      const filtered = res.data.filter(
        (x: any) => x.companyId === 0 || x.companyId === this.companyId
      );

      this.originalList = filtered.sort((a: any, b: any) =>
        a.narration.localeCompare(b.narration)
      );

      this.listOfNarration = [...this.originalList];
      this.cdr.detectChanges();
       console.log('listOfSale', this.listOfSale);
      console.log('filteredRowAccounts', this.filteredRowAccounts);
    });
}



onItemClosed(select: MatSelect, index: number) {

  const value = this.details.at(index).get('accountId')?.value;

  if (value) {
    setTimeout(() => {
      this.focusNextRegd(select);
    }, 100);
  }
}


formatToDDMMYYYY(dateStr: string | Date): string {
  if (!dateStr) return '';

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';

  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
}


 
updateData(): void {
  this.showSpiner = true;

  this.http.getAllDataId(ApiUrl.getPayentById, this.PaymentReceiptId)
    .subscribe({
      next: (res: any) => {
        if (res?.success && res.data?.PaymentReceipts?.length) {
          const data = res.data.PaymentReceipts[0];

          // Reformat receiptDate to dd-MM-yyyy
          const formattedDate = data.ReceiptDate;

          this.addEditForm.patchValue({
            paymentReceiptId: data.PaymentReceiptId,
            accountName: data.AccountName,
            receiptDate: formattedDate, // always dd-MM-yyyy
            dayName: data.DayName,
            voucherNo: data.VoucherNo,
            narrationForSingleAccount: data.NarrationForSingleAccount,
            companyId: data.CompanyId
          });

          this.details.clear();

          // data.Details.forEach((x: any) => {
          //   this.details.push(
          //     this.createDetailRow({
          //       accountId: x.AccountId,
          //       station: x.Station,
          //       narration: x.Narration,
          //       amount: x.Amount,
          //       crOrDr: x.CrOrDr
          //     })
          //   );
          // });

          data.Details.forEach((x: any) => {

  this.details.push(this.createDetailRow({
    accountId: x.AccountId,
    station: x.Station,
    narration: x.Narration,
    amount: x.Amount,
    crOrDr: x.CrOrDr
  }));

  const index = this.details.length - 1;

  this.rowSearchCtrls[index] = new FormControl('');

  this.filteredRowAccounts[index] = [...this.listOfSale];

  this.rowSearchCtrls[index].valueChanges.subscribe(value => {

    const search = (value || '').toLowerCase();

    this.filteredRowAccounts[index] = this.listOfSale.filter(a =>
      (a.accountName || '').toLowerCase().includes(search)
    ).sort((a: any, b: any) => {

      const aName = (a.accountName || '').toLowerCase();
      const bName = (b.accountName || '').toLowerCase();

      // Items starting with the search text come first
      const aStarts = aName.startsWith(search);
      const bStarts = bName.startsWith(search);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // Then alphabetical order
      return aName.localeCompare(bName);
    });

  });

});
        }
        this.showSpiner = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.showSpiner = false;
        this.cdr.detectChanges();
      }
    });
}


watchVoucherType() {
  this.addEditForm.get('voucherNo')?.valueChanges.subscribe(type => {
    const value = type === 'Receipt' ? 'CR' : 'DR';
    this.details.controls.forEach((row: any) => {
      row.get('crOrDr')?.setValue(value); // always overwrite
    });
  });
}


watchDateChange() {
  this.addEditForm.get('receiptDate')?.valueChanges.subscribe(date => {
    if (!date) return;

    const parts = date.split('-'); // dd-MM-yyyy
    if (parts.length !== 3) return;

    const newDate = new Date(+parts[2], +parts[1] - 1, +parts[0]);
    const dayName = newDate.toLocaleDateString('en-US', { weekday: 'long' });

    this.addEditForm.patchValue({ dayName }, { emitEvent: false });
  });
}



// checkAccount(select: any) {

//   const value = this.addEditForm.get('accountName')?.value;

//   if (!value && !this.alertShown) {

//     this.alertShown = true;

//     alert('Please select Account Name first');

//     setTimeout(() => {
//       select.focus();
//       this.alertShown = false;
//     }, 100);

//   }
// }

checkAccount(select: any) {

  // 🚫 BLOCK in all these cases
  if (
    this.isShortcutTriggered ||
    this.isDialogOpen ||
    this.isCreatingAccount
  ) return;

  const element = select?.nativeElement || select;
  const value = this.addEditForm.get('accountName')?.value;

  if (!value) {
    if (!this.alertShown) {
      this.alertShown = true;

      alert('Please select Account Name first');

      setTimeout(() => {
        element.focus();
        this.alertShown = false;
      }, 100);
    }
  }
}


// checkRowAccount(index: number, select: any) {

//   const value = this.details.at(index).get('accountId')?.value;

//   if (!value) {

//     alert('Please select Account Name');

//     setTimeout(() => {
//       select.focus();
//     }, 100);

//   }

// }

checkRowAccount(index: number, select: any) {

  if (
    this.isShortcutTriggered ||
    this.isDialogOpen ||
    this.isCreatingAccount
  ) return;

  const value = this.details.at(index).get('accountId')?.value;

  if (!value) {
    alert('Please select Account Name');

    setTimeout(() => {
      select.focus();
    }, 100);
  }
}

formatDateInput(event: any) {
  let value = event.target.value;

  // remove all non-digits
  value = value.replace(/\D/g, '');

  if (value.length > 2 && value.length <= 4) {
    value = value.replace(/(\d{2})(\d+)/, '$1-$2');
  } else if (value.length > 4) {
    value = value.replace(/(\d{2})(\d{2})(\d+)/, '$1-$2-$3');
  }

  value = value.substring(0, 10); // dd-MM-yyyy max length

  event.target.value = value;
  this.addEditForm.get('receiptDate')?.setValue(value, { emitEvent: false });
}

onAccountChange(index: number) {

  const accountId = this.details.at(index).get('accountId')?.value;

  if (!accountId) return;

  // 🔍 Find selected account from listOfSale
  const selectedAccount = this.listOfSale.find(
    (x: any) => x.id == accountId
  );

  if (!selectedAccount) return;

  // ✅ Patch stateName OR cityName (your choice)
  this.details.at(index).patchValue({
    station: selectedAccount.stateName   // 🔥 OR cityName
  });

}
makeForm() {

   const today = new Date();

  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const yyyy = today.getFullYear();

  const formattedDate = `${dd}-${mm}-${yyyy}`;
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });

  this.addEditForm = this.fb.group({

    paymentReceiptId: [0],
    companyId: [this.companyId],

    accountName: ['', Validators.required],
    receiptDate: [formattedDate],   // correct format
    dayName: [dayName],
     voucherNo: ['Receipt'],  // <-- default selection
    narrationForSingleAccount: [''],

    details: this.fb.array([])

  });

}

get details(): FormArray {
  return this.addEditForm.get('details') as FormArray;
}



createDetailRow(data?: any): FormGroup {
const voucherType = this.addEditForm?.get('voucherNo')?.value;

 const defaultType = voucherType === 'Receipt' ? 'CR' : 'DR';
  return this.fb.group({

    accountId: [data?.accountId || ''],
    station: [data?.station || ''],
    narration: [data?.narration || ''],
  amount: [
      data?.amount ?? '',
       [
    Validators.required
  ]
      // [
      //   Validators.required,
      //   Validators.pattern(/^-?(?!0(\.0+)?$)\d+(\.\d+)?$/)
      // ]
    ],
    crOrDr: [data?.crOrDr ?? defaultType]  

  });

}


loadReceipt(data: any) {
  const formattedDate = this.formatToDDMMYYYY(data.ReceiptDate);

  this.addEditForm.patchValue({
    paymentReceiptId: data.PaymentReceiptId,
    accountName: data.AccountName,
    receiptDate: formattedDate, // always dd-MM-yyyy
    dayName: data.DayName,
    voucherNo: data.VoucherNo,
    narrationForSingleAccount: data.NarrationForSingleAccount,
    companyId: data.CompanyId
  });

  this.details.clear();

  data.Details.forEach((x: any) => {
    this.details.push(this.createDetailRow(x));
  });
}
addRow(){
   this.activeNarrationRow = null;
  this.details.push(this.createDetailRow());
  const index = this.details.length - 1;

  this.rowSearchCtrls[index] = new FormControl('');

  this.filteredRowAccounts[index] = [...this.listOfSale];

  this.rowSearchCtrls[index].valueChanges.subscribe(value => {

    const search = (value || '').toLowerCase();

    this.filteredRowAccounts[index] = this.listOfSale.filter(x =>
      (x.accountName || '').toLowerCase().includes(search)
    ).sort((a: any, b: any) => {

      const aName = (a.accountName || '').toLowerCase();
      const bName = (b.accountName || '').toLowerCase();

      // Items starting with the search text come first
      const aStarts = aName.startsWith(search);
      const bStarts = bName.startsWith(search);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // Then alphabetical order
      return aName.localeCompare(bName);
    });

  

  });
  this.cdr.detectChanges(); // 🔥 MUST
}

onRowOpened(index: number, opened: boolean) {

  if (!opened) return;
  console.log('listOfSale', this.listOfSale);

  this.rowSearchCtrls[index].setValue('', { emitEvent: false });

  this.filteredRowAccounts[index] = [...this.listOfSale];
}

removeRow(index: number) {

  if (this.details.length > 1) {
    this.details.removeAt(index);
     this.activeNarrationRow = null;
  }

}

setNarration(index: number, event: any) {

  const value = event.target.value;

  this.details.at(index).get('narration')?.setValue(value);

}
onSubmit() {
  this.submit = true;

  if (this.addEditForm.invalid) {
    const firstInvalid = document.querySelector('.ng-invalid') as HTMLElement;
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  const payload = this.addEditForm.value;
const selectedAccount = this.addEditForm.get('accountName')?.value;
  this.http.addEditData(ApiUrl.addEditPaymentReceipt, payload)
    .subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.snackBar.open('Payment / Receipt saved successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snackbar-success']
          });

          // Get current date and day
          const today = new Date();
          const mm = String(today.getMonth() + 1).padStart(2, '0');
          const dd = String(today.getDate()).padStart(2, '0');
          const yyyy = today.getFullYear();
          const formattedDate = `${mm}-${dd}-${yyyy}`;
          const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });

          // Reset form with defaults
          this.addEditForm.reset({
            paymentReceiptId: 0,
            companyId: this.companyId,
            accountName: selectedAccount,
            receiptDate: formattedDate,
            dayName: dayName,
            voucherNo: 'Receipt',
            narrationForSingleAccount: ''
          });

          // Clear and add first empty detail row
          this.details.clear();
          this.addRow();

          // Refresh dropdown list without leaving page
          this.getAllData();
          this.getAllSale();

        } else {
          this.snackBar.open('Something went wrong!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      },
      error: () => {
        this.snackBar.open('Server error occurred', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
}



get isEditMode(): boolean {
  return !!this.PaymentReceiptId && this.PaymentReceiptId > 0;
}






isNarrationInList(value: string): boolean {

  if (!value) return false;

  return this.listOfNarration.some(
    (x: any) => x.narration === value
  );

}
openAccountMaster(data?: any) {
  const dialogRef = this.dialog.open(AddEditAccount, {
     width: '95vw',
     maxWidth: '1500px',
     maxHeight: '100vh',   // only limit, not fixed height
    data: data || null
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
       this.getAllData(); // reload list automatically
       this.getAllSale();
    }
  });
}
openNarrationMaster(data?: any) {
  const dialogRef = this.dialog.open(AddEditNarration, {
    width: '95vw',
    maxWidth: '1200px',
    data: data || null
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.getAllNarration(); // reload list
    }
  });
}
  
  changeLocation() {

    // save current route first
    let currentRoute = this.router.url;
    console.log("rute" , currentRoute)
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentRoute]); // navigate to same route
    }); 
  }

  get f() {
    return this.addEditForm.controls;
    
  }

  closeModel(): void {
     this.dialogRef.close(true);
    
   
  }
}

