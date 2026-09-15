import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject,AfterViewInit, NgZone, ViewChild, ElementRef, HostListener } from '@angular/core';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../material.module';
import { AllApiService } from '../../../_core/_service/all-api.service';
import { ApiUrl } from '../../../_core/apiUrl';
import { AddEditGroupMaster } from '../../group-master/add-edit-group-master/add-edit-group-master';
import { AddEditAgentMaster } from '../../agent-master/add-edit-agent-master/add-edit-agent-master';
import { AddEditTransportMaster } from '../../transport-master/add-edit-transport-master/add-edit-transport-master';
import { AddEditGstVatMaster } from '../../gst-vat-master/add-edit-gst-vat-master/add-edit-gst-vat-master';
import { City } from '../../city/city';
import { State } from '../../state/state';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { AddEditRegisterType } from '../../register-type/add-edit-register-type/add-edit-register-type';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
@Component({
  selector: 'app-add-edit-account',
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule,
    NgxMatSelectSearchModule
  ],
  templateUrl: './add-edit-account.html',
  styleUrl: './add-edit-account.scss',
    providers: [TitleCasePipe]
})
export class AddEditAccount {
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
  //



  if (event.key !== 'Enter' && event.key !== 'Tab') {
    return;
  }

  const target = event.target as HTMLElement;

  if (target.tagName === 'TEXTAREA' && event.shiftKey) {
    return;
  }

