import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject,AfterViewInit, NgZone, ViewChild, ElementRef, HostListener, ViewChildren, QueryList } from '@angular/core';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../material.module';
import { AllApiService } from '../../../_core/_service/all-api.service';
import { ApiUrl } from '../../../_core/apiUrl';
import { AddEditAccount } from '../../account-master/add-edit-account/add-edit-account';
import { AddEditSaleHeading } from '../../sale-heading/add-edit-sale-heading/add-edit-sale-heading';
import { AddEditItemMaster } from '../../item-master/add-edit-item-master/add-edit-item-master';
import { AddEditTaxTable } from '../../tax-table-master/add-edit-tax-table/add-edit-tax-table';
import { AddEditTransportMaster } from '../../transport-master/add-edit-transport-master/add-edit-transport-master';
import { AddEditUnitMaster } from '../../unit-master/add-edit-unit-master/add-edit-unit-master';
import { SalePdf } from '../sale-pdf/sale-pdf';
import { MatSelect } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-add-edit-sale',
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule,
    NgxMatSelectSearchModule,MatTooltipModule
  ],
  templateUrl: './add-edit-sale.html',
  styleUrl: './add-edit-sale.scss',
  providers: [TitleCasePipe]
})
export class AddEditSale {

  @HostListener('keydown', ['$event'])
  
onKeyDown(event: KeyboardEvent) {

  if (this.isSaving) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  if (event.repeat) {
    event.preventDefault();
    return;
  }

  if (event.defaultPrevented) {
    return;
  }

  if (event.key !== 'Enter') {
    return;
  }

  const target = event.target as HTMLElement;

  if (target.tagName === 'TEXTAREA' && event.shiftKey) {
    return;
  }


   const input = target as HTMLInputElement;

  if (input.getAttribute('formControlName') === 'rowTotal') {

    const rowIndex = Number(input.getAttribute('data-row'));

    if (!isNaN(rowIndex)) {

      const row = this.saleInvoiceDetails.at(rowIndex) as FormGroup;
      const rowTotal = Number(row.get('rowTotal')?.value) || 0;

      console.log('Row Index:', rowIndex);
      console.log('Row Total:', rowTotal);

      // Stop if Row Total is 0
      if (rowTotal === 0) {
        event.preventDefault();
        input.focus();
        return;
      }
    }
  }

  // Check if Enter was pressed on the Add (+) button
  const row = target.getAttribute('data-row');
  if (row !== null) {
    event.preventDefault();
    this.handleAddRow(+row);
    return;
  }

  event.preventDefault();

  const form = target.closest('form');
  if (!form) return;

  const elements = Array.from(
    form.querySelectorAll(`
      input:not([disabled]),
      textarea:not([disabled]),
      select:not([disabled]),
      button:not([disabled]),
      .mat-mdc-select-trigger,
      [tabindex]
    `)
  ).filter((el: any) =>
    el.offsetParent !== null &&
    !el.hasAttribute('readonly') &&
    el.tabIndex !== -1
  ) as HTMLElement[];

  const index = elements.indexOf(target);

  if (index > -1 && index < elements.length - 1) {
    elements[index + 1].focus();
  } else {
    // this.onSubmit();
  }
}
  
focusNextRegd(select: MatSelect) {

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {

      const current = select._elementRef.nativeElement;
      const form = current.closest('form');
      if (!form) return;

      const elements = Array.from(
        form.querySelectorAll(`
          input:not([disabled]),
          textarea:not([disabled]),
          select:not([disabled]),
          .mat-mdc-select,
          button:not([disabled])
        `)
      ).filter((el: any) =>
        el.offsetParent !== null &&
        !el.hasAttribute('readonly')
      ) as HTMLElement[];

      const index = elements.indexOf(current);

      if (index > -1 && index < elements.length - 1) {
        elements[index + 1].focus();
      }

    });
  });
}
  @ViewChild(MatAutocompleteTrigger)
autocomplete!: MatAutocompleteTrigger;
@ViewChildren('itemSelect') itemSelects!: QueryList<ElementRef>;
 @ViewChild('accountSelect') accountSelect!: MatSelect;
 
  @ViewChild('accountShipTo') accountShipTo!: ElementRef;
  @ViewChild('invoiceHeading') invoiceHeading!: ElementRef;
@ViewChildren('slectItem') slectItem!: QueryList<ElementRef>;
@ViewChildren('unit') unit!: QueryList<ElementRef>;
@ViewChildren('slectTax') slectTax!: QueryList<ElementRef>;
@ViewChildren('slectTransport') slectTransport!: QueryList<ElementRef>;
 @ViewChild('transportManualInput') transportManualInput!: ElementRef;
 @ViewChildren('deleteBtn')
deleteButtons!: QueryList<ElementRef<HTMLButtonElement>>;
@ViewChildren('addBtn')
addButtons!: QueryList<ElementRef<HTMLButtonElement>>;
@ViewChild('valueInput')
valueInput!: ElementRef<HTMLInputElement>;
@ViewChild('value1Input')
value1Input!: ElementRef<HTMLInputElement>;
@ViewChild('saveButton') saveButton!: ElementRef<HTMLButtonElement>;
@ViewChild('otherChargeSelect1') otherChargeSelect1!: MatSelect;
@ViewChild('addNewButton')
addNewButton!: ElementRef<HTMLButtonElement>;
 isSaving = false;
 showSpiner = true;
  submit = false ;
  companyId:any;
  userName:any;
  isEditing = false;
  alertMessage =''
  addEditForm!:FormGroup;
  categoryId:any;
  successMessage = '';
  errorMessage = '';
  messageSuccess = true;
  listOfData: any[] = [];

  listOfSaleHeadingData: any[]=[];
  listOfAllAccount:any []=[];
  otherValueAccount:any[]=[];
  listOfShareTo:any []=[];
  listOfTransport:any []=[];
  listOfAllItem:any []=[];
  
  itemSearchControls:
FormControl[] = [];
  listOfTaxTableData:any []= [];
   originalList: any[] = [];
   listOfUnit:any[]=[];
   calculateFromPercent!: () => void;
   calculateFromAmount!: () => void;
   isPopupOpen = false;
   lastShiftTime = 0;
   screenConfig: any;
   headingPermission: string = '0';
   displayCentralGstRate:any;
displayLocalGstRate:any;
displayTcsRate:any;
displaySwachBharatRate:any;
  showTransportManual: boolean = false;
 partySearchControl = new FormControl('');
filteredAccounts: any[] = [];
filteredLists: { [key: string]: any[] } = {};
 currentDropdown = '';
 searchCtrl = new FormControl('');

itemSearchCtrls: { [key: number]: FormControl } = {};
filteredItems: { [key: number]: any[] } = {};
taxSearchCtrls: { [key: number]: FormControl } = {};
filteredTaxes: { [key: number]: any[] } = {};
currentRow = -1;
showAddNewOption = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,private titleCase: TitleCasePipe ,private http:AllApiService,private cRouter:ActivatedRoute,
  private router: Router,private ngZone: NgZone,public dialog: MatDialog,
  private snackBar: MatSnackBar,
  private cdr: ChangeDetectorRef,public dialogRef: MatDialogRef<AddEditSale>){}
 

  ngOnInit(): void {
    this.companyId = JSON.parse(localStorage.getItem('loggedUser') || '{}').companyId;
     this.userName = JSON.parse(localStorage.getItem('loggedUser') || '{}').username;
    
    
    this.data;
    
    
      this.categoryId = Number(this.data?.saleInvoiceId) || 0;
      this.isEditing = this.categoryId > 0;
   
 
    this.makeForm();
     this.setupValueChanges();
  this.loadInitialData(); // 🔥 SINGLE ENTRY POINT
this.getInvoiceHeading();
  
    if(this.categoryId) { 
      
      //  this.updateData() ;
      
   }
   else{
   this.showSpiner = false;
      }
   }

   
   private setupValueChanges(): void {

  this.addEditForm.get('invoiceHeadingInt')?.valueChanges
    .subscribe(val => {
      if (val && !this.isEditMode) {
        this.getNextInvoiceNumber(val);
      }
    });

  this.addEditForm.get('value')?.valueChanges.subscribe(v => {
    this.updateOtherChargeValidation('value', 'otherCharge', v);
    this.recalculateSubTotal();
  });

  this.addEditForm.get('value1')?.valueChanges.subscribe(v => {
    this.updateOtherChargeValidation('value1', 'otherCharge1', v);
    this.recalculateSubTotal();
  });
   this.addEditForm.get('accountId')?.valueChanges.subscribe((val:any)=>{
    
    const shipTo = this.addEditForm.get('shipTo')?.value;

    // Only auto fill if ShipTo is empty
    if(val && (!shipTo || shipTo === 0)){
      this.addEditForm.patchValue({
        shipTo: val
      });
    }

  });
    this.searchCtrl.valueChanges.subscribe(search => {

  search = (search || '').toLowerCase();

  switch (this.currentDropdown) {

    case 'party':
      this.filteredLists['party'] = this.listOfAllAccount.filter(x =>
        (x.accountName || '').toLowerCase().includes(search)
      ).sort((a, b) => {
      const aName = (a.accountName || '').toLowerCase();
      const bName = (b.accountName || '').toLowerCase();

      const aStarts = aName.startsWith(search);
      const bStarts = bName.startsWith(search);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return aName.localeCompare(bName);
    });
     
      break;



     
  }

});

}

onOpened(type: string, opened: boolean,index?: number) {

  if (!opened) {
    return;
  }

  this.currentDropdown = type;

  // Clear previous search
  this.searchCtrl.setValue('', { emitEvent: false });

  switch (type) {

    case 'party':
      this.filteredLists['party'] = [...this.listOfAllAccount];
      break;

    case 'item':

  this.saleInvoiceDetails.controls.forEach((_, index) => {

    this.filteredItems[index] = [...this.listOfAllItem];

    this.itemSearchCtrls[index]?.setValue('', {
      emitEvent: false
    });

  });

  break;

  case 'tax':

  this.saleInvoiceDetails.controls.forEach((_, index) => {

    this.filteredTaxes[index] = [...this.listOfTaxTableData];

    this.taxSearchCtrls[index]?.setValue('', {
      emitEvent: false
    });

  });

break;
    
  }
}


onItemClosed(select: MatSelect, index: number) {

  const value = this.saleInvoiceDetails.at(index).get('itemId')?.value;

  if (value && value != 0) {

    setTimeout(() => {
      this.focusNextRegd(select);
    }, 100);

  }
}

