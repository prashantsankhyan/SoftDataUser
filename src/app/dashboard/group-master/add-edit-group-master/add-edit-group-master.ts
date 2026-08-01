import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject,AfterViewInit, NgZone, HostListener, ViewChild } from '@angular/core';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../material.module';
import { AllApiService } from '../../../_core/_service/all-api.service';
import { ApiUrl } from '../../../_core/apiUrl';
import { MatSelect } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@Component({
  selector: 'app-add-edit-group-master',
     imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule,NgxMatSelectSearchModule],
  templateUrl: './add-edit-group-master.html',
  styleUrl: './add-edit-group-master.scss',
  providers: [TitleCasePipe]
})
export class AddEditGroupMaster {
  @HostListener('keydown', ['$event'])
onKeyDown(event: KeyboardEvent) {

  if (event.key !== 'Enter') {
    return;
  }

  const target = event.target as HTMLElement;

  // Let Angular Material Select handle Enter
  if (
    target.classList.contains('mat-mdc-select-trigger') ||
    target.closest('mat-select') ||
    target.closest('.mat-mdc-select')
  ) {
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
      .mat-mdc-select-trigger,
      button:not([disabled])
      `
    )
  ).filter(
    (el: any) =>
      el.offsetParent !== null &&
      !el.hasAttribute('readonly')
  ) as HTMLElement[];

  const index = elements.indexOf(target);

  if (index > -1 && index < elements.length - 1) {

    const nextElement = elements[index + 1];

    nextElement.focus();

    // Automatically open mat-select
    if (
      nextElement.classList.contains('mat-mdc-select-trigger')
    ) {
      nextElement.click();
    }

  } else {
    this.onSubmit();
  }
}

focusNext(select: MatSelect) {

  setTimeout(() => {

    const current = select._elementRef.nativeElement;

    const form = current.closest('form');
    if (!form) return;

    const elements = Array.from(
      form.querySelectorAll(
        `
        input:not([disabled]),
        textarea:not([disabled]),
        .mat-mdc-select,
        select:not([disabled]),
        button:not([disabled])
        `
      )
    ).filter((el: any) =>
      el.offsetParent !== null &&
      !el.hasAttribute('readonly')
    ) as HTMLElement[];

    const index = elements.indexOf(current);

    if (index === -1) return;

    const next = elements[index + 1];

    if (!next) return;

    // Next is Angular Material Select
    const trigger = next.querySelector('.mat-mdc-select-trigger') as HTMLElement;

    if (trigger) {
      trigger.focus();
      trigger.click();   // automatically open next select
    } else {
      next.focus();
    }

  }, 150);
}
 showSpiner = true;
  submit = false ;
  companyId:any;
  
  alertMessage =''
  addEditForm!:FormGroup;
  groupId:any;
  successMessage = '';
  errorMessage = '';
  messageSuccess = true;
  listOfData: any[] = [];
   listOfGroupData: any[] = [];
  
  isAccountExists = false;
  filteredLists: { [key: string]: any[] } = {};
 currentDropdown = '';
 searchCtrl = new FormControl('');
  @ViewChild('groupCategory') groupCategory!: MatSelect;
  @ViewChild('appearIn') appearIn!: MatSelect;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,private titleCase: TitleCasePipe ,private http:AllApiService,private cRouter:ActivatedRoute,
  private router: Router,private ngZone: NgZone,public dialog: MatDialog,
  private snackBar: MatSnackBar,
  private cdr: ChangeDetectorRef,public dialogRef: MatDialogRef<AddEditGroupMaster>){}
 
 ngAfterViewInit(): void {
  if (this.groupId) {
    this.updateData();
  }
}
  ngOnInit(): void {

    this.companyId = JSON.parse(localStorage.getItem('loggedUser') || '{}').companyId;
   
    this.data;
  
    this.groupId = this.data?.groupId || 0;
    this.makeForm();
   
   
    this.getAllDataOfCategory();
    this.getAllGroupFix();

     // Reset Under Group dynamically
    this.addEditForm.get('appearIn')?.valueChanges.subscribe(val => {
      if (val != 4) {
        this.addEditForm.get('underGroup')?.reset();
      }
    });
    if(this.groupId) { 
      
       this.updateData() ;
      
   }
   else{
   this.showSpiner = false;
      }
       this.searchCtrl.valueChanges.subscribe(search => {

  const text = (search || '').toLowerCase().trim();

  switch (this.currentDropdown) {

    case 'groupCategory':
      this.filteredLists['groupCategory'] = this.listOfData.filter((x: any) =>
        (x.name || '').toLowerCase().includes(text)
      ).sort((a, b) => {
      const aName = (a.name || '').toLowerCase();
      const bName = (b.name || '').toLowerCase();

      const aStarts = aName.startsWith(search);
      const bStarts = bName.startsWith(search);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return aName.localeCompare(bName);
    });
      
      break;

    case 'underGroup':
      this.filteredLists['underGroup'] = this.listOfGroupData.filter((x: any) =>
        (x.groupName || '').toLowerCase().includes(text)
      ).sort((a, b) => {
      const aName = (a.groupName || '').toLowerCase();
      const bName = (b.groupName || '').toLowerCase();

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

checkDuplicateOnBlur() {
  const control = this.addEditForm.get('groupName');

  if (!control) return;

  let value = (control.value || '').trim();

  // Remove extra spaces
  value = value.replace(/\s+/g, ' ');

  control.setValue(value);

  if (!value) {
    control.setErrors(null);
    return;
  }

  this.http.getAllDataByThreId(
    ApiUrl.existGroup,
    this.companyId,
    value,
    this.groupId || 0
  )
  .subscribe((res: any) => {

    console.log('Duplicate API Response:', res);

    const exists = res?.data?.existsData === true;

    if (exists) {
      control.setErrors({
        ...(control.errors || {}),
        duplicate: true
      });
    } else {

      const errors = { ...(control.errors || {}) };

      delete errors['duplicate'];

      control.setErrors(
        Object.keys(errors).length
          ? errors
          : null
      );
    }

    control.markAsTouched();
    control.markAsDirty();

    // Force Angular refresh
    this.cdr.detectChanges();

    console.log('Form Errors:', control.errors);
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
 
updateData(): void {
  this.showSpiner = true;

  this.http.getAllDataId(ApiUrl.getGroupById, this.groupId)
    .subscribe({
      next: (res: any) => {
        console.log('API RESPONSE:', res);

        // Make sure the API call was successful and data exists
        if (res?.success && res.data) {
          const data = res.data; // extract actual group object

          this.addEditForm.patchValue({
            groupId: data.groupId,
            companyId: data.companyId,
            groupName: data.groupName,
           appearIn: Number(data.appearIn),
            groupCategory: Number(data.groupCategory),
            underGroup: data.underGroup,
            annexureNo: data.annexureNo
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




onOpened(type: string, opened: boolean) {

  if (!opened) {
    return;
  }

  this.currentDropdown = type;

  // Clear previous search
  this.searchCtrl.setValue('', { emitEvent: false });

  switch (type) {

    case 'groupCategory':
      this.filteredLists['groupCategory'] = [...this.listOfData];
      break;

    case 'underGroup':
      this.filteredLists['underGroup'] = [...this.listOfGroupData];
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

makeForm() {
  this.addEditForm = this.fb.group({
    groupId: [0],
    companyId: [this.companyId, Validators.required],
    groupName: ['',Validators.required],
    appearIn: [null,Validators.required],
    groupCategory: [null,Validators.required],
    underGroup: [null],
    annexureNo: ['']
  });
}

 getAllDataOfCategory(): void {
  this.http.getAllData(ApiUrl.getCategraryStaticForCompany)
    .subscribe({
      next: (res: any) => {
        if (res?.success) {
           this.listOfData = (res.data ?? []).sort((a: any, b: any) =>
            (a.name || '').localeCompare(b.name || '')
          );
           this.cdr.detectChanges();  
        }
      },
      error: err => console.error(err)
    });
}


getAllGroupFix(): void {
  this.http.getAllData(ApiUrl.getGrorpForSubGroup)
    .subscribe({
      next: (res: any) => {
        if (res?.success) {

          this.listOfGroupData = (res.data ?? []).sort((a: any, b: any) =>
            (a.groupName || '').localeCompare(b.groupName || '')
          );

          // IMPORTANT
          this.filteredLists['underGroup'] = [...this.listOfGroupData];

          this.cdr.detectChanges();

          // Call update only after options loaded
          if (this.groupId) {
            this.updateData();
          }
        }
      },
      error: err => console.error(err)
    });
}
 
// onSubmit() {
//   this.submit = true;  

//   if (this.addEditForm.invalid) {
//     return; 
//   }

 

//   this.http.addEditData(ApiUrl.addEditGroup, this.addEditForm.value)
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

  // Stop if form invalid
  if (this.addEditForm.invalid) {
    this.addEditForm.markAllAsTouched();
    return;
  }

  // Stop duplicate save
  if (this.f['groupName'].errors?.['duplicate']) {
    this.snackBar.open(
      'Group Name already exists',
      'Close',
      { duration: 3000 }
    );
    return;
  }

  this.showSpiner = true;

  this.http
    .addEditData(
      ApiUrl.addEditGroup,
      this.addEditForm.value
    )
    .subscribe({
      next: (res: any) => {

        this.showSpiner = false;

        const message =
          res?.message ||
          (this.isEditMode
            ? 'Group updated successfully'
            : 'Group added successfully');

        this.snackBar.open(
          message,
          'Close',
          { duration: 3000 }
        );

        this.dialogRef.close(true);
      },

      error: (err) => {
        this.showSpiner = false;

        this.snackBar.open(
          err?.error?.message ||
          'Failed to save group',
          'Close',
          { duration: 3000 }
        );
      }
    });
}




get isEditMode(): boolean {
  return !!this.groupId && this.groupId > 0;
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