  // Account Name validation
  if (target === this.accountNameRef?.nativeElement) {

    const control = this.addEditForm.get('accountName');

    control?.markAsTouched();

    const value = (control?.value || '').trim();

    if (!value || control?.invalid) {
      event.preventDefault();

      setTimeout(() => {
        this.accountNameRef.nativeElement.focus();
      });

      return; // Don't move to next control
    }
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
@ViewChild('groupSelect') groupSelect!: MatSelect;


focusNext(select: MatSelect) {

  setTimeout(() => {

    const current = select._elementRef.nativeElement;
    console.log('Current:', current);

    const form = current.closest('form');
    if (!form) {
      console.log('Form not found');
      return;
    }

    const elements = Array.from(
      form.querySelectorAll(`
        input:not([disabled]),
        textarea:not([disabled]),
        select:not([disabled]),
        .mat-mdc-select,
        button:not([disabled])
      `)
    ).filter(
      (el: any) =>
        el.offsetParent !== null &&
        !el.hasAttribute('readonly')
    ) as HTMLElement[];

    console.log('Elements:', elements);

    const index = elements.indexOf(current);
    console.log('Index:', index);

    if (index > -1 && index < elements.length - 1) {
      const next = elements[index + 1];
      console.log('Next:', next);

      const trigger = next.querySelector('.mat-mdc-select-trigger') as HTMLElement;

      if (trigger) {
        trigger.focus();
      } else {
        next.focus();
      }
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


  handleMatSelectEnter(select: MatSelect, controlName: string) {
  console.log('ENTER');
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









onGroupClosed(select: MatSelect) {
  const currentValue = this.addEditForm.get('groupId')?.value;
  // If a value exists (even unchanged), move next
  if (currentValue !== null && currentValue !== undefined && currentValue !== '') {
    setTimeout(() => this.focusNext(select), 100);
  }
}
@ViewChild('agentMaster') agentMaster!: MatSelect;
@ViewChild('transportMaster') transportMaster!: MatSelect;
@ViewChild('gstVatMaster') gstVatMaster!: MatSelect;
@ViewChild('city') city!: MatSelect;
@ViewChild('registerType') registerType!: MatSelect;
@ViewChild('transportMode') transportMode!: MatSelect;
@ViewChild('openingBalanceTypeRef')
openingBalanceTypeRef!: ElementRef<HTMLSelectElement>;
@ViewChild('accountNameRef')
accountNameRef!: ElementRef<HTMLInputElement>;
@ViewChild('openingBalanceRef')
openingBalanceRef!: ElementRef<HTMLInputElement>;

isSaving = false;
searchCtrl = new FormControl('');

filteredLists: { [key: string]: any[] } = {};
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
  listOfAgentData:any=[];
  listOfTransport:any=[];
   listOfHeading: any[] = []; 
   originalList: any[] = [];
   listOfUnit:any[] =[];
   listOfGorupMaster:any[] =[];
   filteredGroupList: any[] = [];
   groupSearchText = '';
   listOfCity:any[]=[];
    listOfRegisterTyeData:any[]=[];

   listOfVATGSTData:any[]=[];
   currentDropdown = '';
  
 isAccountExists = false;
 filterDropdown(
  listName: string,
  sourceList: any[],
  field: string
) {
  const search = (this.searchCtrl.value || '').toLowerCase();

  this.filteredLists[listName] = sourceList.filter(item =>
    (item[field] || '').toLowerCase().includes(search)
  );
}

citySearchCtrl = new FormControl('');
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,private titleCase: TitleCasePipe ,private http:AllApiService,private cRouter:ActivatedRoute,
  private router: Router,private ngZone: NgZone,public dialog: MatDialog,
  private snackBar: MatSnackBar,
  private cdr: ChangeDetectorRef,public dialogRef: MatDialogRef<AddEditAccount>){
 
  }
 
//  ngAfterViewInit(): void {
//   if (this.categoryId) {
//     this.updateData();
//   }
// }
  ngOnInit(): void {
    this.companyId = JSON.parse(localStorage.getItem('loggedUser') || '{}').companyId;
     this.userName = JSON.parse(localStorage.getItem('loggedUser') || '{}').username;
    
    
    this.data;
 
    this.categoryId = this.data?.id || 0;
   
   
    this.makeForm();
      // ===========================
  // Search for all mat-selects
  // ===========================
this.searchCtrl.valueChanges.subscribe(search => {

  search = (search || '').toLowerCase();

  switch (this.currentDropdown) {

    case 'group':
      this.filteredLists['group'] = this.listOfGorupMaster
    .filter(x =>
      (x.groupName || '').toLowerCase().includes(search)
    )
    .sort((a, b) => {
      const aName = (a.groupName || '').toLowerCase();
      const bName = (b.groupName || '').toLowerCase();

      const aStarts = aName.startsWith(search);
      const bStarts = bName.startsWith(search);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return aName.localeCompare(bName);
    });
      break;

    case 'agent':
      this.filteredLists['agent'] = this.listOfAgentData.filter((x:any) =>
        (x.agentName || '').toLowerCase().includes(search)
      );
      break;

  //   case 'city':
  // this.filteredLists['city'] = this.listOfCity.filter(x =>
  //   (
  //     `${x.cityName || ''} ${x.stateName || ''} ${x.stateCode || ''}`
  //   )
  //     .toLowerCase()
  //     .includes(search)
  // );
  // break;
  case 'city':
  this.filteredLists['city'] = this.listOfCity
    .filter(x =>
      (
        `${x.cityName || ''} ${x.stateName || ''} ${x.stateCode || ''}`
      )
        .toLowerCase()
        .includes(search)
    )
    .sort((a, b) => {

      const aText = `${a.cityName || ''} ${a.stateName || ''} ${a.stateCode || ''}`.toLowerCase();
      const bText = `${b.cityName || ''} ${b.stateName || ''} ${b.stateCode || ''}`.toLowerCase();

      const aStarts = aText.startsWith(search);
      const bStarts = bText.startsWith(search);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return aText.localeCompare(bText);
    });

  break;

    case 'transport':
      this.filteredLists['transport'] = this.listOfTransport.filter((x:any) =>
        (x.name || '').toLowerCase().includes(search)
      );
      break;

    case 'gst':
      this.filteredLists['gst'] = this.listOfVATGSTData.filter(x =>
        (x.className || '').toLowerCase().includes(search)
      );
      break;
  }

});

      this.addEditForm.get('openingStock')?.valueChanges.subscribe(() => {
    this.calculateOpeningStockValue();
  });

  this.addEditForm.get('openingStockRate')?.valueChanges.subscribe(() => {
    this.calculateOpeningStockValue();
  });
  this.checkDuplicateAccount();
    this.getGroupMaster();
    this.getAllUnit();
    this.getAllCity();
    this.getAllAgentMaster();
    this.getAllTransport();
    this.getAllGSTVATData();
    this.gstVat();
    this.getRegistTypeData();
   
   this.handleOpeningBalanceValidation();
  this.handleClosingBalanceValidation();
  this.handleGroupChange();
this.addEditForm.get('groupId')?.valueChanges.subscribe(() => {
 this.updateCityValidationRules();
});

this.addEditForm.get('opBalance')?.valueChanges.subscribe(() => {
 this.updateCityValidationRules();
});

     // Reset Under Group dynamically
  
  //   if(this.categoryId) { 
      
  //      this.updateData() ;
      
  //  }
  //  else{
  //  this.showSpiner = false;
  //     }

      
      
   }
// getHighlightedParts(text: string) {
//   const search = (this.searchCtrl.value || '').trim();

//   if (!search) {
//     return {
//       before: text,
//       match: '',
//       after: ''
//     };
//   }

//   const index = text.toLowerCase().indexOf(search.toLowerCase());

//   if (index === -1) {
//     return {
//       before: text,
//       match: '',
//       after: ''
//     };
//   }

//   return {
//     before: text.substring(0, index),
//     match: text.substring(index, index + search.length),
//     after: text.substring(index + search.length)
//   };
// }


// getHighlightedParts(text: string, searchCtrl: FormControl) {
//   const search = (searchCtrl.value || '').trim();

//   if (!search) {
//     return {
//       before: text,
//       match: '',
//       after: ''
//     };
//   }

//   const index = text.toLowerCase().indexOf(search.toLowerCase());

//   if (index === -1) {
//     return {
//       before: text,
//       match: '',
//       after: ''
//     };
//   }

//   return {
//     before: text.substring(0, index),
//     match: text.substring(index, index + search.length),
//     after: text.substring(index + search.length)
//   };
// }

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

@HostListener('document:keydown', ['$event'])
handleKeyboardShortcuts(event: KeyboardEvent) {
  const activeElement = document.activeElement;

  // ALT + U → Unit Master
  if (event.altKey && event.key.toLowerCase() === 'c') {
     if (
      activeElement === this.groupSelect?._elementRef.nativeElement ||
      this.groupSelect?.focused
  ) {
    event.preventDefault();
    this.openGroupMaster();
  }
  }

  // ALT + G → Agent  Master

     if (event.altKey && event.key.toLowerCase() === 'c') {
     if (
      activeElement === this.agentMaster?._elementRef.nativeElement ||
      this.agentMaster?.focused
  ) {
    event.preventDefault();
    this.openAgentMaster();
  }
  }

  if (event.altKey && event.key.toLowerCase() === 'c') {
     if (
      activeElement === this.transportMaster?._elementRef.nativeElement ||
      this.transportMaster?.focused
  ) {
    event.preventDefault();
    this.openTransportMaster();
  }
    
  }
  if (event.altKey && event.key.toLowerCase() === 'c') {
    if (activeElement === this.gstVatMaster?._elementRef.nativeElement ||
      this.gstVatMaster?.focused
    )
       {
      event.preventDefault();
      this.openGstVat();
    }
  }

    if (event.altKey && event.key.toLowerCase() === 'c') {
    if (activeElement === this.registerType?._elementRef.nativeElement ||
      this.registerType?.focused
    )
       {
      event.preventDefault();
      this.openRegistrationType();
    }
  }


  

   if (event.altKey && event.key.toLowerCase() === 'c') {
    if (
      activeElement === this.city?._elementRef.nativeElement ||
      this.city?.focused
  ) {
    event.preventDefault();
    this.openCity();
  }
  }
}

@ViewChild('openingBalanceRefs')openingBalanceRefs!: ElementRef<HTMLInputElement>;
focusOpeningBalance(event: KeyboardEvent) {

  const gstVatReturn =
    this.addEditForm.get('gstVatReturn')?.value;

  if (gstVatReturn === false) {

    event.preventDefault();

    setTimeout(() => {
      this.openingBalanceRefs.nativeElement.focus();
    });
  }
}

blockDuplicateAccount(event: KeyboardEvent) {

  const control = this.addEditForm.get('accountName');

  if (
    control?.hasError('duplicate') &&
    (event.key === 'Tab' || event.key === 'Enter')
  ) {

    event.preventDefault();

    setTimeout(() => {
      this.accountNameRef.nativeElement.focus();
    });
  }
}
handleGroupChange() {
  this.addEditForm.get('groupName')?.valueChanges.subscribe(group => {
    const opBalance = this.addEditForm.get('opBalance');
    const balanceType = this.addEditForm.get('openingBalanceType');

    const isSundry =
      group === 'SUNDRY CREDITORS' || group === 'SUNDRY DEBTORS';

    if (isSundry) {
      // Sundry → user must enter balance
      opBalance?.setValue(null);
      opBalance?.setValidators([Validators.required]);
    } else {
      // Non-sundry → balance always 0
      opBalance?.setValue(0);
      opBalance?.clearValidators();

      balanceType?.setValue('');
      balanceType?.clearValidators();
    }

    opBalance?.updateValueAndValidity();
    balanceType?.updateValueAndValidity();
  });
}

isSundryGroup(): boolean {
  const groupId = this.addEditForm.get('groupId')?.value;
  const group = this.listOfGorupMaster.find(g => g.groupId == groupId);

  if (!group) return false;

  const name = (group.groupName || '').toUpperCase();
  return name === 'SUNDRY CREDITORS' || name === 'SUNDRY DEBTORS';
}
updateCityValidationRules() {
  const cityCtrl = this.addEditForm.get('cityId');
  if (!cityCtrl) return;

  if (this.isSundryGroup()) {
    cityCtrl.setValidators([
      Validators.required,
      Validators.min(1)
    ]);
  } else {
    cityCtrl.clearValidators();
    // Don't reset the value here
  }

  cityCtrl.updateValueAndValidity({ emitEvent: false });
}

checkDuplicateOnBlur() {

  const control = this.addEditForm.get('accountName');

  if (!control) return;

  let value = (control.value || '')
    .replace(/\s+/g, ' ')
    .trim();

  control.setValue(value, { emitEvent: false });

  if (!value) {
    this.isAccountExists = false;
    control.setErrors(null);
    return;
  }

  this.http.getAllDataByThreId(
    ApiUrl.checkAccountExists,
    this.companyId,
    value,
    this.categoryId || 0
  )
  .subscribe((res: any) => {

    this.isAccountExists = res?.data?.existsData ?? false;

    if (this.isAccountExists) {

      const errors = {
        ...(control.errors || {}),
        duplicate: true
      };

      control.setErrors(errors);
      control.markAsTouched();
      control.markAsDirty();

      setTimeout(() => {
        this.accountNameRef?.nativeElement.focus();
      });

    } else {

      const errors = { ...(control.errors || {}) };

      delete errors['duplicate'];

      control.setErrors(
        Object.keys(errors).length ? errors : null
      );
    }

    // ❌ Remove this line
    // control.updateValueAndValidity({ emitEvent: false });

  });
}

checkDuplicateAccount() {
  this.addEditForm.get('accountName')?.valueChanges
    .pipe(
      debounceTime(400),
      distinctUntilChanged()
    )
    .subscribe((value: string) => {

      if (!value?.trim()) {
        this.isAccountExists = false;
        return;
      }

      this.http.getAllDataByThreId(
        ApiUrl.checkAccountExists,
        this.companyId,
        value,
        this.categoryId || 0
      )
      .subscribe((res: any) => {

        this.isAccountExists =
          res?.data?.existsData;

        const control =
          this.addEditForm.get('accountName');

        if (this.isAccountExists) {

          control?.setErrors({
            ...control.errors,
            duplicate: true
          });

        } else {

          const errors = control?.errors;

          if (errors) {
            delete errors['duplicate'];

            control?.setErrors(
              Object.keys(errors).length
                ? errors
                : null
            );
          }
        }
      });
    });
}


removeExtraSpaces(controlName: string) {
  const control = this.addEditForm.get(controlName);
  if (!control) return;

  const value = control.value || '';

  const cleanedValue = value
    .replace(/\s+/g, ' ')
    .trim();

  if (value !== cleanedValue) {
    control.patchValue(cleanedValue);
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

onTransportModeKeyDown(event: KeyboardEvent, select: MatSelect) {

  if (event.key !== 'Enter') {
    return;
  }

  event.preventDefault();

  const value = this.addEditForm.get('transportMode')?.value;

  // Nothing selected
  if (!value || value === 'Null') {
    select.open();
    return;
  }

  // If dropdown is open, close it first
  if (select.panelOpen) {
    select.close();
  }

  // Move to next control
  setTimeout(() => {
    this.focusNextRegd(select);
  }, 100);
}


onTransportModeKeyTransperDown(event: KeyboardEvent, transportMode: MatSelect) {

  if (event.key !== 'Enter') {
    return;
  }

  // event.preventDefault();
  // event.stopPropagation();

  // If dropdown is already open, let the user select.
  if (transportMode.panelOpen) {
    return;
  }

  const value = this.addEditForm.get('transportMode')?.value;

  // If value already exists, move to next control.
  if (value && value !== 'Null') {
    this.focusNextRegd(transportMode);
  } else {
    // No value selected, open the dropdown.
    transportMode.open();
  }
}

blockIfTypeNotSelected(event: KeyboardEvent) {
  const opBalance = Number(this.addEditForm.get('opBalance')?.value || 0);
  const type = this.addEditForm.get('openingBalanceType')?.value;

  // Block TAB / ENTER
  if (
    opBalance > 0 &&
    !type &&
    (event.key === 'Tab' || event.key === 'Enter')
  ) {
    event.preventDefault();
    this.forceFocusToType();
  }
}

forceTypeSelection() {
  const opBalance = Number(this.addEditForm.get('opBalance')?.value || 0);
  const type = this.addEditForm.get('openingBalanceType')?.value;

  // Block mouse click outside
  if (opBalance > 0 && !type) {
    this.forceFocusToType();
  }
}

forceFocusToType() {
  this.submit = true;
  setTimeout(() => {
    this.openingBalanceTypeRef.nativeElement.focus();
  });
}


gstVat() {
  const gstReturnCtrl = this.addEditForm.get('gstVatReturn');
  const gstCtrl = this.addEditForm.get('gstVat');

  if (!gstReturnCtrl || !gstCtrl) return;

  const applyRule = (useGst: boolean) => {
    if (useGst === true) {
      // GST required
      gstCtrl.enable({ emitEvent: false });
      gstCtrl.setValidators([
        Validators.required,
        Validators.min(1)
      ]);
    } else {
      // GST not required
      gstCtrl.setValue(0, { emitEvent: false });
      gstCtrl.clearValidators();
      gstCtrl.disable({ emitEvent: false });
    }

    gstCtrl.updateValueAndValidity({ emitEvent: false });
  };

  // apply on initial load
  applyRule(gstReturnCtrl.value);

  // apply on change
  gstReturnCtrl.valueChanges.subscribe(value => {
    applyRule(value);
  });
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

    case 'group':
      this.filteredLists['group'] = [...this.listOfGorupMaster];
      break;

    case 'agent':
      this.filteredLists['agent'] = [...this.listOfAgentData];
      break;

  case 'city':
  this.filteredLists['city'] = [...this.listOfCity];
  break;

    case 'transport':
      this.filteredLists['transport'] = [...this.listOfTransport];
      break;

    case 'gst':
      this.filteredLists['gst'] = [...this.listOfVATGSTData];
      break;
  }
}

// getGroupMaster() {
//   this.http
//     .getAllDataId(ApiUrl.groupMasterByCompanyId, this.companyId)
//     .subscribe((res: any) => {

//       if (!res || !Array.isArray(res.data)) {
//         this.listOfGorupMaster = [];
//         return;
//       }

//       const filtered = res.data.filter(
//         (x: any) => x.companyId === 0 || x.companyId === this.companyId
//       );

//       this.originalList = filtered.sort((a: any, b: any) =>
//         a.groupName.localeCompare(b.groupName)
//       );

//       this.listOfGorupMaster = [...this.originalList];
//       this.cdr.detectChanges();
//     });
// }




getGroupMaster() {
  this.http
    .getAllDataId(ApiUrl.groupMasterByCompanyId, this.companyId)
    .subscribe((res: any) => {

      const filtered = res.data.filter(
        (x: any) => x.companyId === 0 || x.companyId === this.companyId
      );

      this.listOfGorupMaster = filtered.sort((a: any, b: any) =>
        a.groupName.localeCompare(b.groupName)
      );

      this.filteredLists['group'] = [...this.listOfGorupMaster];
    });
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
      this.cdr.detectChanges();
    });
}


openSelect(event: KeyboardEvent) {
  event.preventDefault();

  const select = event.target as HTMLSelectElement;

  select.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      altKey: true,
      bubbles: true
    })
  );
}



//  getAllCity(): void {
//   this.http.getAllData(ApiUrl.getAllCity)
//     .pipe(
//       finalize(() => {
//         this.cdr.markForCheck(); 
//       })
//     )
//     .subscribe({
//       next: (data: any[]) => {
//         this.listOfCity = (data ?? []).sort((a, b) =>
//           (a.cityName || '').localeCompare(b.cityName || '')
//         );
//         this.filteredLists['city'] = [...this.listOfCity];
//          // ✅ CLEAR SELECT HERE
      
//       },
//       error: (err) => {
//         console.error(err);
//       }
//     });
// }

getAllCity(): void {

  this.http.getAllData(ApiUrl.getAllCity)
    .subscribe((data: any[]) => {

      this.listOfCity = (data ?? []).sort((a, b) =>
        (a.cityName || '').localeCompare(b.cityName || '')
      );

      this.filteredLists['city'] = [...this.listOfCity];

      // Edit mode
      if (this.categoryId) {
        this.updateData();
      }

    });

}



getAllAgentMaster() {
  this.http
    .getAllDataId(ApiUrl.listOfAgent, this.companyId)
    .subscribe((res: any) => {

      if (!res || !Array.isArray(res.data)) {
        this.listOfAgentData = [];
        return;
      }

      const filtered = res.data.filter(
        (x: any) => x.companyId === 0 || x.companyId === this.companyId
      );

      this.originalList = filtered.sort((a: any, b: any) =>
        a.agentName.localeCompare(b.agentName)
      );

      this.listOfAgentData = [...this.originalList];
      this.cdr.detectChanges();
    });
}




getAllGSTVATData() {
  this.http
    .getAllDataId(ApiUrl.listOfGstVat, this.companyId)
    .subscribe((res: any) => {

      if (!res || !Array.isArray(res.data)) {
        this.originalList = [];
        this.listOfVATGSTData = [];
        return;
      }

      // SQL procedure already returns:
      // 1,2,3,4 = common records
      // company-specific records = current company
      // So don't filter again here.

      this.originalList = [...res.data];

      this.listOfVATGSTData = [...this.originalList];

      this.cdr.detectChanges();
    });
}

getRegistTypeData() {
  this.http
    .getAllDataId(ApiUrl.getRegistrationType,this.companyId)
    .subscribe((res: any) => {

      if (!res || !Array.isArray(res.data)) {
        this.listOfRegisterTyeData = [];
        return;
      }

      const filtered = res.data.filter(
        (x: any) => x.companyId === 0 || x.companyId === this.companyId
      );

      this.originalList = filtered.sort((a: any, b: any) =>
        a.registerType.localeCompare(b.registerType)
      );

      this.listOfRegisterTyeData = [...this.originalList];
      this.cdr.detectChanges();
    });
}

getAllTransport() {
  this.http
    .getAndEditById(ApiUrl.getAndEdit, this.companyId)
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





 
// updateData(): void {
//   this.showSpiner = true;

//   this.http.getAllDataId(ApiUrl.getDataForEditAccount,this.categoryId)
//     .subscribe({
//       next: (res: any) => {
//         console.log('API RESPONSE:', res);

//         // Make sure the API call was successful and data exists
//         if (res?.success && res.data) {
//           const data = res.data; // extract actual group object
// console.log('Form City:', this.addEditForm.get('cityId')?.value);
//       this.addEditForm.patchValue({
//   id: data.id ?? 0,
//   companyId: data.companyId ?? this.companyId,
//   groupId: data.groupId ?? 0,
//   stateUser: data.stateUser ?? '',
//   transportId: data.transportId ?? 0,

//   accountName: data.accountName ?? '',
//   address: data.address ?? '',
//   zipCode: data.zipCode ?? '',
//   email: data.email ?? '',
//   phone: data.phone ?? '',
//   gst: data.gst ?? '',
//   pan: data.pan ?? '',
//   adharNo: data.adharNo ?? '',
//   contectName: data.contectName ?? '',
//   contectNo: data.contectNo ?? '',

//   bankName: data.bankName ?? '',
//   ifscCode: data.ifscCode ?? '',
//   creditDay: data.creditDay ?? 0,
//   regdType: data.regdType ?? '',
//   registrationTypeId:data.registrationTypeId ?? '',

//   isTcsCompulsary: data.isTcsCompulsary ?? false,
//   tdsApplicabe: data.tdsApplicabe ?? false,
//   isItTransport: data.isItTransport ?? false,

//   transportMode: data.transportMode ?? '',
//   transportRate: data.transportRate ?? 0,
//   tcsLimit: data.tcsLimit ?? 0,

//   cityId: data.cityId ?? null,
//   tanNo: data.tanNo ?? '',
//   comments:data.comments ?? '',
//   opBalance: data.opBalance ?? 0,
//   openingBalanceType: data.openingBalanceType ?? 'Cr',
//   clsBalance: data.clsBalance ?? 0,
//   closingBalanceType: data.closingBalanceType ?? 'Cr',

//   agentAndAreaName: data.agentAndAreaName ?? '',
//   openingBalance: data.openingBalance ?? '',
//   closingBalance: data.closingBalance ?? '',

//   state: data.state ?? 0,
//   gstVatReturn: data.gstVatReturn ?? false,
//   maintBillWise: data.maintBillWise ?? false,

//   eComNo: data.eComNo ?? '',
//   expHsnCode: data.expHsnCode ?? '',
//   cinNo: data.cinNo ?? '',
//   ieCodeNo: data.ieCodeNo ?? '',

//   creditLimit: data.creditLimit ?? '',
//   inttRate: data.inttRate ?? '',
//   basicLimit: data.basicLimit ?? '',
//   taxFormName: data.taxFormName ?? '',
//   tradeType: data.tradeType ?? '',

//   agentId: data.agentId ?? 0,
//   gstVat: data.gstVat ?? 0
// });



//           console.log('FORM AFTER PATCH:', this.addEditForm.value);
//         }

//         this.showSpiner = false;
//         this.cdr.detectChanges();
//       },
//       error: (err) => {
//         console.error(err);
//         this.showSpiner = false;
//         this.cdr.detectChanges();
//       }
//     });
// }

updateData(): void {

  this.showSpiner = true;

  this.http
    .getAllDataId(
      ApiUrl.getDataForEditAccount,
      this.categoryId
    )
    .subscribe({

      next: (res: any) => {

        console.log('API RESPONSE:', res);

        if (res?.success && res.data) {

          const data = res.data;

          console.log('EDIT ACCOUNT DATA:', data);
          console.log('GST VAT RETURN:', data.gstVatReturn);
          console.log('GST VAT ID FROM API:', data.gstVat);


          // ============================================
          // GST/VAT ID
          // IMPORTANT:
          // mat-option value is number (gst.id)
          // so convert API value to number
          // ============================================

          const gstVatId =
            data.gstVat != null &&
            data.gstVat !== ''
              ? Number(data.gstVat)
              : 0;


          console.log(
            'GST VAT ID FOR FORM:',
            gstVatId
          );


          // ============================================
          // PATCH FORM
          // ============================================

          this.addEditForm.patchValue({

            id: data.id ?? 0,

            companyId:
              data.companyId ??
              this.companyId,

            groupId:
              data.groupId ??
              0,

            stateUser:
              data.stateUser ??
              '',

            transportId:
              data.transportId ??
              0,


            accountName:
              data.accountName ??
              '',

            address:
              data.address ??
              '',

            zipCode:
              data.zipCode ??
              '',

            email:
              data.email ??
              '',

            phone:
              data.phone ??
              '',

            gst:
              data.gst ??
              '',

            pan:
              data.pan ??
              '',

            adharNo:
              data.adharNo ??
              '',

            contectName:
              data.contectName ??
              '',

            contectNo:
              data.contectNo ??
              '',


            bankName:
              data.bankName ??
              '',

            ifscCode:
              data.ifscCode ??
              '',

            creditDay:
              data.creditDay ??
              0,

            regdType:
              data.regdType ??
              '',

            registrationTypeId:
              data.registrationTypeId ??
              0,


            isTcsCompulsary:
              data.isTcsCompulsary ??
              false,

            tdsApplicabe:
              data.tdsApplicabe ??
              false,

            isItTransport:
              data.isItTransport ??
              false,


            transportMode:
              data.transportMode ??
              '',

            transportRate:
              data.transportRate ??
              0,

            tcsLimit:
              data.tcsLimit ??
              0,


            cityId:
              data.cityId ??
              null,

            tanNo:
              data.tanNo ??
              '',

            comments:
              data.comments ??
              '',


            opBalance:
              data.opBalance ??
              0,

            openingBalanceType:
              data.openingBalanceType ??
              'Cr',

            clsBalance:
              data.clsBalance ??
              0,

            closingBalanceType:
              data.closingBalanceType ??
              'Cr',


            agentAndAreaName:
              data.agentAndAreaName ??
              '',

            openingBalance:
              data.openingBalance ??
              '',

            closingBalance:
              data.closingBalance ??
              '',


            state:
              data.state ??
              0,


            gstVatReturn:
              data.gstVatReturn ??
              false,

            maintBillWise:
              data.maintBillWise ??
              false,


            eComNo:
              data.eComNo ??
              '',

            expHsnCode:
              data.expHsnCode ??
              '',

            cinNo:
              data.cinNo ??
              '',

            ieCodeNo:
              data.ieCodeNo ??
              '',


            creditLimit:
              data.creditLimit ??
              '',

            inttRate:
              data.inttRate ??
              '',

            basicLimit:
              data.basicLimit ??
              '',

            taxFormName:
              data.taxFormName ??
              '',

            tradeType:
              data.tradeType ??
              '',


            agentId:
              data.agentId ??
              0,


            // ========================================
            // IMPORTANT
            // GST HEADING
            // ========================================

            gstVat:
              gstVatId

          });


          console.log(
            'FORM AFTER PATCH:',
            this.addEditForm.value
          );


          console.log(
            'FORM GST VAT:',
            this.addEditForm.get('gstVat')?.value
          );


          // ============================================
          // FORCE CHANGE DETECTION
          // ============================================

          this.cdr.detectChanges();

        }

        this.showSpiner = false;

      },


      error: (err) => {

        console.error(
          'GET ACCOUNT EDIT ERROR:',
          err
        );

        this.showSpiner = false;

        this.cdr.detectChanges();

      }

    });

}
handleOpeningBalanceValidation() {
  const opBalanceCtrl = this.addEditForm.get('opBalance');
  const typeCtrl = this.addEditForm.get('openingBalanceType');

  opBalanceCtrl?.valueChanges.subscribe(value => {
    if (value && Number(value) !== 0) {
      typeCtrl?.setValidators([Validators.required]);
    } else {
      typeCtrl?.clearValidators();
      typeCtrl?.setValue(''); // optional reset
    }
    typeCtrl?.updateValueAndValidity();
  });
}
handleClosingBalanceValidation() {
  const clsBalanceCtrl = this.addEditForm.get('clsBalance');
  const typeCtrl = this.addEditForm.get('closingBalanceType');

  clsBalanceCtrl?.valueChanges.subscribe(value => {
    if (value && Number(value) !== 0) {
      typeCtrl?.setValidators([Validators.required]);
    } else {
      typeCtrl?.clearValidators();
      typeCtrl?.setValue(''); // optional reset
    }
    typeCtrl?.updateValueAndValidity();
  });
}





makeForm() {
  this.addEditForm = this.fb.group({

    id: [0],
    companyId: [this.companyId, Validators.required],

    groupId: ['',Validators.required],
    stateUser: [''],
    transportId: [''],
    accountName: ['',Validators.required],
    address: [''],
    zipCode: [''],
    email: ['',],
    phone: [''],
    gst: [''],
    pan: [''],
    adharNo: [''],
    contectName: [''],
    contectNo: [''],
    bankName: [''],
    ifscCode: [''],
    creditDay: [0],
    regdType: [''],
    registrationTypeId:[''],
    isTcsCompulsary: [false],
    tdsApplicabe: [false],
    isItTransport: [false],
    transportMode: [''],
    transportRate: [0],
    tcsLimit: [0],
    cityId: [null],
    tanNo: [''],
    opBalance: [null],
    openingBalanceType: [''],   // Cr / Dr
    clsBalance: [0],
    closingBalanceType: [''],   // Cr / Dr
    agentAndAreaName: [''],
    openingBalance: [''],
    closingBalance: [''],
    state: [0],
    gstVatReturn: [false],
    maintBillWise: [false],
    eComNo: [''],
    expHsnCode: [''],
    cinNo: [''],
    ieCodeNo: [''],
    creditLimit: [''],
    inttRate: [''],
    basicLimit: [''],
    taxFormName: [''],
    tradeType: [''],
    comments:[''],
    agentId: [''],
    gstVat: [0]
  });
}








// onSubmit() {
//   this.submit = true;  // <-- mark form as submitted
// if (!this.addEditForm.value.agentId) {
//     this.addEditForm.patchValue({
//       agentId: 0
//     });
//   }

//     // Convert empty string to null
//   this.addEditForm.patchValue({
//     accountName: this.addEditForm.get('accountName')?.value?.trim() || null
//   });

//   if (this.addEditForm.invalid) {
//       this.addEditForm.markAllAsTouched();
//     return; // stop if form is invalid
//   }
  

 

//   this.http.addEditData(ApiUrl.addEditAccountMaster,this.addEditForm.value)
//     .subscribe({
//       next: (res: any) => {
//         const message = res?.message 
//           || (this.isEditMode ? 'Group updated successfully' : 'Group added successfully');

//         this.snackBar.open(message, 'Close', { duration: 3000 });

//         setTimeout(() => {
//           this.showSpiner = false;
//           setTimeout(() => this.dialogRef.close(true));
//         });
//       },
//       error: (err) => {
//         this.showSpiner = false;
//         this.snackBar.open(err?.error?.message || 'Failed to save group', 'Close', { duration: 3000 });
//       }
//     });
// }


onSubmit() {
  this.submit = true;

  if (!this.addEditForm.value.agentId) {
    this.addEditForm.patchValue({
      agentId: 0
    });
  }

    if (!this.addEditForm.value.registrationTypeId || this.addEditForm.value.registrationTypeId === '') {
  this.addEditForm.patchValue({
    registrationTypeId: 0
  });
}
  if (!this.addEditForm.value.transportId || this.addEditForm.value.transportId === '') {
  this.addEditForm.patchValue({
    transportId: 0
  });
}



  // Trim Account Name
  this.addEditForm.patchValue({
    accountName: this.addEditForm.get('accountName')?.value?.trim() || null
  });

  if (this.addEditForm.invalid) {
    this.addEditForm.markAllAsTouched();
    return;
  }

  this.showSpiner = true;

  this.http.addEditData(ApiUrl.addEditAccountMaster, this.addEditForm.value)
    .subscribe({
      next: (res: any) => {

        this.showSpiner = false;

        const message = res?.message ||
          (this.isEditMode
            ? 'Account updated successfully'
            : 'Account added successfully');

        this.snackBar.open(message, 'Close', {
          duration: 3000
        });

        // ===========================
        // EDIT MODE -> Close dialog
        // ===========================
        if (this.isEditMode) {
          this.dialogRef.close(true);
          return;
        }

        // ===========================
        // ADD MODE -> Reset form
        // ===========================
        this.submit = false;
        this.isAccountExists = false;

        this.addEditForm.reset({
          id: 0,
          companyId: this.companyId,
          groupId: '',
          gstVatReturn: false,
          maintBillWise: false,
          isTcsCompulsary: false,
          tdsApplicabe: false,
          isItTransport: false,
          gstVat: 0,
          cityId: null,
          transportId: '',
          agentId: 0,
          opBalance: null,
          openingBalanceType: '',
          clsBalance: 0,
          closingBalanceType: ''
        });

        this.addEditForm.markAsPristine();
        this.addEditForm.markAsUntouched();

        setTimeout(() => {
          this.accountNameRef.nativeElement.focus();
        }, 100);
      },

      error: (err) => {
        this.showSpiner = false;

        this.snackBar.open(
          err?.error?.message || 'Failed to save account',
          'Close',
          { duration: 3000 }
        );
      }
    });
}



get isEditMode(): boolean {
  return !!this.categoryId && this.categoryId > 0;
}

openGroupMaster(data?: any) {
  const dialogRef = this.dialog.open(AddEditGroupMaster, {
    width: '500px',
    data: data || null
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
       this.getGroupMaster(); // reload list automatically
    }
  });
}

openAgentMaster(data?: any) {
  const dialogRef = this.dialog.open(AddEditAgentMaster, {
    width: '500px',
    data: data || null
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
       this.getAllAgentMaster(); // reload list automatically
    }
  });
}


openTransportMaster(data?: any) {
   const dialogRef = this.dialog.open(AddEditTransportMaster, {
    width: '500px',
    data: data || null
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
       this.getAllTransport(); // reload list automatically
    }
  });
}