onDropdownClosed(select: MatSelect, controlName: string) {

  Object.keys(this.itemSearchCtrls).forEach(key => {

  this.itemSearchCtrls[+key]?.setValue('', {
    emitEvent: false
  });

  this.filteredItems[+key] = [...this.listOfAllItem];

});

  const currentValue = this.addEditForm.get(controlName)?.value;

  if (currentValue !== null && currentValue !== undefined && currentValue !== '') {
    setTimeout(() => this.focusNextRegd(select), 100);
  }
}


// onPartyKeyDown(event: KeyboardEvent) {
//   const headingId = this.addEditForm.get('accountId')?.value;

//   if (event.key === 'Tab' && !headingId) {
//     event.preventDefault(); // stop tab movement
//     this.addEditForm.get('accountId')?.markAsTouched();
//     alert('Please select Invoice Heading first');
//   }
// }

onPartyKeyDown(event: KeyboardEvent) {
  const accountId = this.addEditForm.get('accountId')?.value;

  if (
    (event.key === 'Enter' || event.key === 'Tab') &&
    (!accountId || accountId == 0)
  ) {
    event.preventDefault();
    event.stopPropagation();

    this.addEditForm.get('accountId')?.markAsTouched();

    this.snackBar.open('Please select Party Name', 'Close', {
      duration: 2000
    });

    // setTimeout(() => {
    //   this.accountSelect.focus();
    //   this.accountSelect.open(); // optional
    // });
         setTimeout(() => {
    this.focusNextRegd(this.accountSelect);
  }, 200);

    return;
  }
}

onTaxClosed(select: MatSelect, index: number) {

  const value =
    this.saleInvoiceDetails
      .at(index)
      .get('taxableValueId')
      ?.value;

  if (value) {

    setTimeout(() => {

      this.focusNextRegd(select);

    }, 100);

  }

}



handleMatSelectEnter(select: MatSelect, controlName: string) {

  const value = this.addEditForm.get(controlName)?.value;

  event?.preventDefault();

  if (select.panelOpen) {
    return;
  }

  // Value exists (including 0)
  if (value !== null && value !== undefined && value !== '') {
    this.focusNextRegd(select);
  } else {
    select.open();
  }
}

handleMatSelectEnterIndex(
   event: any,
  select: MatSelect,
  i: number
) {
  event.preventDefault();
  event.stopPropagation();

  if (select.panelOpen) {
    return;
  }

  const value = this.saleInvoiceDetails.at(i).get('itemId')?.value;

  if (!value || value === 0) {
    select.open();
    return;
  }

  this.focusNextRegd(select);
}

onHeadingKeyDown(event: KeyboardEvent) {
  const headingId = this.addEditForm.get('invoiceHeadingInt')?.value;

  if (event.key === 'Tab' && !headingId) {
    event.preventDefault(); // stop moving forward
    this.addEditForm.get('invoiceHeadingInt')?.markAsTouched();
    alert('Please select Invoice Heading');
  }
}

@HostListener('document:keydown', ['$event'])
handleKeyboardShortcuts(event: KeyboardEvent) {

  const activeElement = document.activeElement;

  if (event.altKey && event.key.toLowerCase() === 'c') {

    // // Account
    // if (activeElement === this.accountSelect?.nativeElement) {
    //   event.preventDefault();
    //   this.openAccountMaster();
    //   return;
    // }

        if (event.altKey && event.key.toLowerCase() === 'c') {
     if (
      activeElement === this.accountSelect?._elementRef.nativeElement ||
      this.accountSelect?.focused
  ) {
    event.preventDefault();
    this.openAccountMaster();
  }
  }
    
    if (activeElement === this.accountShipTo?.nativeElement) {
      event.preventDefault();
      this.openAccountMaster();
      return;
    }
   const isTransportFocused = this.slectTransport?.some(
  (el) => el.nativeElement === activeElement
);

if (isTransportFocused) {
  event.preventDefault();
  this.openTransport();
  return;
}

    if (activeElement === this.invoiceHeading?.nativeElement) {
      event.preventDefault();
      this.openInvouveHeadingMaster();
      return;
    }

    // ✅ Check ALL item selects
    const isItemFocused = this.slectItem?.some(
      (el) => el.nativeElement === activeElement
    );

    if (isItemFocused) {
      event.preventDefault();
      this.openItemMaster();
      return;
    }


       // ✅ Check ALL item selects
    const isUnitFocused = this.unit?.some(
      (el) => el.nativeElement === activeElement
    );

    if (isUnitFocused) {
      event.preventDefault();
      this.addUnitShorcut()
      return;
    }
      // ✅ Check ALL item selects
    const isTaxFocused = this.slectTax?.some(
      (el) => el.nativeElement === activeElement
    );

    if (isTaxFocused) {
      event.preventDefault();
      this.openTaxTable();
      return;
    }
    
  }
  

  
 if (event.altKey && event.key.toLowerCase() === 'f') {
    event.preventDefault();
    this.showTransportManual = !this.showTransportManual;

    // Optional: clear or focus input when shown
    if (this.showTransportManual) {
      setTimeout(() => {
        this.transportManualInput?.nativeElement.focus();
      }, 0);
    }
  }


   if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'x') {
    event.preventDefault();

    if (this.currentRow > 0) {
      this.removeInvoiceDetailRow(this.currentRow);
    }
  }
  
}

  




onItemKeyDown(event: KeyboardEvent, index: number): void {
  const itemControl = this.saleInvoiceDetails.at(index).get('itemId');

  if (!itemControl) {
    return;
  }

  if (
    (event.key === 'Enter' || event.key === 'Tab') &&
    (!itemControl.value || itemControl.value == 0)
  ) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    itemControl.markAsTouched();

    itemControl.setErrors({
      ...(itemControl.errors || {}),
      required: true
    });

    this.snackBar.open('Please select Item', 'Close', {
      duration: 2000
    });

    setTimeout(() => {
      this.itemSelects.toArray()[index]?.nativeElement.focus();
    });

    return;
  }
}

onTaxDown(event: KeyboardEvent, index: number) {
  const itemControl = this.saleInvoiceDetails
    .at(index)
    .get('taxableValueId');

  if (event.key === 'Tab' && (!itemControl?.value || itemControl.value == 0)) {
    event.preventDefault(); // stop tab
    itemControl?.markAsTouched();
    alert('Please select Sale Tax');
  }
}





