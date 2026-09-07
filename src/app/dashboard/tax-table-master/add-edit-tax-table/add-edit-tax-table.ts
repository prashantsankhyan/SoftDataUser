import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, NgZone, ViewChild, ElementRef, HostListener } from '@angular/core';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../material.module';
import { AllApiService } from '../../../_core/_service/all-api.service';
import { ApiUrl } from '../../../_core/apiUrl';
import { AddEditAccount } from '../../account-master/add-edit-account/add-edit-account';
import { MatSelect } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@Component({
  selector: 'app-add-edit-tax-table',
  imports: 
  [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule,NgxMatSelectSearchModule],
  templateUrl: './add-edit-tax-table.html',
  styleUrl: './add-edit-tax-table.scss',
    providers: [TitleCasePipe]
})
export class AddEditTaxTable {

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
  if (event.key !== 'Enter') {
    return;
  }

  const target = event.target as HTMLElement;


  if (target.classList.contains('mat-mdc-select-trigger')) {
  return;
}
  // Allow Shift+Enter in textarea
  if (target.tagName === 'TEXTAREA' && event.shiftKey) {
    return;
  }

  event.preventDefault();

  const form = target.closest('form');

  if (!form) return;

  const elements = Array.from(
    form.querySelectorAll(
      `
      input:not([disabled]),
      textarea:not([disabled]),
      select:not([disabled]),
      button:not([disabled]),
      .mat-mdc-select-trigger,
      [tabindex]
      `
    )
  ).filter(
    (el: any) =>
      el.offsetParent !== null &&
      !el.hasAttribute('readonly')
  ) as HTMLElement[];

  const index = elements.indexOf(target);

  if (index > -1 && index < elements.length - 1) {
    elements[index + 1].focus();
  } else {
    this.onSubmit();
  }
}



