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
import { AddEditUnitMaster } from '../../unit-master/add-edit-unit-master/add-edit-unit-master';
import { AddEditItemGroupMaster } from '../../item-group-master/add-edit-item-group-master/add-edit-item-group-master';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@Component({
  selector: 'app-add-edit-item-master',
  imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule,
    NgxMatSelectSearchModule
  ],
  templateUrl: './add-edit-item-master.html',
  styleUrl: './add-edit-item-master.scss',
  providers: [TitleCasePipe]
})
export class AddEditItemMaster {
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
  // Handle only Enter and Tab
  if (event.key !== 'Enter' && event.key !== 'Tab') {
    return;
  }

  const target = event.target as HTMLElement;

  // Item Name validation
  if (target.getAttribute('formControlName') === 'itemName') {

    const control = this.addEditForm.get('itemName');

    // Empty
    if (!control?.value || !control.value.toString().trim()) {

      event.preventDefault();
      event.stopImmediatePropagation();

      control?.markAsTouched();

      this.snackBar.open('Please enter Item Name', 'Close', {
        duration: 2000
      });

      this.itemNameRef.nativeElement.focus();
      return;
    }

    // Duplicate
    if (control.hasError('duplicate')) {

      event.preventDefault();
      event.stopImmediatePropagation();

      this.snackBar.open('Item Name already exists', 'Close', {
        duration: 2000
      });

      this.itemNameRef.nativeElement.focus();
      return;
    }
  }

  // Don't intercept Shift+Enter in textarea
  if (target.tagName === 'TEXTAREA' && event.shiftKey) {
    return;
  }