loadInitialData(): void {
  this.showSpiner = true;

  Promise.all([
    this.getSaleHeading(),
    this.getAllAccountData(),
    this.getAllShareTo(),
    this.getAllItemData(),
    this.getAllTaxTableData(),
    this.getScreenManagement(),
    this.getAllTransportData(),
    this.getAllUnit(),
   
  ])
  .then(() => {

    if (this.categoryId) {

      // ✅ EDIT MODE
      this.updateData();

    } else {

      // ✅ ADD MODE
      this.getInvoiceHeading();

    }

  })
  .finally(() => {
    this.showSpiner = false;
    this.cdr.detectChanges();
  });

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
togglePopup() {
  this.isPopupOpen = !this.isPopupOpen;

  // Disable / enable all controls inside popup
  const popupControls = [
    'orderNo','vehicle','formNo','weight','creditDays','packingNo','docuThru','station',
    'rgpNo','dated','freight','packages','pvtMark','dueDate','ecomGSTIN','ewayNo',
    'shBNo','shipDate','shipPartNo','portLoading','portDischarge','finalDestination'
  ];

  popupControls.forEach(ctrlName => {
    const ctrl = this.addEditForm.get(ctrlName);
    if (ctrl) {
      if (this.isPopupOpen) {
        ctrl.enable();
      } else {
        ctrl.disable(); // ❌ disables tab & typing
      }
    }
  });
}

onHeadingSelect(event: any) {
  const headingId = event.target.value; // the selected ID
   this.http.getAllDataId(ApiUrl.getSaleHeading,headingId)
    .subscribe({
      next: (res: any) => {
        console.log('API RESPONSE:', res);

        // Make sure the API call was successful and data exists
        if (res?.success && res.data) {
          const data = res.data; // extract actual group object

            this.headingPermission = data.permission; // store permission
        console.log('Permission:', this.headingPermission);
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
 
  if (!headingId) return;

  // Call your existing logic to get next invoice number
  this.getNextInvoiceNumber(Number(headingId));
}



getSaleHeading() {
   return this.http.getAllDataId(ApiUrl.listSaleHeading, this.companyId)
    .toPromise()
    .then((res: any) => {
      this.listOfSaleHeadingData = res?.data || [];
    });
}

getNextInvoiceNumber(headingId: number) {
  if (!headingId) return;

  const heading = this.listOfSaleHeadingData.find(
    x => Number(x.id) === Number(headingId)
  );
  if (!heading) return;

  const startFrom = Number(heading.numberStartFrom);
  const prefix = heading?.prefix?.trim() || '';
  const suffix = heading?.suffix?.trim() || '';   // ✅ add this

  this.http
    .getNextInvoiceNo(this.companyId, headingId, startFrom, prefix, suffix)
    .subscribe({
      next: res => {
        const nextNo = res.nextInvoiceNo?.toString();
        if (nextNo) {
          this.addEditForm.patchValue(
            { invoiceNo: nextNo },
            { emitEvent: false }
          );
        }
      },
      error: err => console.error('Error fetching next invoice:', err)
    });
}









getSaleShortCode(typeOfSale: string): string {
  if (!typeOfSale) return '';

  return typeOfSale
    .split(' ')
    .map(w => w.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

formatDateInput(event: any) {
  const input = event.target as HTMLInputElement;
  let rawValue = input.value.trim();

  // 1️⃣ If user entered MM-dd-yyyy manually
  const manualMatch = rawValue.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (manualMatch) {
    const [_, month, day, year] = manualMatch;
    const date = new Date(`${year}-${month}-${day}`);

    if (!isNaN(date.getTime())) {
      // valid manual date → keep it
      input.value = rawValue;
      this.updateFormControl(input, rawValue);
      return;
    }
  }

  // 2️⃣ If user entered digits only (like 20250205)
  let digits = rawValue.replace(/\D/g, "");
  if (digits.length >= 6) {
    const year = digits.substring(0, 4);
    const month = digits.substring(4, 6);
    const day = digits.substring(6) || '01';

    const date = new Date(`${year}-${month}-${day}`);

    if (!isNaN(date.getTime())) {
      const formatted = this.formatDateForInput(date);
      input.value = formatted;
      this.updateFormControl(input, formatted);
      return;
    }
  }

  // 3️⃣ Invalid → use current date
  const today = this.formatDateForInput(new Date());
  input.value = today;
  this.updateFormControl(input, today);
}

private updateFormControl(input: HTMLInputElement, value: string) {
  const controlName = input.getAttribute('formControlName');
  if (controlName) {
    this.addEditForm.get(controlName)?.setValue(value);
  }
}






updateOtherChargeValidation(
  valueControlName: string,
  chargeControlName: string,
  val: number
) {
  const chargeControl = this.addEditForm.get(chargeControlName);
  if (!chargeControl) return;

  val = Number(val); // 🔥 ensure number

  if (val === 0) {
    // ❌ ONLY disable for 0
    chargeControl.setValue(0, { emitEvent: false });
    chargeControl.clearValidators();
    chargeControl.disable({ emitEvent: false });

  } else if (val > 0) {
    // ✅ positive → enable + required
    chargeControl.enable({ emitEvent: false });
    chargeControl.setValidators([Validators.required, this.notZeroValidator]);

  } else {
    // ✅ negative → enable only (NO validation)
    chargeControl.enable({ emitEvent: false });
    chargeControl.clearValidators();
  }

  chargeControl.updateValueAndValidity({ emitEvent: false });
}


// Custom validator to ensure select is not zero
notZeroValidator(control: any) {
  return control.value && control.value != 0 ? null : { required: true };
}

getTabIndexBasedOnValue(): number {
  const value = Number(this.addEditForm.get('value')?.value);
 return value === 0 ? -1 : 0;
}
getTabIndexBasedOnValue1(): number {
  const value = Number(this.addEditForm.get('value1')?.value);
  return value === 0 ? -1 : 0;
}




 getScreenManagement(): void {
  this.http
    .getAllDataId(ApiUrl.listOfScreenManagement, this.companyId)
    .subscribe((res: any) => {
      if (res?.success && res?.data?.length) {
        this.screenConfig = res.data[0]; // 👈 important
        this.applySaleScreenConfig();
      }

      this.cdr.detectChanges();
    });
}
applySaleScreenConfig() {
  const cfg = this.screenConfig;

  this.saleInvoiceDetails.controls.forEach(row => {
    this.toggle(row, 'barcode', cfg?.barcodeSale);
    this.toggle(row, 'hsn', cfg?.hsnsale);
      // ✅ FIX HERE
    this.toggle(row, 'mRate', cfg?.mRateSale);
    this.toggle(row, 'discPer', cfg?.discPercentSale);
    this.toggle(row, 'discAmt', cfg?.discountSale);
    this.toggle(row, 'remarks', cfg?.remarksSale);

    this.toggle(row, 'art', cfg?.artSale);
    this.toggle(row, 'size', cfg?.sizeSale);
    this.toggle(row, 'color', cfg?.colorSale);
    this.toggle(row, 'pack1', cfg?.pack1Sale);
    this.toggle(row, 'pack2', cfg?.pack2Sale);
     this.toggle(row, 'pack2', cfg?.pack2Sale);
  
  });
}
private toggle(row: any, controlName: string, enabled: boolean) {
  const ctrl = row.get(controlName);
  if (!ctrl) return;

  enabled
    ? ctrl.enable({ emitEvent: false })
    : ctrl.disable({ emitEvent: false });
}




getAllAccountData() {
  this.http
    .getAllDataId(ApiUrl.listOfAccount, this.companyId)
    .subscribe((res: any) => {

      if (!res || !Array.isArray(res.data)) {
        this.listOfAllAccount = [];
        return;
      }

      const filtered = res.data
        .filter((x: any) =>
          (x.companyId === 0 || x.companyId === this.companyId) &&
          (x.groupName === 'SUNDRY DEBTORS' ||
           x.groupName === 'SUNDRY CREDITORS')
        )
        .sort((a: any, b: any) =>
          a.accountName.localeCompare(b.accountName)
        );

      this.originalList = filtered;
      this.listOfAllAccount = [...filtered];
      this.filteredLists['party'] = [...this.listOfAllAccount];
      this.filteredAccounts = [...filtered];

// Search filter
this.partySearchControl.valueChanges.subscribe((value: any) => {

  const search = (value || '').toLowerCase();

  this.filteredAccounts = this.listOfAllAccount.filter((x: any) =>
    x.accountName?.toLowerCase().includes(search) ||
    x.cityName?.toLowerCase().includes(search)
  );

});

        // 🔹 OTHER CHARGE LIST
      this.otherValueAccount = res.data
        .filter((x: any) =>
          (x.companyId === 0 || x.companyId === this.companyId) &&
          x.groupName === '	DIRECT EXPENSES'||
           x.groupName === 'INDIRECT EXPENSES'||
            x.groupName === 'MFG. EXPENSES'
        )
        .sort((a: any, b: any) =>
          a.accountName.localeCompare(b.accountName)
        );
 // ✅ NOW subscribe (after data loaded)
      this.addEditForm.get('accountId')?.valueChanges.subscribe(id => {

        const account = this.listOfAllAccount.find(x => x.id == id);
        

        if (account) {
          this.addEditForm.patchValue({
            transport: account.transportId || 0
          }, { emitEvent: false });
        }

      });
      this.cdr.detectChanges();
    });
}


onAccountSelect(event: any) {

  const selectedText = event.option.value;

  const selectedAccount =
    this.listOfAllAccount.find((x: any) =>
      `${x.accountName} - ${x.cityName}` === selectedText
    );

  if (selectedAccount) {

    this.addEditForm.patchValue({
      accountId: selectedAccount.id
    });

    this.onAccountChange({
      target: { value: selectedAccount.id }
    });
  }
}



getAllShareTo() {
  this.http
    .getAllDataId(ApiUrl.listOfAccount,this.companyId)
    .subscribe((res: any) => {

      if (!res || !Array.isArray(res.data)) {
        this.listOfShareTo = [];
        return;
      }

      const filtered = res.data
        .filter((x: any) =>
          (x.companyId === 0 || x.companyId === this.companyId) &&
          (x.groupName === 'SUNDRY DEBTORS' ||
           x.groupName === 'SUNDRY CREDITORS')
        )
        .sort((a: any, b: any) =>
          a.accountName.localeCompare(b.accountName)
        );

      this.originalList = filtered;
      this.listOfShareTo = [...filtered];

      this.cdr.detectChanges();
    });
}

getAllTransportData() {
  this.http
    .getAndEditById(ApiUrl.getAndEdit,this.companyId)
    .subscribe((res: any) => {

      if (!res || !Array.isArray(res.data)) {
        this.listOfTransport = [];
        return;
      }

      const filtered = res.data.filter(
        (x: any) => x.companyId === 0 || x.companyId === this.companyId
      );

      this.originalList = filtered.sort((a: any, b: any) =>
        a.name.localeCompare(b.name)
      );

      this.listOfTransport = [...this.originalList];
      this.cdr.detectChanges();
    });
}


getAllItemData() {
  this.http
    .getAllDataId(ApiUrl.listOfItemMaster, this.companyId)
    .subscribe((res: any) => {

      if (!res || !Array.isArray(res.data)) {
        this.listOfAllItem = [];
        return;
      }

      const filtered = res.data.filter(
        (x: any) => x.companyId === 0 || x.companyId === this.companyId
      );

      this.originalList = filtered.sort((a: any, b: any) =>
        a.itemName.localeCompare(b.itemName)
      );

      this.listOfAllItem = [...this.originalList];
      this.saleInvoiceDetails.controls.forEach((_, index) => {

  this.filteredItems[index] = [...this.listOfAllItem];

});
      // initialize filtered items for rows
      this.saleInvoiceDetails.controls.forEach(
        (_, index) => {
          this.filteredItems[index] =
            [...this.listOfAllItem];
            
        }
        
      );

      

      this.cdr.detectChanges();
  
    });
}
searchItem(event: any, index: number) {

  const value =
    (event.target.value || '').toLowerCase();

  this.filteredItems[index] =
    this.listOfAllItem.filter((x: any) =>
      x.itemName?.toLowerCase()
        .includes(value)
    );
}

onItemSelect(itemId: number, index: number) {

  const row =
    this.saleInvoiceDetails.at(index);

  row.get('itemId')
    ?.setValue(itemId);

  this.onItemChange(index);
}

focusNextInput(i: number) {
  setTimeout(() => {
    const next = document.querySelectorAll('input,select,textarea')[i + 1] as HTMLElement;
    next?.focus();
  }, 100);
}
getAllUnit() {
  this.http
    .getAllDataId(ApiUrl.listOfUnitMaster, this.companyId)
    .subscribe((res: any) => {

      if (!res || !Array.isArray(res.data)) {
        this.listOfUnit = [];
       
        return;
      }

      const filtered = res.data.filter(
        (x: any) => x.companyId === 0 || x.companyId === this.companyId
      );

      this.originalList = filtered.sort((a: any, b: any) =>
        a.unitName.localeCompare(b.unitName)
      );

      this.listOfUnit = [...this.originalList];
       console.log(this.listOfUnit)
      this.cdr.detectChanges();
    });
}

getUnitDecimal(unitId: number): number {
  const unit = this.listOfUnit.find(
    (x: any) => Number(x.id) === Number(unitId)
  );

  return Number(unit?.decimal ?? 0);
}



onAccountChange(event: any) {
  console.log(event.value);

  const accountId = event.value;
  const selectedAccount = this.listOfAllAccount.find(
    (x: any) => x.id === accountId
  );

  if (selectedAccount) {

    const transportId = selectedAccount.transportId || 0;

    this.addEditForm.patchValue({
      transport: transportId
    });

  }

}
getHighlightedParts(text: string) {
  const search = (this.searchCtrl.value || '').trim();

  if (!search) {
    return {
      before: text,
      match: '',
      after: ''
    };
  }

  const index = text.toLowerCase().indexOf(search.toLowerCase());

  if (index === -1) {
    return {
      before: text,
      match: '',
      after: ''
    };
  }

  return {
    before: text.substring(0, index),
    match: text.substring(index, index + search.length),
    after: text.substring(index + search.length)
  };
}

getHighlightedPartsItems(text: string, search: string) {
  search = (search || '').trim();

  if (!search) {
    return {
      before: text,
      match: '',
      after: ''
    };
  }

  const index = text.toLowerCase().indexOf(search.toLowerCase());

  if (index === -1) {
    return {
      before: text,
      match: '',
      after: ''
    };
  }

  return {
    before: text.substring(0, index),
    match: text.substring(index, index + search.length),
    after: text.substring(index + search.length)
  };
}

onItemChange(index: number) {
  const row = this.saleInvoiceDetails.at(index) as FormGroup;
  const itemId = row.get('itemId')?.value;
  

  if (!itemId) return;

  const selectedItem = this.listOfAllItem.find(
    x => x.itemId === Number(itemId)
  );
 
  if (!selectedItem) return;

  // row.patchValue({
  //   barcode: selectedItem.itemBarCodeOrPartNo || '',
  //   hsn: selectedItem.hsn || '',
  //   rate: selectedItem.saleRate || 0,
  //   mRate: selectedItem.mrpRate || 0,
  //   taxPercent: selectedItem.taxRate || 0,
  //   unit :selectedItem.unitInt || 0,
  //   taxableValueId:
  // selectedItem.cgstSgstSale > 0
  //   ? selectedItem.cgstSgstSale
  //   : selectedItem.igstSaleName > 0
  //   ? selectedItem.igstSaleName
  //   : null
   
  // });
 const taxId =
  selectedItem.cgstSgstSale > 0
    ? Number(selectedItem.cgstSgstSale)
    : selectedItem.igstSaleName > 0
    ? Number(selectedItem.igstSaleName)
    : null;
this.filteredTaxes[index] = [...this.listOfTaxTableData];

row.patchValue({
  barcode: selectedItem.itemBarCodeOrPartNo || '',
  hsn: selectedItem.hsn || '',
  rate: selectedItem.saleRate || 0,
  mRate: selectedItem.mrpRate || 0,
  taxPercent: selectedItem.taxRate || 0,
  unit: selectedItem.unitInt || 0
});

setTimeout(() => {
  row.get('taxableValueId')?.setValue(taxId);
  this.cdr.detectChanges();
  this.onTaxChange(index);
}, 0);
 
  
    this.formatQty(index);
    
     this.onTaxChange(index);
     
     setTimeout(() => {
    this.onRowTotalBlur(index);
  }, 0);
  
}
formatQty(index: number) {
  const row = this.saleInvoiceDetails.at(index) as FormGroup;

  const qtyControl = row.get('qty');
  const qty = Number(qtyControl?.value || 0);

  const unitId = row.get('unit')?.value;

  // find selected unit
  const unit = this.listOfUnit.find(
    (x: any) => Number(x.id) === Number(unitId)
  );

  const decimalPlaces = Number(unit?.decimal ?? 0);

  // auto format qty
  qtyControl?.setValue(
    qty.toFixed(decimalPlaces),
    { emitEvent: false }
  );
}
onQtyBlur(index: number) {
  const row = this.saleInvoiceDetails.at(index) as FormGroup;

  const qtyControl = row.get('qty');
  const unitId = row.get('unit')?.value;

  if (!qtyControl || !unitId) return;

  // find selected unit
  const selectedUnit = this.listOfUnit.find(
    (x: any) => Number(x.id) === Number(unitId)
  );

  const decimalPlaces = Number(selectedUnit?.decimal ?? 0);

  // convert qty to number
  const qty = parseFloat(qtyControl.value || 0);

  // format according to decimal
  qtyControl.setValue(
    qty.toFixed(decimalPlaces),
    { emitEvent: false }
  );
}


getAllTaxTableData() {
  this.http
    .getAllDataId(ApiUrl.listOfTaxTable,this.companyId)
    .subscribe((res: any) => {

      if (!res || !Array.isArray(res.data)) {
        this.listOfTaxTableData = [];
        return;
      }

      const filtered = res.data.filter(
        (x: any) => x.companyId === 0 || x.companyId === this.companyId
      );

     this.originalList = filtered.sort((a: any, b: any) =>
  (a.salePurcAccountName ?? '').localeCompare(b.salePurcAccountName ?? '')
);

      this.listOfTaxTableData = [...this.originalList];
      this.cdr.detectChanges();
    });
}


isLoading = false;
updateData(): void {



  this.http
    .getAllDataIdSale(ApiUrl.getSaleDataForUpdate, this.categoryId)
    .subscribe((d: any) => {

      console.log('API DATA:', d);

      if (!d) {
        console.warn('No data received');
        return;
      }

      // Only parse if string response
      if (typeof d === 'string') {
        try {
          d = JSON.parse(d);
        } catch (err) {
          console.error('JSON parse failed:', err);
          return;
        }
      }

      // saleInvoiceDetails may come as string after SQL JSON_QUERY
      if (typeof d.saleInvoiceDetails === 'string') {
        try {
          d.saleInvoiceDetails = JSON.parse(d.saleInvoiceDetails);
        } catch (err) {
          console.error('saleInvoiceDetails parse failed:', err);
          d.saleInvoiceDetails = [];
        }
      }

      console.log('PARSED DATA:', d);

      /* ===== PATCH HEADER ===== */
      this.addEditForm.patchValue({
        saleInvoiceId: d.SaleInvoiceId,
        invoiceHeading: d.InvoiceHeading,
        invoiceHeadingInt: d.InvoiceHeadingInt,
        companyId: d.CompanyId,
        invoiceNo: d.InvoiceNo ?? '',
        shipTo: d.ShipTo ?? '',
        accountId: d.AccountId,

        invoiceDate: d.InvoiceDate ? this.safeDate(d.InvoiceDate) : '',
        claimDate: new Date(),
        dueDate: this.safeDate(d.DueDate),
        shipDate: this.safeDate(d.ShipDate),
        dated: this.safeDate(d.Dated),

      
        transport: d.Transport,
        TransportNameManual: d.TransportNameManual,
        shippingBillNo: d.ShippingBillNo,
        grNo: d.GRNo,
        orderNo: d.OrderNo,
        vehicle: d.Vehicle,
        formNo: d.FormNo,
        weight: d.Weight,
        creditDays: d.CreditDays,
        packingNo: d.PackingNo,
        docuThru: d.DocuThru,
        station: d.Station,
        rgpNo: d.RGPNo,

        freight: d.Freight,
        packages: d.Packages,
        pvtMark: d.PvtMark,

        ecomGSTIN: d.EcomGSTIN,
        ewayNo: d.EwayNo,
        shBNo: d.ShBNo,
        shipPartNo: d.ShipPartNo,
        portLoading: d.PortLoading,
        portDischarge: d.PortDischarge,
        finalDestination: d.FinalDestination,

        subTotal: d.SubTotal,
        roundAndTotal: d.RoundAndTotal,
        taxableSale: d.TaxableSale,

        centralGst: d.CentralGst,
        localGst: d.LocalGst,
        tcs: d.Tcs,
        swachBharat: d.SwachBharat,

        otherCharge: d.OtherCharge,
        value: d.Value,
        otherCharge1: d.OtherCharge1,
        value1: d.Value1,
        extraAmount: d.ExtraAmount,

        entrBy: d.EntrBy,
        entryDate: this.safeDate(d.EntryDate)

      }, { emitEvent: false });

      /* Transport manual */
      this.showTransportManual =
        !d.Transport || d.Transport === 0;

      if (this.showTransportManual) {
        setTimeout(() => {
          this.transportManualInput?.nativeElement.focus();
        }, 0);
      }

      /* ===== PATCH DETAILS ===== */
      this.saleInvoiceDetails.clear();
this.itemSearchCtrls = {};
this.filteredItems = {};
      (d.saleInvoiceDetails || []).forEach((row: any,index: number) => {

        const fg = this.createSaleInvoiceDetail();

        fg.patchValue({
          saleInvoiceDetailId: row.SaleInvoiceDetailId,
          saleInvoiceId: row.SaleInvoiceId,
          itemId: row.ItemId,
          remarks: row.Remarks,
          hsn: row.HSN,
          artNo: row.ArtNo,
          unit: row.Unit,
          qty: row.Qty,
          rate: row.Rate,
          mRate: row.MRate,
          discPer: row.DiscPer,
          discAmt: row.DiscAmt,
          taxableValueId: row.TaxableValueId,
          accountId: row.AccountId,
          taxPercent: row.TaxPercent,
          rowTotal: row.RowTotal,
          taxTableRowSubTotal: row.taxTableRowSubTotal

        }, { emitEvent: false });

        this.saleInvoiceDetails.push(fg);
          // Initialize search for this row
  this.filteredItems[index] = [...this.listOfAllItem];

  this.itemSearchCtrls[index] = new FormControl('');

  this.itemSearchCtrls[index].valueChanges.subscribe(value => {

    const search = (value || '').toLowerCase();

    this.filteredItems[index] = this.listOfAllItem.filter(item =>
      (item.itemName || '').toLowerCase().includes(search)
    ).sort((a: any, b: any) => {

      const aName = (a.itemName || '').toLowerCase();
      const bName = (b.itemName || '').toLowerCase();

      const aStarts = aName.startsWith(search);
      const bStarts = bName.startsWith(search);

      // Items starting with search come first
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // Then alphabetical
      return aName.localeCompare(bName);
    });
;

  });

  this.filteredTaxes[index] = [...this.listOfTaxTableData];

this.taxSearchCtrls[index] = new FormControl('');

// this.taxSearchCtrls[index].valueChanges.subscribe(value => {

//   const search = (value || '').toLowerCase();

//   this.filteredTaxes[index] =
//     this.listOfTaxTableData.filter(tax =>
//       (tax.salePurcAccountName || '')
//         .toLowerCase()
//         .includes(search)
//     );

// });
this.taxSearchCtrls[index].valueChanges.subscribe(value => {

  const search = (value || '').toLowerCase().trim();

  this.filteredTaxes[index] = this.listOfTaxTableData
    .filter((tax: any) =>
      (tax.salePurcAccountName || '').toLowerCase().includes(search)
    )
    .sort((a: any, b: any) => {

      const aName = (a.salePurcAccountName || '').toLowerCase();
      const bName = (b.salePurcAccountName || '').toLowerCase();

      const aStarts = aName.startsWith(search);
      const bStarts = bName.startsWith(search);

      // Names starting with search text first
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // Then alphabetical
      return aName.localeCompare(bName);
    });

});
        this.listenRowCalculation(fg);
        this.recalculateTax(fg);
      });

      /* FINAL TOTAL RECALC */
      this.recalculateInvoiceTaxRates();
      this.recalculateSubTotal();
       this.isLoading = false;
       this.isSaving = false;   // optional

      console.log(
        'FINAL FORM VALUE 👉',
        this.addEditForm.value
      );
    });
}

// updateData(): void {

//   console.log('Before Patch 👉', this.addEditForm.value);

//   this.http.getAllDataIdSale(ApiUrl.getSaleDataForUpdate,this.categoryId)
//     .subscribe((d: any) => {

//       console.log('API DATA:', d);

//       this.addEditForm.patchValue({
//         invoiceNo: d.InvoiceNo
//       });

//       console.log('After Patch 👉', this.addEditForm.value);

//     });
// }



private safeDate(date: string | Date | null): string {
  let d = new Date(date as any);

  // If invalid date, use current date
  if (!date || isNaN(d.getTime())) {
    d = new Date();
  }
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}


  getInvoiceHeading() {

    this.http.getAllDataId(ApiUrl.listOfSaleData, this.companyId)
      .subscribe((res: any[]) => {

        if (res?.length) {

          const sorted = res.sort((a, b) =>
            b.saleInvoiceId - a.saleInvoiceId
          );

          const lastHeading = sorted[0].invoiceHeadingInt;

          this.addEditForm.patchValue({
            invoiceHeadingInt: lastHeading
          });

          // ✅ trigger same logic as dropdown change
          this.loadHeadingData(lastHeading);

        }

      });
  }
  loadHeadingData(headingId: number) {

  if (!headingId) return;

  this.http.getAllDataId(ApiUrl.getSaleHeading, headingId)
    .subscribe({
      next: (res: any) => {

        if (res?.success && res.data) {
          const data = res.data;
          this.headingPermission = data.permission;
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

  // ❗ don't regenerate invoice number in edit mode
  if(!this.isEditMode){
    this.getNextInvoiceNumber(Number(headingId));
  }
}


onOtherChargeTab(event: KeyboardEvent) {

  // Only handle Enter or Tab
  if (event.key !== 'Enter' && event.key !== 'Tab') {
    return;
  }

  const value = Number(this.addEditForm.get('value')?.value || 0);
  const otherCharge = Number(this.addEditForm.get('otherCharge')?.value || 0);

  // Value entered but Other Charge not selected
  if (value > 0 && !otherCharge) {
    event.preventDefault();

    this.addEditForm.get('otherCharge')?.markAsTouched();

    this.snackBar.open(
      'Please select Other Charge',
      'Close',
      { duration: 2000 }
    );

    return;
  }

  // Allow focus to move to next control
  // (No preventDefault here)
}

onOtherChargeSelected(): void {
  setTimeout(() => {
    const el = document.querySelector(
      'input[formControlName="value1"]'
    ) as HTMLInputElement;

    el?.focus();
  }, 0);
}
focusValue1(): void {
  setTimeout(() => {
    const el = document.querySelector(
      'input[formControlName="value1"]'
    ) as HTMLInputElement;

    el?.focus();
  });
}

onOtherCharge1Tab(event: KeyboardEvent) {

  if (event.key !== 'Tab') return;

  const value1 = Number(
    this.addEditForm.get('value1')?.value || 0
  );

  const otherCharge1 = Number(
    this.addEditForm.get('otherCharge1')?.value || 0
  );

  // stop tab movement
  if (value1 > 0 && otherCharge1 === 0) {

    event.preventDefault();

    this.addEditForm
      .get('otherCharge1')
      ?.markAsTouched();

    this.snackBar.open(
      'Please select Other Charge 1',
      'Close',
      { duration: 2000 }
    );
  }
}
onOtherCharge1Enter(): void {
  setTimeout(() => {
    this.saveButton.nativeElement.focus();
  }, 0);
}

onValue1Enter(): void {
  this.restoreZero('value1');

  const value1 = Number(this.addEditForm.get('value1')?.value || 0);

  setTimeout(() => {
    if (value1 === 0) {
      this.saveButton.nativeElement.focus();
    } else {
      this.otherChargeSelect1.focus();
      this.otherChargeSelect1.open();
    }
  });
}
onOtherCharge1Selected(): void {
  setTimeout(() => {
    this.saveButton.nativeElement.focus();
  }, 0);
}


makeForm() {
  this.addEditForm = this.fb.group({
  saleInvoiceId: [0],
  model: ['SaleInvoice'], // 👈 ADD THIS
  invoiceHeading: [''],
  invoiceHeadingInt: ['',Validators.required],
  companyId: [this.companyId],
  shipTo:[0],
  invoiceNo: [''],
  invoiceDate: [this.formatDateForInput(new Date())],
claimDate: [new Date()],

  accountId: ['',Validators.required],
  transport: [''],
   TransportNameManual: [''],
  shippingBillNo: [''],
  grNo: [''],
  orderNo: [''],
  vehicle: [''],
  formNo: [''],
  weight: [''],
  creditDays: [''],
  packingNo: [''],
  docuThru: [''],
  station: [''],
  rgpNo: [''],
  dated: [''],
  freight: [''],
  packages: [''],
  pvtMark: [''],
  dueDate: [''],
  ecomGSTIN: [''],
  ewayNo: [''],
  shBNo: [''],
  shipDate: [''],
  shipPartNo: [''],
  portLoading: [''],
  portDischarge: [''],
  finalDestination: [''],
  entrBy: [''],
  subTotal: [0],
  roundAndTotal: [0],
  taxableSale: [0],
  centralGst: [0],
  localGst: [0],
  tcs: [0],
  swachBharat: [0],
  value: [0],
  otherCharge: [0],
  value1: [0],
  otherCharge1: [0],
  extraAmount: [0],

  saleInvoiceDetails: this.fb.array([])
  /** ✅ FORM ARRAY */
  
});
this.addInvoiceDetailRow();

}
get saleInvoiceDetails(): FormArray {
  return this.addEditForm.get('saleInvoiceDetails') as FormArray;
}
getRowControl(i: number, control: string) {
  return this.saleInvoiceDetails.at(i).get(control);
}
isRowInvalid(i: number, control: string, error?: string): boolean {
  const c = this.saleInvoiceDetails.at(i).get(control);
  if (!c) return false;

  return (
    c.invalid &&
    (c.touched || c.dirty || this.submit) &&
    (error ? c.hasError(error) : true)
  );
}

onQtyFocus(index: number) {
  const control = this.saleInvoiceDetails.at(index).get('qty');

  const value = Number(control?.value);

  if (value === 0) {
    control?.setValue('', { emitEvent: false });
  }
}
clearZeroOnFocus(index: number, controlName: string): void {
  const control = this.saleInvoiceDetails.at(index).get(controlName);

  if (!control) return;

  const value = Number(control.value);

  if (value === 0) {
    control.setValue('', { emitEvent: false });
  }
}
onNumberFocus(index: number, controlName: string): void {
  const row = this.saleInvoiceDetails.at(index) as FormGroup;
  const control = row.get(controlName);

  if (!control) return;

  if (+control.value === 0) {
    control.setValue(null, { emitEvent: false });
  }
}

onNumberBlur(index: number, controlName: string): void {
  const row = this.saleInvoiceDetails.at(index) as FormGroup;
  const control = row.get(controlName);

  if (!control) return;

  if (control.value === null || control.value === '') {
    control.setValue(0, { emitEvent: false });
  }
}
createSaleInvoiceDetail(): FormGroup {
  return this.fb.group({
    barcode: [''],
    itemId: ['',Validators.required],
    remarks: [''],
    hsn: [''],
    unit:[''],
    artNo: [''],
    size: [''],
    color: [''],
    pack1: [''],
    pack2: [''],
    qty: [''],

    rate: [''],
    mRate: [0],
    discPer: [0],
    discAmt: [0],
    taxableValueId: ['',Validators.required],
    accountId: [0],
    taxPercent: [0],
    subTaxPercent: [0],
    rowTotal: [0],
    taxTableRowSubTotal: [0]
    
  });
}
addInvoiceDetailRow() {
  const row = this.createSaleInvoiceDetail();
  this.saleInvoiceDetails.push(row);
  this.listenRowCalculation(row);
   this.recalculateInvoiceTaxRates();
    const index = this.saleInvoiceDetails.length - 1;

  this.filteredItems[index] = [...this.listOfAllItem];

  this.itemSearchCtrls[index] = new FormControl('');

  this.itemSearchCtrls[index].valueChanges.subscribe(value => {

    const search = (value || '').toLowerCase();

    this.filteredItems[index] = this.listOfAllItem.filter(item =>
      (item.itemName || '').toLowerCase().includes(search)
    ).sort((a: any, b: any) => {

      const aName = (a.itemName || '').toLowerCase();
      const bName = (b.itemName || '').toLowerCase();

      const aStarts = aName.startsWith(search);
      const bStarts = bName.startsWith(search);

      // Items starting with search come first
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // Then alphabetical
      return aName.localeCompare(bName);
    });
;

  });

  this.filteredTaxes[index] = [...this.listOfTaxTableData];

this.taxSearchCtrls[index] = new FormControl('');


this.taxSearchCtrls[index].valueChanges.subscribe(value => {

  const search = (value || '').toLowerCase().trim();

  this.filteredTaxes[index] = this.listOfTaxTableData
    .filter((tax: any) =>
      (tax.salePurcAccountName || '').toLowerCase().includes(search)
    )
    .sort((a: any, b: any) => {

      const aName = (a.salePurcAccountName || '').toLowerCase();
      const bName = (b.salePurcAccountName || '').toLowerCase();

      const aStarts = aName.startsWith(search);
      const bStarts = bName.startsWith(search);

      // Names starting with search text first
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // Then alphabetical
      return aName.localeCompare(bName);
    });

});
}



handleAddRowKeyDown(event: KeyboardEvent, index: number) {

  // Shift + Enter (or Shift only if you prefer)
  if (event.key === 'Shift') {
    event.preventDefault();

    // Focus your Value/Tax box
    this.valueInput.nativeElement.focus();
    return;
  }

  // Normal Enter -> Add Row
  if (event.key === 'Enter') {
   
    this.handleAddRow(index);
      // Focus first control of the new row
    setTimeout(() => {
      const nextItem = document.getElementById('itemSelect' + (index + 1));
      nextItem?.focus();
    }, 0);

  }
}
handleAddRow(index: number) {
  // Only add on last row
  if (index !== this.saleInvoiceDetails.length - 1) return;

  // Block if row invalid
  if (this.saleInvoiceDetails.at(index).invalid) return;

  // Get current row and selected item
  const currentRow = this.saleInvoiceDetails.at(index) as FormGroup;
  const selectedItemId = currentRow.get('itemId')?.value;

  // Add new row
  this.addInvoiceDetailRow();

  // New row index
  const newIndex = this.saleInvoiceDetails.length - 1;
  const newRow = this.saleInvoiceDetails.at(newIndex) as FormGroup;

  // Select the same item
  newRow.patchValue({
    itemId: selectedItemId
  });

  // Fill barcode, HSN, rate, tax, etc.
  this.onItemChange(newIndex);

  // Wait for DOM render
  setTimeout(() => {
    this.cdr.detectChanges();

    const items = this.itemSelects.toArray();
    const last = items[items.length - 1];
    last?.nativeElement?.focus();
  });
}

onTaxKeyDown(event: KeyboardEvent, index: number) {

  // ✅ Shift + Enter (reliable across browsers)
  if (!(event.key === 'Enter')) return;

  event.preventDefault();

  // only add on last row
  if (index !== this.saleInvoiceDetails.length - 1) return;

  // block if row invalid
  if (this.saleInvoiceDetails.at(index).invalid) return;

  // add new row
  this.addInvoiceDetailRow();

  // 🔥 WAIT FOR DOM RENDER
  setTimeout(() => {
    this.cdr.detectChanges();

    const items = this.itemSelects.toArray();
    const last = items[items.length - 1];

    last?.nativeElement?.focus();
  });
}

removeInvoiceDetailRow(index: number) {

  // prevent removing first row
  if (index === 0) {
    return;
  }

  // remove row
  this.saleInvoiceDetails.removeAt(index);

  // 🔁 Recalculate everything properly
  this.saleInvoiceDetails.controls.forEach((row: any) => {
    this.recalculateTax(row);
  });

  this.recalculateInvoiceTaxRates();
  this.recalculateSubTotal();
}


removeRowAndFocus(index: number) {
  this.removeInvoiceDetailRow(index);

  setTimeout(() => {
    this.valueInput?.nativeElement.focus();
  });
}
listenRowCalculation(row: FormGroup) {

  const qtyCtrl = row.get('qty');
  const rateCtrl = row.get('rate');
  const discPerCtrl = row.get('discPer');
  const discAmtCtrl = row.get('discAmt');
  const rowTotalCtrl = row.get('rowTotal');
   const taxCtrl = row.get('taxableValueId'); // ✅ ADD THIS
  let updating = false;
  let editingRowTotal = false;

  const calculateBase = () => {
    const qty = +qtyCtrl?.value || 0;
    const rate = +rateCtrl?.value || 0;
    return qty * rate;
  };

  // % → Amount
  const calculateFromPercent = () => {
    const amount = calculateBase();
    const discPer = +discPerCtrl?.value || 0;

    const discAmt = (amount * discPer) / 100;
    const rowTotal = amount - discAmt;

    // row.patchValue({
    //   discAmt: +discAmt.toFixed(2),
    //   rowTotal: +rowTotal.toFixed(2)
    // }, { emitEvent: false });

     row.patchValue({
       discAmt: +discAmt.toFixed(2), // ✅ add this
    discPer: +discPer.toFixed(2),
    rowTotal: this.formatRowTotal(row, rowTotal)
  }, { emitEvent: false });


    this.recalculateTax(row);   // ✅ always update tax & subtotal
  };

  // Amount → %
const calculateFromAmount = () => {
  const amount = calculateBase();
  const discAmt = +discAmtCtrl?.value || 0;

  const discPer = amount ? (discAmt / amount) * 100 : 0;
  const rowTotal = amount - discAmt;

  row.patchValue({
    discPer: +discPer.toFixed(2),
    rowTotal: +rowTotal
  }, { emitEvent: false });

  const index = this.saleInvoiceDetails.controls.indexOf(row);
  this.onRowTotalBlur(index); // auto call

  this.recalculateTax(row);
};

  // qty / rate change → IMMEDIATE subtotal
  qtyCtrl?.valueChanges.subscribe(() => calculateFromPercent());
  rateCtrl?.valueChanges.subscribe(() => calculateFromPercent());

  // discount %
  discPerCtrl?.valueChanges.subscribe(() => {
    if (updating) return;
    updating = true;
    calculateFromPercent();
    updating = false;
  });

  // discount amount
  discAmtCtrl?.valueChanges.subscribe(() => {
    if (updating) return;
    updating = true;
    calculateFromAmount();
    updating = false;
  });

    taxCtrl?.valueChanges.subscribe(() => {
    this.recalculateTax(row);
    this.recalculateInvoiceTaxRates();
  });

  

  

rowTotalCtrl?.valueChanges.subscribe((value) => {

  // Skip while typing decimal like 45454.
  if (value === null || value === '' || value.toString().endsWith('.')) {
    return;
  }

  if (updating) return;

  updating = true;
  

  const rowTotal = parseFloat(value) || 0;

  let qty = Number(qtyCtrl?.value) || 0;
  let rate = Number(rateCtrl?.value) || 0;
  const discAmt = Number(discAmtCtrl?.value) || 0;

  // both 0
  if (qty === 0 && rate === 0 && rowTotal > 0) {

    qty = 1;
    rate = rowTotal + discAmt;

    row.patchValue({
      qty,
      rate
    }, { emitEvent: false });

  }

  // qty exists
  else if (qty > 0 && rowTotal > 0) {

    const baseAmount = rowTotal + discAmt;
    rate = baseAmount / qty;

    row.patchValue({
      rate: +rate.toFixed(2)
    }, { emitEvent: false });

  }

  // rate exists
  else if (qty === 0 && rate > 0 && rowTotal > 0) {

    qty = rowTotal / rate;

    row.patchValue({
      qty: +qty.toFixed(2)
    }, { emitEvent: false });

  }

  this.recalculateTax(row);

  updating = false;
});

}


recalculateTax(row: FormGroup) {

  const taxId = Number(row.get('taxableValueId')?.value);
  const rowTotal = Number(row.get('rowTotal')?.value) || 0;

  // ✅ NO TAX SELECTED → still update subtotal
  if (!taxId || rowTotal <= 0) {
    row.patchValue(
      { taxTableRowSubTotal: rowTotal },
      { emitEvent: false }
    );

    this.recalculateSubTotal(); // ✅ KEY LINE
     this.recalculateInvoiceTaxRates();
    return;
  }

  const tax = this.listOfTaxTableData.find(x => x.id === taxId);
  if (!tax) return;

  const taxPercent = Number(tax.totalax) || 0;
  const fixedTaxPercent = Number(tax.subTotalTax) || 0;

  let total = rowTotal * (1 + taxPercent / 100);
  total = total * (1 + fixedTaxPercent / 100);

  // precision-safe
  total = Math.floor((total + Number.EPSILON) * 1000) / 1000;

  row.patchValue(
    { taxTableRowSubTotal: total },
    { emitEvent: false }
  );

  this.recalculateSubTotal(); // ✅ ALWAYS update subtotal
  this.recalculateInvoiceTaxRates();
}


recalculateSubTotal() {
  // 1️⃣ Sum of all row totals
  const rowsTotal = this.saleInvoiceDetails.controls.reduce(
    (sum, row: any) => {
      const val = Number(row.get('taxTableRowSubTotal')?.value) || 0;
      return sum + val;
    },
    0
  );

  // 2️⃣ Optional extra values
  const value = Number(this.addEditForm.get('value')?.value) || 0;
  const value1 = Number(this.addEditForm.get('value1')?.value) || 0;

  // 3️⃣ Final subtotal
  let subTotal = rowsTotal + value + value1;

  // precision-safe (keeps 108.99 exactly)
  subTotal = Math.round((subTotal + Number.EPSILON) * 100) / 100;
    // ✅ APPLY ROUNDING
  const roundAndTotal = this.calculateRoundOff(subTotal);

  this.addEditForm.patchValue(
    { subTotal,
      roundAndTotal
     },
    { emitEvent: false }
  );
}
onRowTotalBlur(index: number) {

  const row = this.saleInvoiceDetails.at(index) as FormGroup;

  const rowTotalControl = row.get('rowTotal');
  const unitId = row.get('unit')?.value;

  if (!rowTotalControl) return;

  // Find selected unit
  const selectedUnit = this.listOfUnit.find(
    (x: any) => Number(x.id) === Number(unitId)
  );

  // decimal from unit
  const decimalPlaces = Number(selectedUnit?.decimal ?? 0);

  // value
  const rowTotal = parseFloat(rowTotalControl.value || 0);

  // format like qty
  rowTotalControl.setValue(
    rowTotal.toFixed(decimalPlaces),
    { emitEvent: false }
  );

  // recalculate tax
  this.recalculateTax(row);
}



onRateKeyDown(event: KeyboardEvent, index: number): void {

  if (event.key !== 'Tab' && event.key !== 'Enter') {
    return;
  }

  const row = this.saleInvoiceDetails.at(index) as FormGroup;
  const rowTotal = Number(row.get('rowTotal')?.value || 0);

  // Don't allow Tab or Enter if Row Total is 0
  if (rowTotal <= 0) {
    event.preventDefault();
    event.stopPropagation();

    row.get('rowTotal')?.markAsTouched();
    (event.target as HTMLInputElement).focus();

    return;
  }

  // Prevent default Tab/Enter behaviour
  event.preventDefault();

  const form = (event.target as HTMLElement).closest('form');
  if (!form) return;

 const elements = Array.from(
  form.querySelectorAll(
    'input:not([disabled]), textarea:not([disabled]), button:not([disabled]), .mat-mdc-select'
  )
) as HTMLElement[];
  const current = event.target as HTMLElement;
  const currentIndex = elements.indexOf(current);

  if (currentIndex > -1 && currentIndex < elements.length - 1) {
    elements[currentIndex + 1].focus();
  }
}

clearRateZeroOnFocus(index: number, controlName: string): void {
  const control = this.saleInvoiceDetails.at(index).get(controlName);

  if (Number(control?.value) === 0) {
    control?.setValue('');
  }
}

restoreZeroOnBlur(index: number, controlName: string): void {
  const control = this.saleInvoiceDetails.at(index).get(controlName);

  if (
    control &&
    (control.value === '' || control.value === null || control.value === undefined)
  ) {
    control.setValue(0);
  }
}
onRowTotalFocus(index: number): void {
  const control = this.saleInvoiceDetails.at(index).get('rowTotal');

  if (Number(control?.value) === 0) {
    control?.setValue('');
  }
}


get totalQty(): string {

  let maxDecimal = 0;

  const total = this.saleInvoiceDetails.controls.reduce(
    (sum: number, row: any) => {

      const qtyValue = row.get('qty')?.value ?? 0;
      const qty = Number(qtyValue) || 0;

      // check decimal length
      const decimalLength =
        qtyValue?.toString()?.split('.')?.[1]?.length || 0;

      maxDecimal = Math.max(maxDecimal, decimalLength);

      return sum + qty;
    },
    0
  );

  return total.toFixed(maxDecimal || 2);
}

// get totalAmount(): number {
//   return this.saleInvoiceDetails.controls.reduce((sum: number, row: any) => {
//     return sum + (Number(row.get('rowTotal')?.value) || 0);
//   }, 0);
// }


get totalAmount(): string {

  let maxDecimal = 0;

  const total = this.saleInvoiceDetails.controls.reduce(
    (sum: number, row: any) => {

      const amountValue = row.get('rowTotal')?.value ?? 0;
      const amount = Number(amountValue) || 0;

      // detect decimal length
      const decimalLength =
        amountValue?.toString()?.split('.')?.[1]?.length || 0;

      maxDecimal = Math.max(maxDecimal, decimalLength);

      return sum + amount;
    },
    0
  );

  return total.toFixed(maxDecimal || 2);
}




onTaxChange(index: number) {
 const row = this.saleInvoiceDetails.at(index) as FormGroup;
  this.recalculateTax(row);
 this.recalculateInvoiceTaxRates();
}
calculateTaxForRow(row: FormGroup, tax: any) {

  const rowTotal = +row.get('rowTotal')?.value || 0;

  const totalTaxRate = +tax.totalax || 0;
  const subTotalTax = +tax.subTotalTax || 0;

  // Tax amount
  const taxAmount = (rowTotal * totalTaxRate) / 100;

  // Final amount
  const finalAmount = rowTotal + taxAmount + subTotalTax;

  row.patchValue({
    taxTableRowSubTotal: +finalAmount.toFixed(2)
  }, { emitEvent: false });
}
// recalculateInvoiceTaxRates() {

//   let centralGst = 0;
//   let localGst = 0;
//   let tcs = 0;
//   let swachBharat = 0;

//   this.saleInvoiceDetails.controls.forEach((row: any) => {

//     const taxId = row.get('taxableValueId')?.value;
//     if (!taxId) return;

//     const tax = this.listOfTaxTableData.find(
//       x => x.id === Number(taxId)
//     );

//     if (!tax) return;

//     centralGst += tax.gstApplicabeCentralRate || 0;
//     localGst += tax.gstApplicabeLocalRate || 0;
//     tcs += tax.tcsApplicabeRate || 0;
//     swachBharat += tax.swachBhartApplicableRate || 0;
//   });

//   this.addEditForm.patchValue({
//     centralGst,
//     localGst,
//     tcs,
//     swachBharat
//   }, { emitEvent: false });
// }

// recalculateInvoiceTaxRates() {

//   let centralGstAmt = 0;
//   let localGstAmt = 0;
//   let tcsAmt = 0;
//   let swachBharatAmt = 0;

//   let centralGstRate = 0;
//   let localGstRate = 0;
//   let tcsRate = 0;
//   let swachBharatRate = 0;

//   this.saleInvoiceDetails.controls.forEach((row: any) => {

//     const taxId = row.get('taxableValueId')?.value;
//     const rowTotal = Number(row.get('rowTotal')?.value) || 0;

//     if (!taxId) return;

//     const tax = this.listOfTaxTableData.find(
//       x => x.id === Number(taxId)
//     );

//     if (!tax) return;

//     const cRate = Number(tax.gstApplicabeCentralRate) || 0;
//     const lRate = Number(tax.gstApplicabeLocalRate) || 0;
//     const tcsR = Number(tax.tcsApplicabeRate) || 0;
//     const sbRate = Number(tax.swachBhartApplicableRate) || 0;

//     // ✅ accumulate percentage
//     centralGstRate += cRate;
//     localGstRate += lRate;
//     tcsRate += tcsR;
//     swachBharatRate += sbRate;

//     // ✅ accumulate amount
//     if (rowTotal > 0) {
//       centralGstAmt += (rowTotal * cRate) / 100;
//       localGstAmt += (rowTotal * lRate) / 100;
//       tcsAmt += (rowTotal * tcsR) / 100;
//       swachBharatAmt += (rowTotal * sbRate) / 100;
//     }
//   });

//   // round amounts
//   centralGstAmt = +centralGstAmt.toFixed(2);
//   localGstAmt = +localGstAmt.toFixed(2);
//   tcsAmt = +tcsAmt.toFixed(2);
//   swachBharatAmt = +swachBharatAmt.toFixed(2);

//   this.addEditForm.patchValue({
//     centralGst: centralGstAmt,
//     localGst: localGstAmt,
//     tcs: tcsAmt,
//     swachBharat: swachBharatAmt,

//     centralGstRate,
//     localGstRate,
//     tcsRate,
//     swachBharatRate
//   }, { emitEvent: false });
  
// }

recalculateInvoiceTaxRates() {

  let centralGstAmt = 0;
  let localGstAmt = 0;
  let tcsAmt = 0;
  let swachBharatAmt = 0;

  // Use Set to avoid duplicate %
  const centralRateSet = new Set<number>();
  const localRateSet = new Set<number>();
  const tcsRateSet = new Set<number>();
  const swachRateSet = new Set<number>();

  this.saleInvoiceDetails.controls.forEach((row: any) => {

    const taxId = row.get('taxableValueId')?.value;
    const rowTotal = Number(row.get('rowTotal')?.value) || 0;

    if (!taxId) return;

    const tax = this.listOfTaxTableData.find(
      x => x.id === Number(taxId)
    );

    if (!tax) return;

    const cRate = Number(tax.gstApplicabeCentralRate) || 0;
    const lRate = Number(tax.gstApplicabeLocalRate) || 0;
    const tcsR = Number(tax.tcsApplicabeRate) || 0;
    const sbRate = Number(tax.swachBhartApplicableRate) || 0;

    // ✅ store unique %
    if (cRate) centralRateSet.add(cRate);
    if (lRate) localRateSet.add(lRate);
    if (tcsR) tcsRateSet.add(tcsR);
    if (sbRate) swachRateSet.add(sbRate);

    // ✅ calculate amount
    if (rowTotal > 0) {
      centralGstAmt += (rowTotal * cRate) / 100;
      localGstAmt += (rowTotal * lRate) / 100;
      tcsAmt += (rowTotal * tcsR) / 100;
      swachBharatAmt += (rowTotal * sbRate) / 100;
    }
  });

  // round amounts
  centralGstAmt = +centralGstAmt.toFixed(2);
  localGstAmt = +localGstAmt.toFixed(2);
  tcsAmt = +tcsAmt.toFixed(2);
  swachBharatAmt = +swachBharatAmt.toFixed(2);

  // Patch only amount (for saving)
  this.addEditForm.patchValue({
    centralGst: centralGstAmt,
    localGst: localGstAmt,
    tcs: tcsAmt,
    swachBharat: swachBharatAmt
  }, { emitEvent: false });


  
}
getTaxRate(taxId: number, type: 'central' | 'local' | 'tcs' | 'swach'): number {

  const tax = this.listOfTaxTableData.find(x => x.id === Number(taxId));
  if (!tax) return 0;

  switch (type) {
    case 'central':
      return Number(tax.gstApplicabeCentralRate) || 0;
    case 'local':
      return Number(tax.gstApplicabeLocalRate) || 0;
    case 'tcs':
      return Number(tax.tcsApplicabeRate) || 0;
    case 'swach':
      return Number(tax.swachBhartApplicableRate) || 0;
    default:
      return 0;
  }
}



private formatDateForInput(date: Date | string): string {
  let d = new Date(date);

  if (isNaN(d.getTime())) {
    d = new Date();
  }

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;  // ✅ dd-MM-yyyy
}

private formatDateForSave(dateStr: string): string {
  if (!dateStr) return '';

  const [day, month, year] = dateStr.split('-');

  return `${year}-${month}-${day}`;  // ✅ yyyy-MM-dd (for .NET)
}


formatRowTotal(row: FormGroup, value: number): number {
  const unitId = row.get('unit')?.value;

  const selectedUnit = this.listOfUnit.find(
    (x: any) => Number(x.id) === Number(unitId)
  );

  const decimalPlaces = Number(selectedUnit?.decimal ?? 0);

  return Number(value.toFixed(decimalPlaces));
}


onEnterNext(event: Event): void {
  

  const target = event.target as HTMLElement;

  const elements = Array.from(
    document.querySelectorAll(
      'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
    )
  ) as HTMLElement[];

  const index = elements.indexOf(target);

  if (index > -1 && index < elements.length - 1) {
    elements[index + 1].focus();
  }
}

clearZero(controlName: string): void {
    const control = this.addEditForm.get(controlName);

    if (!control) return;

    if (Number(control.value) === 0) {
      control.setValue('');
    }
  }


  restoreZero(controlName: string): void {
    const control = this.addEditForm.get(controlName);

    if (!control) return;

    if (control.value === '' || control.value == null) {
      control.setValue(0);
    }
  }

// onSubmit(): void {
//   this.submit = true;

//   if (this.addEditForm.invalid) return;

//   const isEdit = !!this.addEditForm.value.saleInvoiceId;

//   const formValue = this.addEditForm.value;

//  const payload = {
//     ...formValue,

//     // ✅ FORMAT DATES
//     invoiceDate: this.formatDateForSave(formValue.invoiceDate),
//     // claimDate: this.formatDateForSave(formValue.claimDate),

//     // ✅ FIX QTY HERE
//     saleInvoiceDetails: formValue.saleInvoiceDetails.map((row: any) => ({
//       ...row,
//       qty: row.qty ? Number(row.qty) : 0
//     }))
//   };

//   this.http.addEditData(ApiUrl.addEditSale, payload).subscribe({
//     next: () => {
//       const headingId = this.addEditForm.value.invoiceHeadingInt;
//       const invoiceNo = payload.invoiceNo;

//       // ✅ Save last invoice number (ADD mode only)
//       if (!isEdit) {
//         localStorage.setItem(`INV_${this.companyId}_${headingId}`, invoiceNo);
//       }

//       // ✅ Dynamic message
//       const message = isEdit
//         ? 'Invoice updated successfully'
//         : 'Invoice saved successfully';

//       this.snackBar.open(message, 'Close', { duration: 3000 });
//       this.dialogRef.close(true);
//     },

//     error: (err) => {
//       console.error('Save error:', err);
//       this.snackBar.open(
//         'Something went wrong while saving invoice',
//         'Close',
//         { duration: 4000 }
//       );
//     }
//   });
// }



// calculateRoundOff(value: number): number {
//   if (!value) return 0;

//   const remainder = value % 100;

//   if (remainder < 50) {
//     return value - remainder; // round down
//   } else {
//     return value + (100 - remainder); // round up
//   }
// }


submitFromButton(event: Event): void {
  event.preventDefault();
  event.stopPropagation();

  if (this.isSaving) {
    return;
  }

  this.onSubmit();
}
onSubmit(): void {
  this.submit = true;
  
for (let i = 0; i < this.saleInvoiceDetails.length; i++) {
  const row = this.saleInvoiceDetails.at(i) as FormGroup;

  const qty = Number(row.get('qty')?.value || 0);
  const rowTotal = Number(row.get('rowTotal')?.value || 0);

  if (qty === 0 && rowTotal === 0) {
     this.snackBar.open(
        'Qty and Row Total cannot be 0.',
        'Close',
        { duration: 4000 } 
      );
     

    row.get('qty')?.markAsTouched();
    row.get('rowTotal')?.markAsTouched();

    return;
  }
}
  if (this.addEditForm.invalid) return;
  this.isSaving = true;
  const isEdit = !!this.addEditForm.value.saleInvoiceId;

  const formValue = this.addEditForm.value;

  const payload = {
    ...formValue,

    invoiceDate: this.formatDateForSave(formValue.invoiceDate),

    saleInvoiceDetails: formValue.saleInvoiceDetails.map((row: any) => ({
      ...row,
      qty: row.qty ? Number(row.qty) : 0
    }))
  };

  this.http.addEditData(ApiUrl.addEditSale, payload).subscribe({
    next: (res: any) => {

this.isSaving = false;
       if (res?.saleInvoiceId) {

          this.addEditForm.patchValue({
            saleInvoiceId:
              res.saleInvoiceId
          });

          console.log(
            'Saved Invoice ID:',
            res.saleInvoiceId
          );
        }
     
      const headingId = this.addEditForm.value.invoiceHeadingInt;
      const invoiceNo = payload.invoiceNo;

      // Save last invoice number
      if (!isEdit) {
        localStorage.setItem(
          `INV_${this.companyId}_${headingId}`,
          invoiceNo
        );
      }

      const message = isEdit
        ? 'Invoice updated successfully'
        : 'Invoice saved successfully';

      this.snackBar.open(message, 'Close', {
        duration: 3000
      });

      // ❌ REMOVE THIS
      // this.dialogRef.close(true);

      // Optional: mark form pristine
      this.addEditForm.markAsPristine();
this.showAddNewOption = true;

this.cdr.detectChanges();

setTimeout(() => {
  this.addNewButton?.nativeElement?.focus();
}, 100);

    },

    error: (err) => {
       this.isSaving = false;
      console.error('Save error:', err);

      this.snackBar.open(
        'Something went wrong while saving invoice',
        'Close',
        { duration: 4000 } 
      );
     
    }
  });
}
focusInvoiceHeading(): void {
  
  setTimeout(() => {
    const element = document.querySelector(
      '[formControlName="invoiceHeadingInt"]'
    ) as HTMLElement;

    element?.focus();
  }, 200);
}
onAddNewKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    this.showAddNewOption = false;

    if (this.isEditMode) {
      this.switchToAddMode();
    } else {
      this.resetForm();
    }
  }

  if (event.key === 'Shift') {
    this.showAddNewOption = false;
  }
}
switchToAddMode() {
this.isSaving = false;
  // Remove edit id
  this.categoryId = 0;
  this.isEditing = false;

  // reset full form
  this.addEditForm.reset();

  // clear rows
  this.saleInvoiceDetails.clear();

 
  this.addInvoiceDetailRow();

  // reset submit state
  this.submit = false;

  // hide transport manual
  this.showTransportManual = false;

  // default values
  this.addEditForm.patchValue({
    saleInvoiceId: 0,
    model: 'SaleInvoice',
    companyId: this.companyId,
    shipTo: 0,

    invoiceDate: this.formatDateForInput(new Date()),
    claimDate: new Date(),

    subTotal: 0,
    roundAndTotal: 0,
    taxableSale: 0,
    centralGst: 0,
    localGst: 0,
    tcs: 0,
    swachBharat: 0,

    value: 0,
    otherCharge: 0,
    value1: 0,
    otherCharge1: 0,
    extraAmount: 0
  });

  // Load last selected heading + next invoice no
  this.getInvoiceHeading();

  this.cdr.detectChanges();
  this.focusInvoiceHeading();
}

resetForm() {
this.isSaving = false;
  // reset full form
  this.addEditForm.reset();

  // clear invoice rows
  this.saleInvoiceDetails.clear();

  // add one empty row
  this.addInvoiceDetailRow();

  // reset submit state
  this.submit = false;

  // hide transport manual
  this.showTransportManual = false;
    this.focusInvoiceHeading();

  // load next invoice number
  if (!this.isEditing) {
    this.getInvoiceHeading();
  }

  // set default values again
  this.addEditForm.patchValue({
    saleInvoiceId: this.isEditing ? this.categoryId : 0,
    model: 'SaleInvoice',
    companyId: this.companyId,
    shipTo: 0,
    invoiceDate: this.formatDateForInput(new Date()),
    claimDate: new Date(),

    subTotal: 0,
    roundAndTotal: 0,
    taxableSale: 0,
    centralGst: 0,
    localGst: 0,
    tcs: 0,
    swachBharat: 0,

    value: 0,
    otherCharge: 0,
    value1: 0,
    otherCharge1: 0,
    extraAmount: 0
  });

  this.cdr.detectChanges();

}

calculateRoundOff(value: number): number {
  return Math.round(value || 0);
}





// onSubmit(): void {
//   this.submit = true;

//   if (this.addEditForm.invalid) return;

//   const isEdit = !!this.addEditForm.value.saleInvoiceId;

// const formValue = this.addEditForm.value;

// const payload = {
//   ...formValue,
//   invoiceDate: this.formatDateForSave(formValue.invoiceDate),
//   claimDate: this.formatDateForSave(formValue.claimDate)
// };
//   this.http.addEditData(ApiUrl.addEditSale, payload).subscribe({
//     next: () => {

//       const headingId = this.addEditForm.value.invoiceHeadingInt;
//       const invoiceNo = payload.invoiceNo;

//       // ✅ Save last invoice number (ADD mode only)
//       if (!isEdit) {
//         localStorage.setItem(`INV_${this.companyId}_${headingId}`, invoiceNo);
//       }

//       // ✅ Dynamic message
//       const message = isEdit
//         ? 'Invoice updated successfully'
//         : 'Invoice saved successfully';

//       this.snackBar.open(message, 'Close', { duration: 3000 });

//       this.dialogRef.close(true);
//     },

//     error: (err) => {
//       console.error(err);
//       this.snackBar.open(
//         isEdit ? 'Failed to update invoice' : 'Failed to save invoice',
//         'Close',
//         { duration: 3000 }
//       );
//     }
//   });
// }





get isEditMode(): boolean {
  return !!this.categoryId && this.categoryId > 0;
}






openGstVat(data?: any) {
  //  const dialogRef = this.dialog.open(AddEditGstVatMaster, {
  //     width: '500px',
  //     data: data || null
  //   });
  
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //        this.getAllGSTVATData(); 
  //     }
  //   });
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
       this.getAllAccountData(); // reload list automatically
    }
  });
}

openInvouveHeadingMaster(data?: any) {
   const dialogRef = this.dialog.open(AddEditSaleHeading, {
     width: '500px',
     data: data || null
   });
 

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
       this.getSaleHeading(); // reload list automatically
    }
  });
}



openItemMaster(data?: any) {
   const dialogRef = this.dialog.open(AddEditItemMaster, {
    width: '80vw',
    maxWidth: '1200px',
    data: data || null
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
       this.getAllItemData(); // reload list automatically
    }
  });
}


openTaxTable(data?: any) {
   const dialogRef = this.dialog.open(AddEditTaxTable, {
      width: '70vw',
      maxWidth: '1500px',
      data: data || null
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
         this.getAllTaxTableData(); // reload list automatically
      }
    });
 
}


openTransport(data?: any) {
   const dialogRef = this.dialog.open(AddEditTransportMaster, {
      width: '500px',
      data: data || null
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
         this.getAllTransportData(); // reload list automatically
      }
    });
 
}