focusNext(select: MatSelect, openNextSelect = false) {
  setTimeout(() => {

    const current = select._elementRef.nativeElement;
    const form = current.closest('form');

    if (!form) return;

    const elements = Array.from(
      form.querySelectorAll(`
        input:not([disabled]),
        textarea:not([disabled]),
        .mat-mdc-select,
        select:not([disabled]),
        button:not([disabled])
      `)
    ).filter(
      (el: any) =>
        el.offsetParent !== null &&
        !el.hasAttribute('readonly')
    ) as HTMLElement[];

    const index = elements.indexOf(current);

    if (index === -1 || index === elements.length - 1) return;

    const next = elements[index + 1];

    const trigger = next.querySelector(
      '.mat-mdc-select-trigger'
    ) as HTMLElement;

    if (trigger) {
      trigger.focus();

      if (openNextSelect) {
        trigger.click(); // Automatically open next mat-select
      }
    } else {
      next.focus();
    }

  }, 100);
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
onRadioEnter(event: Event, controlName: string) {
  const keyboardEvent = event as KeyboardEvent;
  keyboardEvent.preventDefault();

  const control = this.addEditForm.get(controlName);
  if (!control) return;

  control.setValue(!control.value);

  const target = keyboardEvent.target as HTMLElement;

  // Move to next control...
}
  @ViewChild('groupSelect') groupSelect!: ElementRef;
@ViewChild('agentMaster') agentMaster!: ElementRef;
@ViewChild('transportMaster') transportMaster!: ElementRef;
@ViewChild('gstVatMaster') gstVatMaster!: ElementRef;

isSaving = false;
 showSpiner = true;
  submit = false ;
  companyId:any;
  userName:any;
  
  alertMessage =''
  addEditForm!:FormGroup;
  categoryId:any;
  successMessage = '';
  errorMessage = '';
  messageSuccess = true;
  listOfData: any[] = [];
  liabilityList: any[] = [];
  listOfAgentData:any=[];
  listOfTransport:any=[];
   listOfHeading: any[] = []; 
   originalList: any[] = [];
   listOfUnit:any[] =[];
   listOfGorupMaster:any[] =[];
   listOfCity:any[]=[];
   listOfVATGSTData:any[]=[];
   filteredLists: { [key: string]: any[] } = {};
 currentDropdown = '';
 searchCtrl = new FormControl('');
 centralSearchCtrl = new FormControl();
localSearchCtrl = new FormControl();
tcsSearchCtrl = new FormControl();
swachSearchCtrl = new FormControl();


filteredCentralGST: any[] = [];
filteredLocalGST: any[] = [];
filteredTCS: any[] = [];
filteredSwach: any[] = [];
listOFSaveData:any[]=[];
usedSalePurcAccountIds: number[] = [];
currentEditSalePurcAccountId: number = 0;
 
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,private titleCase: TitleCasePipe ,private http:AllApiService,private cRouter:ActivatedRoute,
  private router: Router,private ngZone: NgZone,public dialog: MatDialog,
  private snackBar: MatSnackBar,
  private cdr: ChangeDetectorRef,public dialogRef: MatDialogRef<AddEditTaxTable>){}
 

  ngOnInit(): void {
    this.companyId = JSON.parse(localStorage.getItem('loggedUser') || '{}').companyId;
     this.userName = JSON.parse(localStorage.getItem('loggedUser') || '{}').username;
    
    
    this.data;
 
    this.categoryId = this.data?.id || 0;
   
   
    this.makeForm();
    this.setupConditionalTaxValidation(
  'gstApplicabeCentral',
  'gstApplicabeCentralName',
  'gstApplicabeCentralRate',
  'gstApplicabeCentralCalculateOn'
);

this.setupConditionalTaxValidation(
  'gstApplicabeLocal',
  'gstApplicabeLocalName',
  'gstApplicabeLocalRate',
  'gstApplicabeLocalCalculateOn'
);

this.setupConditionalTaxValidation(
  'tcsApplicabe',
  'tcsApplicabeName',
  'tcsApplicabeRate',
  'tcsApplicabeCalculateOn'
);

this.setupConditionalTaxValidation(
  'swachBhartApplicable',
  'swachBhartApplicableName',
  'swachBhartApplicableRate',
  'swachBhartApplicableCalculateOn'
);

     this.addEditForm.valueChanges.subscribe(() => {
  this.calculateTaxTotals();
});
     

  
    this.getSveDataList();
    
   // Central GST Search
this.centralSearchCtrl.valueChanges.subscribe(value => {
  const text = (value || '').toLowerCase().trim();

  this.filteredCentralGST = this.liabilityList.filter(x =>
    (x.accountName || '').toLowerCase().includes(text)
  ) .sort((a, b) => {
      const aName = (a.accountName || '').toLowerCase();
      const bName = (b.accountName || '').toLowerCase();

      const aStarts = aName.startsWith(text);
      const bStarts = bName.startsWith(text);

      // Items starting with the search text come first
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // Then sort alphabetically
      return aName.localeCompare(bName);
    });
});

// Local GST Search
this.localSearchCtrl.valueChanges.subscribe(value => {
  const text = (value || '').toLowerCase().trim();

  this.filteredLocalGST = this.liabilityList.filter(x =>
    (x.accountName || '').toLowerCase().includes(text)
  ).sort((a, b) => {
      const aName = (a.accountName || '').toLowerCase();
      const bName = (b.accountName || '').toLowerCase();

      const aStarts = aName.startsWith(text);
      const bStarts = bName.startsWith(text);

      // Items starting with the search text come first
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // Then sort alphabetically
      return aName.localeCompare(bName);
    });
});

// TCS Search
this.tcsSearchCtrl.valueChanges.subscribe(value => {
  const text = (value || '').toLowerCase().trim();

  this.filteredTCS = this.liabilityList.filter(x =>
    (x.accountName || '').toLowerCase().includes(text)
  ).sort((a, b) => {
      const aName = (a.accountName || '').toLowerCase();
      const bName = (b.accountName || '').toLowerCase();

      const aStarts = aName.startsWith(text);
      const bStarts = bName.startsWith(text);

      // Items starting with the search text come first
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // Then sort alphabetically
      return aName.localeCompare(bName);
    });
});

// Swach Bharat Search
this.swachSearchCtrl.valueChanges.subscribe(value => {
  const text = (value || '').toLowerCase().trim();

  this.filteredSwach = this.liabilityList.filter(x =>
    (x.accountName || '').toLowerCase().includes(text)
  ).sort((a, b) => {
      const aName = (a.accountName || '').toLowerCase();
      const bName = (b.accountName || '').toLowerCase();

      const aStarts = aName.startsWith(text);
      const bStarts = bName.startsWith(text);

      // Items starting with the search text come first
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // Then sort alphabetically
      return aName.localeCompare(bName);
    });
});

     // Reset Under Group dynamically
  
   
             this.searchCtrl.valueChanges.subscribe(search => {

  const text = (search || '').toLowerCase().trim();

  switch (this.currentDropdown) {

    case 'salePurchase':
      this.filteredLists['salePurchase'] = this.listOfData.filter((x: any) =>
        (x.accountName || '').toLowerCase().includes(text)
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

    case 'gst':
      this.filteredLists['gst'] = this.liabilityList.filter((x: any) =>
        (x.groupCategoryName || '').toLowerCase().includes(text)
      ).sort((a, b) => {
      const aName = (a.groupCategoryName || '').toLowerCase();
      const bName = (b.accountName || '').toLowerCase();

      const aStarts = aName.startsWith(search);
      const bStarts = bName.startsWith(search);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return aName.localeCompare(bName);
    });;
      break;
  }

});
   }

@HostListener('document:keydown', ['$event'])
handleKeyboardShortcuts(event: KeyboardEvent) {
  const activeElement = document.activeElement;

  

 

  
  if (event.altKey && event.key.toLowerCase() === 'c') {
    if (activeElement === this.gstVatMaster?.nativeElement) {
      event.preventDefault();
      this.openGstVat();
    }
  }
  

  
}
handleMatSelectEnter(
  event: any,
  select: MatSelect,
  controlName: string
) {
  event.preventDefault();
  event.stopPropagation();

  const value = this.addEditForm.get(controlName)?.value;

  if (select.panelOpen) {
    return;
  }

  if (value !== null && value !== undefined && value !== '') {
    this.focusNextRegd(select);
  } else {
    select.open();
  }
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


calculateOpeningStockValue() {
const stock = Number(this.addEditForm.get('openingStock')?.value || 0);
  const rate = Number(this.addEditForm.get('openingStockRate')?.value || 0);

  const value = stock * rate;

  this.addEditForm
    .get('openingStockValue')
    ?.setValue(value.toFixed(2), { emitEvent: false });
}

onOpened(type: string, opened: boolean) {

  if (!opened) {
    return;
  }

  this.currentDropdown = type;

  // Clear previous search
  this.searchCtrl.setValue('', { emitEvent: false });

  switch (type) {

    case 'salePurchase':
      this.filteredLists['salePurchase'] = [...this.listOfData];
      break;

    case 'gst':
      this.filteredLists['gst'] = [...this.liabilityList];
      break;

    
  }
}

getSveDataList(): void {

  this.http
    .getAllDataId(
      ApiUrl.listOfTaxTable,
      this.companyId
    )
    .subscribe({

      next: (res: any) => {

        console.log('TAX TABLE SAVED DATA:', res);

        this.usedSalePurcAccountIds = [];
        this.currentEditSalePurcAccountId = 0;

        if (!res || !Array.isArray(res.data)) {

          this.listOFSaveData = [];

          this.getAllData();

          return;
        }

        const currentCompanyId =
          Number(this.companyId || 0);

        // ============================================
        // ONLY CURRENT COMPANY TAX TABLE RECORDS
        // ============================================

        const filtered = res.data.filter((x: any) => {

          const rowCompanyId =
            Number(x.companyId || 0);

          return (
            rowCompanyId === 0 ||
            rowCompanyId === currentCompanyId
          );

        });

        this.listOFSaveData = [...filtered];


        // ============================================
        // FIND CURRENT EDIT RECORD ACCOUNT
        // ============================================

        if (this.categoryId > 0) {

          const currentRecord = filtered.find(
            (x: any) =>
              Number(x.id || 0) ===
              Number(this.categoryId)
          );

          if (currentRecord) {

            this.currentEditSalePurcAccountId =
              Number(
                currentRecord.salePurcAccountId || 0
              );

          }

        }


        // ============================================
        // GET USED ACCOUNT IDS
        // ============================================

        this.usedSalePurcAccountIds = filtered

          .filter((x: any) => {

            const taxTableId =
              Number(x.id || 0);

            const accountId =
              Number(
                x.salePurcAccountId || 0
              );

            if (accountId <= 0) {
              return false;
            }

            // ========================================
            // EDIT MODE:
            // CURRENT RECORD ACCOUNT IS NOT BLOCKED
            // ========================================

            if (
              this.categoryId > 0 &&
              taxTableId === Number(this.categoryId)
            ) {

              return false;

            }

            return true;

          })

          .map((x: any) =>
            Number(x.salePurcAccountId)
          );


        // Remove duplicate IDs

        this.usedSalePurcAccountIds =
          [...new Set(
            this.usedSalePurcAccountIds
          )];


        console.log(
          'CURRENT EDIT ACCOUNT ID:',
          this.currentEditSalePurcAccountId
        );

        console.log(
          'USED SALE/PURCHASE ACCOUNT IDS:',
          this.usedSalePurcAccountIds
        );


        // ============================================
        // NOW LOAD ACCOUNT MASTER
        // ============================================

        this.getAllData();

      },

      error: (err) => {

        console.error(
          'Tax Table API Error:',
          err
        );

        this.usedSalePurcAccountIds = [];
        this.currentEditSalePurcAccountId = 0;
        this.listOFSaveData = [];

        this.getAllData();

      }

    });

}

getAllData(): void {

  this.http
    .getAllDataId(
      ApiUrl.listOfAccount,
      this.companyId
    )
    .subscribe({

      next: (res: any) => {

        console.log(
          'ACCOUNT MASTER DATA:',
          res
        );


        if (
          !res ||
          !Array.isArray(res.data)
        ) {

          this.listOfData = [];
          this.liabilityList = [];
          this.filteredLists['salePurchase'] = [];

          this.showSpiner = false;

          return;
        }


        // ============================================
        // ACCOUNT MASTER COMPANY FILTER
        // ============================================

        const filtered =
          res.data.filter((x: any) => {

            const accountCompanyId =
              Number(x.companyId || 0);

            const currentCompanyId =
              Number(this.companyId || 0);

            return (
              accountCompanyId === 0 ||
              accountCompanyId === currentCompanyId
            );

          });


        // ============================================
        // SORT
        // ============================================

        this.originalList =
          [...filtered].sort(
            (a: any, b: any) =>
              (a.accountName || '')
                .localeCompare(
                  b.accountName || ''
                )
          );


        // ============================================
        // ALLOWED GROUPS
        // ============================================

        const allgroupName = [

          'SALES ACCOUNTS',
          'PURCHASE ACCOUNTS',
          'DIRECT EXPENSES',
          'INDIRECT EXPENSES',
          'DIRECT INCOME',
          'INDIRECT INCOME'

        ];


        // ============================================
        // SALE / PURCHASE ACCOUNT LIST
        // ============================================

        this.listOfData =
          this.originalList.filter((x: any) => {

            // ----------------------------------------
            // GROUP CHECK
            // ----------------------------------------

            if (
              !allgroupName.includes(
                x.groupName
              )
            ) {

              return false;

            }


            const accountId =
              Number(x.id || 0);


            // ----------------------------------------
            // CURRENT EDIT ACCOUNT
            // ALWAYS SHOW IT
            // ----------------------------------------

            if (
              this.categoryId > 0 &&
              accountId ===
              this.currentEditSalePurcAccountId
            ) {

              return true;

            }


            // ----------------------------------------
            // ALREADY USED ACCOUNT
            // DON'T SHOW
            // ----------------------------------------

            if (
              this.usedSalePurcAccountIds
                .includes(accountId)
            ) {

              console.log(
                'REMOVED USED ACCOUNT:',
                x.accountName,
                accountId
              );

              return false;

            }


            return true;

          });


        // ============================================
        // LIABILITY LIST
        // ============================================

        this.liabilityList =
          this.originalList.filter(
            (x: any) =>
              x.groupName ===
              'DUTIES & TAXES'
          );


        // ============================================
        // INITIAL DROPDOWN LIST
        // ============================================

        this.filteredLists[
          'salePurchase'
        ] = [
          ...this.listOfData
        ];


        this.filteredCentralGST =
          [...this.liabilityList];

        this.filteredLocalGST =
          [...this.liabilityList];

        this.filteredTCS =
          [...this.liabilityList];

        this.filteredSwach =
          [...this.liabilityList];


        console.log(
          'CURRENT EDIT ACCOUNT:',
          this.currentEditSalePurcAccountId
        );

        console.log(
          'USED ACCOUNT IDS:',
          this.usedSalePurcAccountIds
        );

        console.log(
          'FINAL ACCOUNT DROPDOWN:',
          this.listOfData
        );


        this.cdr.detectChanges();


        // ============================================
        // EDIT MODE
        // ============================================

        if (this.categoryId > 0) {

          this.updateData();

        } else {

          this.showSpiner = false;

        }

      },

      error: (err) => {

        console.error(
          'Account Master API Error:',
          err
        );

        this.listOfData = [];
        this.liabilityList = [];

        this.filteredLists[
          'salePurchase'
        ] = [];

        this.showSpiner = false;

      }

    });

}




 
updateData(): void {
  this.showSpiner = true;

  this.http.getAllDataId(ApiUrl.getTaxTaableForEdit,this.categoryId)
    .subscribe({
      next: (res: any) => {
        console.log('API RESPONSE:', res);

        // Make sure the API call was successful and data exists
        if (res?.success && res.data) {
          const data = res.data; // extract actual group object

this.addEditForm.patchValue({

  id: Number(data.id || 0),

  companyId:
    Number(data.companyId || this.companyId),

  salePurcAccountName:
    Number(data.salePurcAccountName || 0),

  selectType: data.selectType ?? '',

  underVatReturn:
    data.underVatReturn ?? '',

  exciseApplicabe:
    data.exciseApplicabe ?? false,

  gstApplicabeCentral:
    data.gstApplicabeCentral ?? false,

  gstApplicabeCentralName:
    data.gstApplicabeCentralName ,

  gstApplicabeCentralRate:
    data.gstApplicabeCentralRate ?? 0,

  gstApplicabeCentralCalculateOn:
    data.gstApplicabeCentralCalculateOn ?? '',

  gstApplicabeLocal:
    data.gstApplicabeLocal ?? false,

  gstApplicabeLocalName:
    data.gstApplicabeLocalName ,

  gstApplicabeLocalRate:
    data.gstApplicabeLocalRate ?? 0,

  gstApplicabeLocalCalculateOn:
    data.gstApplicabeLocalCalculateOn ?? '',

  tcsApplicabe:
    data.tcsApplicabe ?? false,

  tcsApplicabeName:
    data.tcsApplicabeName ,

  tcsApplicabeRate:
    data.tcsApplicabeRate ?? 0,

  tcsApplicabeCalculateOn:
    data.tcsApplicabeCalculateOn ?? '',

  swachBhartApplicable:
    data.swachBhartApplicable ?? false,

  swachBhartApplicableName:
    data.swachBhartApplicableName ,

  swachBhartApplicableRate:
    data.swachBhartApplicableRate ?? 0,

  swachBhartApplicableCalculateOn:
    data.swachBhartApplicableCalculateOn ?? '',

  totalax:
    data.totalax ?? 0,

  subTotalTax:
    data.subTotalTax ?? 0

});


this.addEditForm.updateValueAndValidity();
          console.log('FORM AFTER PATCH:', this.addEditForm.value);
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


clearZero(event: FocusEvent) {
  const input = event.target as HTMLInputElement;

  if (input.value === '0') {
    input.value = '';
  }
}

restoreZero(event: FocusEvent) {
  const input = event.target as HTMLInputElement;

  if (input.value.trim() === '') {
    input.value = '0';
    input.dispatchEvent(new Event('input')); // Update FormControl
  }
}
onDropdownClosed(select: MatSelect, controlName: string) {

  setTimeout(() => {

    this.searchCtrl.setValue('', { emitEvent: false });

    const currentValue = this.addEditForm.get(controlName)?.value;

    console.log('Value:', currentValue);

    if (currentValue !== null &&
        currentValue !== undefined &&
        currentValue !== '') {

      this.focusNextRegd(select);
    }

  }, 150);
}
onSelectionChange(select: MatSelect) {
  this.searchCtrl.setValue('', { emitEvent: false });

  this.focusNextRegd(select);
}


makeForm() {
  this.addEditForm = this.fb.group({

    id: [0],
    companyId: [this.companyId, Validators.required],
salePurcAccountName: ['',Validators.required],
selectType: ['',Validators.required],
underVatReturn: [''],

exciseApplicabe: [false],

gstApplicabeCentral: [false],
gstApplicabeCentralName: [0],
gstApplicabeCentralRate: [0],
gstApplicabeCentralCalculateOn: ['',],

gstApplicabeLocal: [false],
gstApplicabeLocalName: [0],
gstApplicabeLocalRate: [0],
gstApplicabeLocalCalculateOn: [''],

tcsApplicabe: [false],
tcsApplicabeName: [0],
tcsApplicabeRate: [0],
tcsApplicabeCalculateOn: [''],

swachBhartApplicable: [false],
swachBhartApplicableName: [0],
swachBhartApplicableRate: [0],
swachBhartApplicableCalculateOn: [''],
totalax: [0],
subTotalTax: [0]

  });
}
// setupConditionalTaxValidation(
//   toggle: string,
//   name: string,
//   rate: string,
//   calcOn: string
// ) {
//   const toggleCtrl = this.addEditForm.get(toggle);
//   const nameCtrl = this.addEditForm.get(name);
//   const rateCtrl = this.addEditForm.get(rate);
//   const calcCtrl = this.addEditForm.get(calcOn);

//   const apply = (enabled: boolean) => {
//     if (enabled === true) {
//       nameCtrl?.setValidators([Validators.required]);
//       rateCtrl?.setValidators([Validators.required, Validators.min(0.01)]);
//       calcCtrl?.setValidators([Validators.required]);

//       nameCtrl?.enable({ emitEvent: false });
//       rateCtrl?.enable({ emitEvent: false });
//       calcCtrl?.enable({ emitEvent: false });
//     } else {
//       nameCtrl?.clearValidators();
//       rateCtrl?.clearValidators();
//       calcCtrl?.clearValidators();

//       nameCtrl?.setValue(0, { emitEvent: false });
//       rateCtrl?.setValue(0, { emitEvent: false });
//       calcCtrl?.setValue('', { emitEvent: false });

//       nameCtrl?.disable({ emitEvent: false });
//       rateCtrl?.disable({ emitEvent: false });
//       calcCtrl?.disable({ emitEvent: false });
//     }

//     nameCtrl?.updateValueAndValidity({ emitEvent: false });
//     rateCtrl?.updateValueAndValidity({ emitEvent: false });
//     calcCtrl?.updateValueAndValidity({ emitEvent: false });
//   };

//   // ✅ APPLY ON CHANGE
//   toggleCtrl?.valueChanges.subscribe(apply);

//   // ✅ APPLY ON INITIAL LOAD / EDIT MODE
//   apply(toggleCtrl?.value);
// }
setupConditionalTaxValidation(
  toggle: string,
  name: string,
  rate: string,
  calcOn: string
) {

  const toggleCtrl = this.addEditForm.get(toggle);
  const nameCtrl = this.addEditForm.get(name);
  const rateCtrl = this.addEditForm.get(rate);
  const calcCtrl = this.addEditForm.get(calcOn);

  const apply = (enabled: boolean) => {

    if (enabled === true) {

      // Dropdown is mandatory and 0 is NOT allowed
      nameCtrl?.setValidators([
        Validators.required,
        Validators.min(1)
      ]);

      // Rate is mandatory but 0 is allowed
      rateCtrl?.setValidators([
        Validators.required
      ]);

      // Calculate On is mandatory
      calcCtrl?.setValidators([
        Validators.required
      ]);

      nameCtrl?.enable({ emitEvent: false });
      rateCtrl?.enable({ emitEvent: false });
      calcCtrl?.enable({ emitEvent: false });

    } else {

      nameCtrl?.clearValidators();
      rateCtrl?.clearValidators();
      calcCtrl?.clearValidators();

      // When NO
      nameCtrl?.setValue(0, { emitEvent: false });
      rateCtrl?.setValue(0, { emitEvent: false });
      calcCtrl?.setValue('', { emitEvent: false });

      nameCtrl?.disable({ emitEvent: false });
      rateCtrl?.disable({ emitEvent: false });
      calcCtrl?.disable({ emitEvent: false });
    }

    nameCtrl?.updateValueAndValidity({ emitEvent: false });
    rateCtrl?.updateValueAndValidity({ emitEvent: false });
    calcCtrl?.updateValueAndValidity({ emitEvent: false });
  };

  toggleCtrl?.valueChanges.subscribe(apply);

  apply(toggleCtrl?.value);
}


calculateTaxTotals() {
  const f = this.addEditForm.value;

  let totalTax = 0;
  let subTotalTax = 0;

  const add = (rate: any, calculateOn: string) => {
    const r = Number(rate || 0);
    if (!r) return;

    if (calculateOn === 'Taxable Amount') {
      totalTax += r;
    }

    if (calculateOn === 'Sub Total') {
      subTotalTax += r;
    }
  };

  // GST Central
  add(f.gstApplicabeCentralRate, f.gstApplicabeCentralCalculateOn);

  // GST Local
  add(f.gstApplicabeLocalRate, f.gstApplicabeLocalCalculateOn);

  // TCS
  add(f.tcsApplicabeRate, f.tcsApplicabeCalculateOn);

  // Swach Bharat
  add(f.swachBhartApplicableRate, f.swachBhartApplicableCalculateOn);

  this.addEditForm.patchValue(
    {
      totalax: totalTax,
      subTotalTax: subTotalTax
    },
    { emitEvent: false }
  );
}








onSubmit() {
  this.submit = true;  // <-- mark form as submitted

  if (this.addEditForm.invalid) {
    return; // stop if form is invalid
  }

 

  this.http.addEditData(ApiUrl.addEditTaxTable,this.addEditForm.value)
    .subscribe({
      next: (res: any) => {
        const message = res?.message 
          || (this.isEditMode ? 'Group updated successfully' : 'Group added successfully');

        this.snackBar.open(message, 'Close', { duration: 3000 });

        setTimeout(() => {
          this.showSpiner = false;
          setTimeout(() => this.dialogRef.close(true));
        });
      },
      error: (err) => {
        this.showSpiner = false;
        this.snackBar.open(err?.error?.message || 'Failed to save group', 'Close', { duration: 3000 });
      }
    });
}




get isEditMode(): boolean {
  return !!this.categoryId && this.categoryId > 0;
}




openGstVat(data?: any) {
   const dialogRef = this.dialog.open(AddEditAccount, {
      width: '500px',
      data: data || null
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
         this.getSveDataList(); // reload list automatically
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
    this.dialogRef.close();
    this.changeLocation()
   
  }
}