openGstVat(data?: any) {
   const dialogRef = this.dialog.open(AddEditGstVatMaster, {
      width: '500px',
      data: data || null
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
         this.getAllGSTVATData(); // reload list automatically
      }
    });
}


openRegistrationType(data?: any) {
   const dialogRef = this.dialog.open(AddEditRegisterType, {
      width: '500px',
      data: data || null
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
         this.getRegistTypeData(); // reload list automatically
      }
    });
}




openState(data?: any) {
   const dialogRef = this.dialog.open(State, {
      width: '500px',
      data: data || null
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
         this.getAllGSTVATData(); // reload list automatically
      }
    });
}


openCity(data?: any) {
   const dialogRef = this.dialog.open(City, {
       width: '360px',
      data: data || null
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
         this.getAllCity(); // reload list automatically
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
    this.changeLocation()
   
  }
@HostListener('document:keydown', ['$event'])
onArrowLeftBack(event: KeyboardEvent): void {

  // =====================================================
  // ONLY ARROW LEFT
  // =====================================================

  if (event.key !== 'ArrowLeft') {
    return;
  }

  const active =
    document.activeElement as HTMLElement | null;

  if (!active) {
    return;
  }

  // =====================================================
  // IGNORE TEXTAREA WHEN CURSOR IS INSIDE TEXT
  // =====================================================

  if (active.tagName.toLowerCase() === 'textarea') {

    const textarea =
      active as HTMLTextAreaElement;

    // If cursor is not at beginning,
    // allow normal ArrowLeft movement.
    if (
      textarea.selectionStart !== null &&
      textarea.selectionStart > 0
    ) {
      return;
    }
  }

  // =====================================================
  // FIND CURRENT MAT-SELECT
  // =====================================================

  const matSelect =
    active.closest(
      'mat-select'
    ) as HTMLElement | null;

  // =====================================================
  // FIND CURRENT RADIO
  // =====================================================

  const radio =
    active instanceof HTMLInputElement &&
    active.type === 'radio'
      ? active
      : null;

  // =====================================================
  // CURRENT CONTROL
  // =====================================================

  let current: HTMLElement | null =
    matSelect || radio || active;

  // =====================================================
  // FIND FORM
  // =====================================================

  const form =
    current.closest('form') as HTMLFormElement | null;

  if (!form) {
    return;
  }

  // =====================================================
  // GET ALL FORM CONTROLS
  // =====================================================

  const allControls =
    Array.from(
      form.querySelectorAll(
        'input:not([type="hidden"]):not([disabled]):not([readonly]), ' +
        'textarea:not([disabled]):not([readonly]), ' +
        'select:not([disabled]):not([readonly]), ' +
        'button:not([disabled]), ' +
        'mat-select'
      )
    ) as HTMLElement[];

  // =====================================================
  // BUILD NAVIGATION LIST
  // =====================================================

  const navigation: HTMLElement[] = [];

  for (const control of allControls) {

    // ===================================================
    // RADIO
    // ===================================================

    if (
      control instanceof HTMLInputElement &&
      control.type === 'radio'
    ) {

      const radioName =
        control.getAttribute('name');

      // If same radio group already exists,
      // don't add another radio.
      if (
        radioName &&
        navigation.some(
          x =>
            x instanceof HTMLInputElement &&
            x.type === 'radio' &&
            x.getAttribute('name') === radioName
        )
      ) {
        continue;
      }
    }

    navigation.push(control);
  }

  // =====================================================
  // FIND CURRENT INDEX
  // =====================================================

  let currentIndex =
    navigation.indexOf(current);

  // =====================================================
  // RADIO GROUP
  // =====================================================

  if (
    currentIndex === -1 &&
    radio
  ) {

    const radioName =
      radio.getAttribute('name');

    if (radioName) {

      currentIndex =
        navigation.findIndex(
          control =>
            control instanceof HTMLInputElement &&
            control.type === 'radio' &&
            control.getAttribute('name') === radioName
        );
    }
  }

  // =====================================================
  // MAT SELECT
  // =====================================================

  if (
    currentIndex === -1 &&
    matSelect
  ) {

    currentIndex =
      navigation.indexOf(matSelect);
  }

  if (currentIndex === -1) {
    return;
  }

  // =====================================================
  // PREVIOUS CONTROL
  // =====================================================

  const previous =
    navigation[currentIndex - 1];

  if (!previous) {
    return;
  }

  // =====================================================
  // STOP EVERYTHING
  // IMPORTANT FOR RADIO + MAT-SELECT
  // =====================================================

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  // =====================================================
  // MOVE BACK
  // =====================================================

  setTimeout(() => {

    // ===================================================
    // IF CURRENT IS MAT-SELECT
    // ===================================================

    if (matSelect) {

      /*
       * DO NOT change selected value.
       * DO NOT call setValue().
       * DO NOT call selectionChange().
       *
       * Just remove focus and move backward.
       */

      (document.activeElement as HTMLElement | null)
        ?.blur();

      previous.focus();

      return;
    }

    // ===================================================
    // IF CURRENT IS RADIO
    // ===================================================

    if (radio) {

      /*
       * IMPORTANT:
       * Do not click or change radio.
       * Only move focus.
       */

      radio.blur();

      previous.focus();

      return;
    }

    // ===================================================
    // NORMAL CONTROL
    // ===================================================

    previous.focus();

    // ===================================================
    // PUT CURSOR AT END
    // ===================================================

    if (
      previous instanceof HTMLInputElement &&
      (
        previous.type === 'text' ||
        previous.type === 'email' ||
        previous.type === 'number'
      )
    ) {

      try {

        const length =
          previous.value?.length || 0;

        previous.setSelectionRange(
          length,
          length
        );

      } catch {
        // Ignore
      }
    }

  }, 0);
}
}