addUnitShorcut(data?: any) {
  const dialogRef = this.dialog.open(AddEditUnitMaster, {
    width: '500px',
    data: data || null
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
       this.getAllUnit(); // reload list automatically
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


// openPdfModel() {
// const isLargeView = true; // your condition
//   const saleInvoiceId =
//     this.addEditForm.get(
//       'saleInvoiceId'
//     )?.value;

//   if (!saleInvoiceId) {
//     this.snackBar.open(
//       'Please save invoice first',
//       'Close',
//       { duration: 3000 }
//     );
//     return;
//   }

//   const dialogRef =
//     this.dialog.open(SalePdf, {
//       width: '70vw',
//       maxWidth: '1000px',
//        maxHeight: isLargeView ? '95vh' : '90vh',
//   height: isLargeView ? 'auto' : '800px',
//       data: {
//         saleInvoiceId: saleInvoiceId,
//          autoPrint: true // ✅ send flag
//       }
//     });

//   dialogRef
//     .afterClosed()
//     .subscribe(() => {
//       console.log(
//         'PDF Closed'
//       );
//     });
// }


openPdfModel() {
  const saleInvoiceId =
    this.addEditForm.get('saleInvoiceId')?.value;

  if (!saleInvoiceId) {
    this.snackBar.open(
      'Please save invoice first',
      'Close',
      { duration: 2000 }
    );
    return;
  }

  this.dialog.open(SalePdf, {
    width: '1px',
    height: '1px',
    panelClass: 'hidden-dialog',
    backdropClass: 'transparent-backdrop',
    data: {
      saleInvoiceId,
      autoPrint: true
    }
  });
}
}