  // Prevent default Enter/Tab behavior
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
private getAllSelects(): MatSelect[] {
  return [
    this.unitSelect,
    this.itemGroupSelect,
    this.categoryId,
    this.cgstSgstSale,
    this.igstSaleName,
    this.cgstSgstPurchase,
    this.igstPurchase
  ];
}
focusNext(select: MatSelect) {

  setTimeout(() => {

    const current = select._elementRef.nativeElement;
    const form = current.closest('form');

    if (!form) return;

    const elements = Array.from(
      form.querySelectorAll(`
        input:not([disabled]),
        textarea:not([disabled]),
        mat-select,
        button:not([disabled])
      `)
    ).filter((el: any) =>
      el.offsetParent !== null &&
      !el.hasAttribute('readonly')
    ) as HTMLElement[];

    const index = elements.indexOf(current);

    if (index === -1 || index === elements.length - 1) {
      return;
    }

    const next = elements[index + 1];

    if (next.tagName.toLowerCase() === 'mat-select') {

      const nextSelect = this.getAllSelects().find(
        s => s._elementRef.nativeElement === next
      );

      if (nextSelect) {
        nextSelect.focus();
        nextSelect.open();
      }

    } else {
      next.focus();
    }

  }, 100);
}
@ViewChild('itemNameRef')
itemNameRef!: ElementRef<HTMLInputElement>;
@ViewChild('unitSelect') unitSelect!: MatSelect;
@ViewChild('itemGroupSelect') itemGroupSelect!: MatSelect;
@ViewChild('categoryId') categoryId!: MatSelect;
@ViewChild('cgstSgstSale') cgstSgstSale!: MatSelect;
@ViewChild('igstSaleName') igstSaleName!: MatSelect;
@ViewChild('cgstSgstPurchase') cgstSgstPurchase!: MatSelect;
@ViewChild('igstPurchase') igstPurchase!: MatSelect;

blockDuplicateItem(event: KeyboardEvent) {

  if (event.key !== 'Tab' && event.key !== 'Enter') {
    return;
  }

  event.preventDefault();
  event.stopImmediatePropagation();

  const control = this.addEditForm.get('itemName');

  if (!control) return;

  const value = (control.value || '').trim();

  if (!value) {
    control.markAsTouched();
    this.itemNameRef.nativeElement.focus();
    return;
  }

  this.http.getAllDataByThreId(
    ApiUrl.alreadyExistItemMaster,
    this.companyId,
    value,
    this.itemId || 0
  ).subscribe((res: any) => {

    const exists = res?.data?.existsData === true;

    if (exists) {

      control.setErrors({
        ...(control.errors || {}),
        duplicate: true
      });

      control.markAsTouched();

      this.itemNameRef.nativeElement.focus();

    } else {

      const errors = { ...(control.errors || {}) };
      delete errors['duplicate'];

      control.setErrors(
        Object.keys(errors).length ? errors : null
      );

      // Move to next control only if not duplicate
      const form = this.itemNameRef.nativeElement.closest('form');
      if (!form) return;

      const elements = Array.from(
        form.querySelectorAll(
          'input:not([disabled]), textarea:not([disabled]), mat-select, button:not([disabled])'
        )
      ).filter((el: any) => el.offsetParent !== null) as HTMLElement[];

      const index = elements.indexOf(this.itemNameRef.nativeElement);

      if (index > -1 && index < elements.length - 1) {
        elements[index + 1].focus();
      }
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
moveToNextDropdown(current: string) {

  if (current === 'unit') {
    setTimeout(() => this.itemGroupSelect.focus());
  }

  if (current === 'itemGroup') {
    setTimeout(() => this.categoryId.focus());
  }

  if (current === 'category') {
    setTimeout(() => {
      const desc = document.querySelector(
        'input[formControlName="description"]'
      ) as HTMLInputElement;

      desc?.focus();
    });
  }
   if (current === 'cgstSgstSale') {
    setTimeout(() => this.igstSaleName.focus());
  }
   if (current === 'igstSaleName') {
    setTimeout(() => this.cgstSgstPurchase.focus());
  }
   if (current === 'cgstSgstPurchase') {
    setTimeout(() => this.igstPurchase.focus());
  }
  if (current === 'igstPurchase') {
    setTimeout(() => {
      const desc = document.querySelector(
        'input[formControlName="taxRate"]'
      ) as HTMLInputElement;

      desc?.focus();
    });
  }
}
focusToCategory() {
  setTimeout(() => {
    const category = document.querySelector(
      '[formControlName="categoryId"]'
    ) as HTMLElement;

    category?.focus();
  }, 100);
}

isSaving = false;
 showSpiner = true;
  submit = false ;
  companyId:any;
  userName:any;
  
  alertMessage =''
  addEditForm!:FormGroup;
  itemId:any;
  successMessage = '';
  errorMessage = '';
  messageSuccess = true;
  listOfData: any[] = [];
   listOfHeading: any[] = []; 
   originalList: any[] = [];
   listOfUnit:any[] =[];
   listOfItmeGorup:any[] =[];
   listOfCategory:any[]=[];
  
  isAccountExists = false;

  saleCgstSgstList: any[] = [];
saleIgstList: any[] = [];

purchaseCgstSgstList: any[] = [];
purchaseIgstList: any[] = [];

filteredLists: { [key: string]: any[] } = {};
 currentDropdown = '';
 searchCtrl = new FormControl('');
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,private titleCase: TitleCasePipe ,private http:AllApiService,private cRouter:ActivatedRoute,
  private router: Router,private ngZone: NgZone,public dialog: MatDialog,
  private snackBar: MatSnackBar,
  private cdr: ChangeDetectorRef,public dialogRef: MatDialogRef<AddEditItemMaster>){}
 
 ngAfterViewInit(): void {
  if (this.itemId) {
    this.updateData();
  }
}
  ngOnInit(): void {
    this.companyId = JSON.parse(localStorage.getItem('loggedUser') || '{}').companyId;
     this.userName = JSON.parse(localStorage.getItem('loggedUser') || '{}').username;
    
    
    this.data;
 
    this.itemId = this.data?.itemId || 0;
   
   
    this.makeForm();
      this.addEditForm.get('openingStock')?.valueChanges.subscribe(() => {
    this.calculateOpeningStockValue();
  });

  this.addEditForm.get('openingStockRate')?.valueChanges.subscribe(() => {
    this.calculateOpeningStockValue();
  });
    this.getItemGroupMaster();
    this.getAllUnit();
    this.getAllData();
    this.getAllCategory();
    this.getAllTaxTable();
   
   

     // Reset Under Group dynamically
  
    if(this.itemId) { 
      
       this.updateData() ;
      
   }
   else{
   this.showSpiner = false;
      }
      this.searchCtrl.valueChanges.subscribe(search => {

  search = (search || '').toLowerCase();

  switch (this.currentDropdown) {

    case 'unit':
      this.filteredLists['unit'] = this.listOfUnit.filter(x =>
        (x.unitName || '').toLowerCase().includes(search)
      ).sort((a, b) => {
      const aName = (a.unitName || '').toLowerCase();
      const bName = (b.unitName || '').toLowerCase();

      const aStarts = aName.startsWith(search);
      const bStarts = bName.startsWith(search);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return aName.localeCompare(bName);
    });
      break;;
    

    case 'itemGroup':
      this.filteredLists['itemGroup'] = this.listOfItmeGorup.filter((x:any) =>
        (x.itemGroupName || '').toLowerCase().includes(search)
      ).sort((a, b) => {
      const aName = (a.itemGroupName || '').toLowerCase();
      const bName = (b.itemGroupName || '').toLowerCase();

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

  

  // ALT + U → Unit Master
  if (event.altKey && event.key.toLowerCase() === 'c') {
    if (activeElement === this.unitSelect?._elementRef.nativeElement ||
      this.unitSelect?.focused
    ) {
      event.preventDefault();
      this.openUnitMasterDialog();
    }
  }

  // ALT + G → Item Group Master
  if (event.altKey && event.key.toLowerCase() === 'c') {
    if (activeElement === this.itemGroupSelect?._elementRef.nativeElement ||
       this.itemGroupSelect?.focused
    ) {
      event.preventDefault();
      this.openItemGroupMasterDialog();
    }
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

    case 'unit':
      this.filteredLists['unit'] = [...this.listOfUnit];
      break;

    case 'itemGroup':
      this.filteredLists['itemGroup'] = [...this.listOfItmeGorup];
      break;

  case 'category':
  this.filteredLists['category'] = [...this.listOfCategory];
  break;

    case 'saleCgstSgst':
      this.filteredLists['saleCgstSgst'] = [...this.saleCgstSgstList];
      break;

    case 'saleIgst':
      this.filteredLists['saleIgst'] = [...this.saleIgstList];
      break;

      case 'purchaseCgstSgst':
      this.filteredLists['purchaseCgstSgst'] = [...this.purchaseCgstSgstList];
      break;
        case 'purchaseIgst':
      this.filteredLists['purchaseIgst'] = [...this.purchaseIgstList];
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



getItemGroupMaster() {
  this.http
    .getAllDataId(ApiUrl.getItemGroupBy, this.companyId)
    .subscribe((res: any) => {

      if (!res || !Array.isArray(res.data)) {
        this.listOfItmeGorup = [];
        return;
      }

      const filtered = res.data.filter(
        (x: any) => x.companyId === 0 || x.companyId === this.companyId
      );

      this.originalList = filtered.sort((a: any, b: any) =>
        a.itemGroupName.localeCompare(b.itemGroupName)
      );

      // this.listOfItmeGorup = [...this.originalList];

         this.listOfItmeGorup = [...filtered];
this.filteredLists['itemGroup'] = [...this.listOfItmeGorup];
      this.cdr.detectChanges();
    });
}


checkDuplicateOnBlur() {
  const control = this.addEditForm.get('itemName');

  if (!control) return;

  let value = control.value || '';

  // remove extra spaces
  value = value.replace(/\s+/g, ' ').trim();

  control.setValue(value, { emitEvent: false });

  if (!value) {
    this.isAccountExists = false;

    const errors = { ...(control.errors || {}) };
    delete errors['duplicate'];

    control.setErrors(
      Object.keys(errors).length ? errors : null
    );

    return;
  }

  this.http.getAllDataByThreId(
    ApiUrl.alreadyExistItemMaster,
    this.companyId,
    value,
    this.itemId || 0
  )
  .subscribe((res: any) => {

    const exists = res?.data?.existsData === true;

    this.isAccountExists = exists;

    const errors = { ...(control.errors || {}) };

    if (exists) {
      errors['duplicate'] = true;
    } else {
      delete errors['duplicate'];
    }

    control.setErrors(
      Object.keys(errors).length ? errors : null
    );

    control.markAsTouched();

    // IMPORTANT
    this.cdr.detectChanges();
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

      // this.listOfUnit = [...this.originalList];
      this.listOfUnit = [...filtered];
this.filteredLists['unit'] = [...this.listOfUnit];

if (this.itemId) {
  this.updateData();
}
      
      this.cdr.detectChanges();
       // <-- IMPORTANT
     
    });
}



getAllData() {
  this.http
    .getAllDataId(ApiUrl.listOfHeading, this.companyId)
    .subscribe((res: any) => {

      if (!res || !Array.isArray(res.data)) {
        this.listOfHeading = [];
        return;
      }

      const filtered = res.data.filter(
        (x: any) => x.companyId === 0 || x.companyId === this.companyId
      );

      this.originalList = filtered.sort((a: any, b: any) =>
        a.headingName.localeCompare(b.headingName)
      );

      this.listOfHeading = [...this.originalList];
      this.cdr.detectChanges();
    });
}


getAllCategory() {
  this.http
    .getAllDataId(ApiUrl.listOfCategory, this.companyId)
    .subscribe((res: any) => {

      if (!res?.success || !Array.isArray(res.data)) {
        this.listOfCategory = [];
        return;
      }

      this.listOfCategory = res.data
        .filter((x: any) => x.companyId === 0 || x.companyId === this.companyId)
        .sort((a: any, b: any) =>
          a.categoryName.localeCompare(b.categoryName)
        );
    });
}




getAllTaxTable() {
  this.http
    .getAllDataId(ApiUrl.listOfTaxTable, this.companyId)
    .subscribe((res: any) => {

      if (!res || !Array.isArray(res.data)) {
        this.listOfData = [];
        return;
      }

      const filtered = res.data.filter(
        (x: any) =>
          x.companyId === 0 ||
          x.companyId === this.companyId
      );

      // Main list
      this.originalList = filtered.sort((a: any, b: any) =>
        (a.salePurcAccountName ?? '').localeCompare(
          b.salePurcAccountName ?? ''
        )
      );

      this.listOfData = [...this.originalList];

      // ==========================
      // SALE TAX
      // ==========================
      const saleTaxes = filtered.filter((x: any) =>
        x.selectType?.toLowerCase().includes('sale')
      );

      // CGST + SGST Sale
      this.saleCgstSgstList = saleTaxes.filter(
        (x: any) =>
          x.gstApplicabeCentral &&
          x.gstApplicabeLocal
      );

      // IGST Sale
      this.saleIgstList = saleTaxes.filter(
        (x: any) =>
          x.gstApplicabeCentral &&
          !x.gstApplicabeLocal
      );

      // ==========================
      // PURCHASE TAX
      // ==========================
      const purchaseTaxes = filtered.filter((x: any) =>
        x.selectType?.toLowerCase().includes('purchase')
      );

      // CGST + SGST Purchase
      this.purchaseCgstSgstList = purchaseTaxes.filter(
        (x: any) =>
          x.gstApplicabeCentral &&
          x.gstApplicabeLocal
      );

      // IGST Purchase
      this.purchaseIgstList = purchaseTaxes.filter(
        (x: any) =>
          x.gstApplicabeCentral &&
          !x.gstApplicabeLocal
      );

      this.cdr.detectChanges();
    });
}

 
updateData(): void {
  this.showSpiner = true;

  this.http.getAllDataId(ApiUrl.getItemMasterForEdit,this.itemId)
    .subscribe({
      next: (res: any) => {
        console.log('API RESPONSE:', res);

        // Make sure the API call was successful and data exists
        if (res?.success && res.data) {
          const data = res.data; // extract actual group object
         console.log('unitId',data.unitInt)
         this.addEditForm.patchValue({
  itemId: data.itemId,
  companyId: data.companyId,

  itemName: data.itemName,
  description: data.description,

  unit: data.unit,
  unitInt: data.unitInt,
  categoryId:data.categoryId,

  saleRate: data.saleRate,
  purchaseRate:data.purchaseRate,
  mrpRate: data.mrpRate,

  hsn: data.hsn,
  itemType: data.itemType,

  discount: data.discount,
  total: data.total,

  openingStock: data.openingStock,
  openingStockRate: data.openingStockRate,
  openingStockValue: data.openingStockValue,

  packingInUnit: data.packingInUnit,
  packing: data.packing,

  barCodeType: data.barCodeType,
  itemBarCodeOrPartNo: data.itemBarCodeOrPartNo,

  cgstSgstSale: data.cgstSgstSale,
  igstSaleName: data.igstSaleName,

  cgstSgstPurchase: data.cgstSgstPurchase,
  igstPurchase: data.igstPurchase,

  taxRate: data.taxRate,
  cessRate: data.cessRate,
  cessQty: data.cessQty,

  itemGroupId: data.itemGroupId,

  enterBy: data.enterBy,
  enteredOn: data.enteredOn ? new Date(data.enteredOn) : new Date()
});


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






makeForm() {
  this.addEditForm = this.fb.group({

    itemId: [0],
    companyId: [this.companyId, Validators.required],

    itemName: ['', Validators.required],
    description: [''],
    categoryId:[0],

    unit: [''],
    unitInt: ['',Validators.required],

    saleRate: [0],
    purchaseRate:[0],
    mrpRate: [0],

    hsn: [''],
    itemType: [''],

    discount: [0],
    total: [0],

    openingStock: [0],
    openingStockRate: [0],
    openingStockValue: [0],

    packingInUnit: [0],
    packing: [0],

    barCodeType: [''],
    itemBarCodeOrPartNo: [''],

    cgstSgstSale: [0],
    igstSaleName: [0],

    cgstSgstPurchase: [0],
    igstPurchase: [0],

    taxRate: [0],
    cessRate: [0],
    cessQty: [0],

    itemGroupId: ['', Validators.required],

    enterBy: [''],
    enteredOn: [new Date()]
  });
}







onSubmit() {
  this.submit = true;  // <-- mark form as submitted

  if (this.addEditForm.invalid) {
    return; // stop if form is invalid
  }

 

  this.http.addEditData(ApiUrl.addEditItemMaster, this.addEditForm.value)
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
  return !!this.itemId && this.itemId > 0;
}

openUnitMasterDialog(data?: any) {
  const dialogRef = this.dialog.open(AddEditUnitMaster, {
    width: '500px',
    data: data || null
  });

  dialogRef.afterClosed().subscribe(res => {
    if (res) {
      this.getAllUnit();
    }
  });
}

openItemGroupMasterDialog(data?: any) {
  const dialogRef = this.dialog.open(AddEditItemGroupMaster, {
    width: '800px',
    data: data || null
  });

  dialogRef.afterClosed().subscribe(res => {
    if (res) {
      this.getItemGroupMaster();
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
