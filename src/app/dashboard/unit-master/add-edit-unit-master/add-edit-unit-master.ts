import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject,AfterViewInit, NgZone, HostListener } from '@angular/core';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../material.module';
import { AllApiService } from '../../../_core/_service/all-api.service';
import { ApiUrl } from '../../../_core/apiUrl';

@Component({
  selector: 'app-add-edit-unit-master',
 imports: [CommonModule,MaterialModule,RouterModule,ReactiveFormsModule,FormsModule],
  templateUrl: './add-edit-unit-master.html',
  styleUrl: './add-edit-unit-master.scss',
   providers: [TitleCasePipe]
})
export class AddEditUnitMaster {
   @HostListener('keydown', ['$event'])
onKeyDown(event: KeyboardEvent) {

  if (event.key !== 'Enter') {
    return;
  }

  const target = event.target as HTMLElement;

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
  showSpiner = true;
  submit = false ;
  companyId:any;
  
  alertMessage =''
  addEditForm!:FormGroup;
  unitId:any;
  successMessage = '';
  errorMessage = '';
  messageSuccess = true;
  listOfData: any[] = [];
   listOfGroupData: any[] = [];
  
 isDuplicateUnitName = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,private titleCase: TitleCasePipe ,private http:AllApiService,private cRouter:ActivatedRoute,
  private router: Router,private ngZone: NgZone,public dialog: MatDialog,
  private snackBar: MatSnackBar,
  private cdr: ChangeDetectorRef,public dialogRef: MatDialogRef<AddEditUnitMaster>){}
 
 ngAfterViewInit(): void {
  if (this.unitId) {
    this.updateData();
  }
}
  ngOnInit(): void {
   
    this.companyId = JSON.parse(localStorage.getItem('loggedUser') || '{}').companyId;
    this.data;
 
    this.unitId = this.data?.id || 0 ;
   
   
     this.makeForm();
     this.getAllData();
     this.addEditForm.get('unitName')?.valueChanges.subscribe(() => {
    this.checkItemGroupExists();
  });
   

     // Reset Under Group dynamically
  
    if(this.unitId) { 
      
       this.updateData() ;
      
   }
   else{
   this.showSpiner = false;
      }
   }

getAllData(): void {
  this.http.getAllDataId(ApiUrl.listOfUnitMaster, this.companyId)
    .subscribe({
      next: (res: any) => {

        if (!res || !Array.isArray(res.data)) {
          this.listOfData = [];
          return;
        }

        this.listOfData = res.data.filter(
          (x: any) => x.companyId === 0 || x.companyId === this.companyId
        );

        console.log('Units:', this.listOfData);
      },
      error: (err) => {
        console.error(err);
        this.listOfData = [];
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




 
updateData(): void {
  this.showSpiner = true;

  this.http.getAllDataId(ApiUrl.editUnitMasterById,this.unitId)
    .subscribe({
      next: (res: any) => {
        console.log('API RESPONSE:', res);

        // Make sure the API call was successful and data exists
        if (res?.success && res.data) {
          const data = res.data; // extract actual group object

          this.addEditForm.patchValue({
            id: data.id,
            companyId: data.companyId,
            unitName: data.unitName,
            quantity: data.quantity,
            decimal:data.decimal,

         
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



checkItemGroupExists(): void {

  const value = (this.addEditForm.get('unitName')?.value || '')
    .trim()
    .toLowerCase();

  if (!value) {
    this.isDuplicateUnitName = false;
    return;
  }

  this.isDuplicateUnitName = this.listOfData.some((item: any) =>
    item.unitName?.trim().toLowerCase() === value &&
    item.id !== this.unitId
  );
}


makeForm() {
  this.addEditForm = this.fb.group({
    id: [0],
    companyId: [this.companyId, Validators.required],
    unitName: ['', Validators.required],
    quantity: ['', Validators.required],
    decimal: ['', Validators.required],


  
  });
}






onSubmit() {
  this.submit = true;  // <-- mark form as submitted

  if (this.addEditForm.invalid) {
    return; // stop if form is invalid
  }

 

  this.http.addEditData(ApiUrl.addEditUnitMaster, this.addEditForm.value)
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
  return !!this.unitId && this.unitId > 0;
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
